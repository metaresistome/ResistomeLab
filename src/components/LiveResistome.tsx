import { useEffect, useRef } from 'react'
import { isSnapshotMode } from '@/lib/snapshot'

/**
 * "Live Resistome" — a continuous, generative AMR simulation.
 *
 * Bacteria swim between three One Health zones (human, animal, environment,
 * drawn as shimmering dotted silhouettes). Periodically a wave of antibiotic
 * molecules sweeps the field: susceptible (mint) bacteria touched by a
 * molecule die, while resistant (amber) bacteria survive, multiply — and pass
 * their resistance to neighbours on contact (a conjugation flash). Over time
 * the population turns amber; then fresh susceptible lineages immigrate and
 * the cycle of selection begins again. Motion trails, glow, pointer repulsion.
 */

type Bac = {
  x: number
  y: number
  angle: number
  speed: number
  size: number
  resistant: boolean
  hp: number
  wobble: number
  tx: number
  ty: number
  retarget: number
}

type Drug = { x: number; y: number; vx: number; vy: number; spin: number }

type Flash = { x: number; y: number; t: number }

type Zone = {
  x: number
  y: number
  r: number
  dots: { x: number; y: number }[]
  resFrac: number
}

const SUSC = ['#b9f2e7', '#93e9d9', '#d2f7ef']
const RES = ['#f5a85e', '#ec8c46', '#ffcf82']
const BG = 'rgba(14, 52, 53, 0.3)' // motion-trail fade; matches --primary

/** Draw a silhouette on an offscreen canvas and sample it into dots. */
function sampleShape(draw: (c: CanvasRenderingContext2D, s: number) => void, size: number) {
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const c = off.getContext('2d')!
  c.fillStyle = '#fff'
  c.strokeStyle = '#fff'
  draw(c, size)
  const img = c.getImageData(0, 0, size, size).data
  const pts: { x: number; y: number }[] = []
  const stride = 3
  for (let y = 0; y < size; y += stride) {
    for (let x = 0; x < size; x += stride) {
      if (img[(y * size + x) * 4 + 3] > 120) pts.push({ x: x / size - 0.5, y: y / size - 0.5 })
    }
  }
  return pts
}

function humanShape(c: CanvasRenderingContext2D, s: number) {
  const u = s / 100
  c.beginPath()
  c.arc(50 * u, 16 * u, 10 * u, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.roundRect(38 * u, 28 * u, 24 * u, 34 * u, 10 * u)
  c.fill()
  c.lineWidth = 6.5 * u
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(41 * u, 34 * u)
  c.lineTo(30 * u, 56 * u)
  c.moveTo(59 * u, 34 * u)
  c.lineTo(70 * u, 56 * u)
  c.stroke()
  c.lineWidth = 7 * u
  c.beginPath()
  c.moveTo(45 * u, 60 * u)
  c.lineTo(43 * u, 86 * u)
  c.moveTo(55 * u, 60 * u)
  c.lineTo(57 * u, 86 * u)
  c.stroke()
}

function pawShape(c: CanvasRenderingContext2D, s: number) {
  const u = s / 100
  c.beginPath()
  c.ellipse(50 * u, 62 * u, 17 * u, 13 * u, 0, 0, Math.PI * 2)
  c.fill()
  const toes: [number, number, number][] = [
    [26, 42, 7.5],
    [42, 30, 8],
    [58, 30, 8],
    [74, 42, 7.5],
  ]
  for (const [x, y, r] of toes) {
    c.beginPath()
    c.arc(x * u, y * u, r * u, 0, Math.PI * 2)
    c.fill()
  }
}

function leafShape(c: CanvasRenderingContext2D, s: number) {
  const u = s / 100
  c.save()
  c.translate(50 * u, 52 * u)
  c.rotate(-Math.PI / 4)
  c.beginPath()
  c.ellipse(0, 0, 26 * u, 15 * u, 0, 0, Math.PI * 2)
  c.fill()
  c.restore()
  c.lineWidth = 4 * u
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(66 * u, 68 * u)
  c.quadraticCurveTo(74 * u, 78 * u, 78 * u, 88 * u)
  c.stroke()
}

export function LiveResistome({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    let width = 0
    let height = 0
    let bacs: Bac[] = []
    let drugs: Drug[] = []
    let flashes: Flash[] = []
    let zones: Zone[] = []
    let lastWave = 0
    let waveDir = 0
    const start = performance.now()
    const mouse = { x: -9999, y: -9999 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const snapshot = isSnapshotMode()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const CAP = 96

    function pickTarget(): { x: number; y: number } {
      if (Math.random() < 0.55 && zones.length) {
        const z = zones[Math.floor(Math.random() * zones.length)]
        const a = Math.random() * Math.PI * 2
        const d = Math.sqrt(Math.random()) * z.r * 0.9
        return { x: z.x + Math.cos(a) * d, y: z.y + Math.sin(a) * d }
      }
      return { x: Math.random() * width, y: Math.random() * height }
    }

    function build() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const r = Math.min(width, height) * 0.19
      const defs = [
        { fx: 0.5, fy: 0.26, shape: humanShape },
        { fx: 0.24, fy: 0.74, shape: pawShape },
        { fx: 0.76, fy: 0.74, shape: leafShape },
      ]
      zones = defs.map((d) => ({
        x: d.fx * width,
        y: d.fy * height,
        r,
        dots: sampleShape(d.shape, 100),
        resFrac: 0.1,
      }))

      bacs = Array.from({ length: CAP }, () => {
        const t = pickTarget()
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          angle: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 0.4,
          size: 2.2 + Math.random() * 1.8,
          resistant: Math.random() < 0.08,
          hp: 1,
          wobble: Math.random() * 1000,
          tx: t.x,
          ty: t.y,
          retarget: Math.random() * 200,
        }
      })
      drugs = []
      flashes = []
    }

    function spawnWave(now: number) {
      lastWave = now
      waveDir = Math.floor(Math.random() * 4)
      const n = 26
      for (let i = 0; i < n; i++) {
        if (waveDir === 0) drugs.push({ x: Math.random() * width, y: -10, vx: 0, vy: 0.9 + Math.random() * 0.5, spin: Math.random() * 6 })
        if (waveDir === 1) drugs.push({ x: Math.random() * width, y: height + 10, vx: 0, vy: -(0.9 + Math.random() * 0.5), spin: Math.random() * 6 })
        if (waveDir === 2) drugs.push({ x: -10, y: Math.random() * height, vx: 0.9 + Math.random() * 0.5, vy: 0, spin: Math.random() * 6 })
        if (waveDir === 3) drugs.push({ x: width + 10, y: Math.random() * height, vx: -(0.9 + Math.random() * 0.5), vy: 0, spin: Math.random() * 6 })
      }
    }

    function drawPlus(d: Drug) {
      ctx!.save()
      ctx!.translate(d.x, d.y)
      ctx!.rotate(d.spin)
      ctx!.strokeStyle = '#f5c98a'
      ctx!.shadowColor = '#e8894a'
      ctx!.shadowBlur = 6
      ctx!.lineWidth = 1.8
      ctx!.lineCap = 'round'
      const s = 4
      ctx!.beginPath()
      ctx!.moveTo(-s, 0)
      ctx!.lineTo(s, 0)
      ctx!.moveTo(0, -s)
      ctx!.lineTo(0, s)
      ctx!.stroke()
      ctx!.restore()
    }

    function draw(now: number, animate: boolean) {
      // motion trails: translucent fill instead of clear
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, width, height)

      const el = now - start

      // ── zones: shimmering silhouettes, tinted by local resistance ──
      for (let zi = 0; zi < zones.length; zi++) {
        const z = zones[zi]
        // track resistance fraction inside zone
        let inZone = 0
        let resIn = 0
        for (const b of bacs) {
          const dx = b.x - z.x
          const dy = b.y - z.y
          if (dx * dx + dy * dy < z.r * z.r) {
            inZone++
            if (b.resistant) resIn++
          }
        }
        z.resFrac = inZone ? resIn / inZone : z.resFrac * 0.98

        // soft glow
        const g = ctx!.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.r * 1.6)
        g.addColorStop(0, `rgba(79, 209, 197, ${0.1 + 0.06 * Math.sin(el / 900 + zi)})`)
        g.addColorStop(1, 'rgba(79, 209, 197, 0)')
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(z.x, z.y, z.r * 1.6, 0, Math.PI * 2)
        ctx!.fill()

        // silhouette dots shimmer; colour slides mint → amber with resistance
        const tint = z.resFrac
        const cr = Math.round(185 + (245 - 185) * tint)
        const cg = Math.round(242 - (168 - 55) * tint * 0.55)
        const cb = Math.round(231 - (94 - 0) * tint * 0.6)
        const s = z.r * 1.5
        for (let i = 0; i < z.dots.length; i++) {
          const d = z.dots[i]
          const tw = animate ? 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(el / 600 + i * 0.7)) : 0.6
          ctx!.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${tw})`
          ctx!.fillRect(z.x + d.x * s, z.y + d.y * s, 1.6, 1.6)
        }
      }

      // ── conjugation flashes ──
      flashes = flashes.filter((f) => f.t > 0)
      for (const f of flashes) {
        f.t -= animate ? 0.04 : 0
        ctx!.strokeStyle = `rgba(255, 207, 130, ${f.t})`
        ctx!.shadowColor = '#f5a85e'
        ctx!.shadowBlur = 8
        ctx!.lineWidth = 1.2
        ctx!.beginPath()
        ctx!.arc(f.x, f.y, (1 - f.t) * 10 + 2, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.shadowBlur = 0
      }

      // ── bacteria ──
      for (const b of bacs) {
        const col = b.resistant ? RES[Math.floor(b.wobble) % 3] : SUSC[Math.floor(b.wobble) % 3]
        ctx!.save()
        ctx!.translate(b.x, b.y)
        ctx!.rotate(b.angle)
        ctx!.globalAlpha = Math.max(0.15, b.hp)
        ctx!.shadowColor = b.resistant ? '#e8894a' : '#4fd1c5'
        ctx!.shadowBlur = b.resistant ? 5 : 2
        ctx!.fillStyle = col
        const s = b.size
        ctx!.beginPath()
        ctx!.roundRect(-s * 1.4, -s * 0.55, s * 2.8, s * 1.1, s * 0.55)
        ctx!.fill()
        ctx!.restore()
      }

      // ── antibiotic molecules ──
      for (const d of drugs) drawPlus(d)
    }

    function tick(now: number) {
      if (!running) return
      raf = requestAnimationFrame(tick)

      // periodic antibiotic wave
      if (now - lastWave > 9000 && bacs.length > 20) spawnWave(now)

      // update bacteria
      const newborn: Bac[] = []
      for (const b of bacs) {
        b.retarget--
        if (b.retarget <= 0) {
          const t = pickTarget()
          b.tx = t.x
          b.ty = t.y
          b.retarget = 160 + Math.random() * 240
        }
        const dx = b.tx - b.x
        const dy = b.ty - b.y
        const want = Math.atan2(dy, dx)
        let diff = want - b.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        b.angle += diff * 0.04 + Math.sin(now / 300 + b.wobble) * 0.05
        b.x += Math.cos(b.angle) * b.speed
        b.y += Math.sin(b.angle) * b.speed

        // pointer repulsion
        const mx = b.x - mouse.x
        const my = b.y - mouse.y
        const md2 = mx * mx + my * my
        if (md2 < 8100) {
          const md = Math.sqrt(md2) || 1
          b.x += (mx / md) * 2.2
          b.y += (my / md) * 2.2
        }

        // wrap softly at edges
        if (b.x < -12) b.x = width + 10
        if (b.x > width + 12) b.x = -10
        if (b.y < -12) b.y = height + 10
        if (b.y > height + 12) b.y = -10

        // division: survivors repopulate
        if (bacs.length + newborn.length < CAP && Math.random() < 0.006) {
          newborn.push({
            ...b,
            x: b.x + (Math.random() - 0.5) * 8,
            y: b.y + (Math.random() - 0.5) * 8,
            angle: Math.random() * Math.PI * 2,
            hp: 1,
            wobble: Math.random() * 1000,
          })
        }
      }
      if (newborn.length) bacs.push(...newborn)

      // conjugation: resistant bacteria transfer on contact
      for (let i = 0; i < bacs.length; i += 3) {
        const a = bacs[i]
        if (!a.resistant) continue
        for (let j = 0; j < bacs.length; j += 3) {
          const o = bacs[j]
          if (o.resistant) continue
          const dx = a.x - o.x
          const dy = a.y - o.y
          if (dx * dx + dy * dy < 64 && Math.random() < 0.05) {
            o.resistant = true
            flashes.push({ x: (a.x + o.x) / 2, y: (a.y + o.y) / 2, t: 1 })
          }
        }
      }

      // antibiotics drift and kill susceptible bacteria
      drugs = drugs.filter((d) => d.x > -30 && d.x < width + 30 && d.y > -30 && d.y < height + 30)
      for (const d of drugs) {
        d.x += d.vx
        d.y += d.vy
        d.spin += 0.02
        for (const b of bacs) {
          if (b.resistant || b.hp <= 0) continue
          const dx = b.x - d.x
          const dy = b.y - d.y
          if (dx * dx + dy * dy < 196) b.hp -= 0.05
        }
      }
      bacs = bacs.filter((b) => b.hp > 0)

      // immigration event: fresh susceptible lineages arrive once resistance dominates
      const resCount = bacs.filter((b) => b.resistant).length
      if (bacs.length > 10 && resCount / bacs.length > 0.85) {
        for (let i = 0; i < 16; i++) {
          const edge = Math.floor(Math.random() * 4)
          const t = pickTarget()
          bacs.push({
            x: edge === 0 ? 0 : edge === 1 ? width : Math.random() * width,
            y: edge === 2 ? 0 : edge === 3 ? height : Math.random() * height,
            angle: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.4,
            size: 2.2 + Math.random() * 1.8,
            resistant: false,
            hp: 1,
            wobble: Math.random() * 1000,
            tx: t.x,
            ty: t.y,
            retarget: 200,
          })
        }
      }

      draw(now, true)
    }

    build()
    // prime the background so trails don't reveal a blank first frame
    ctx.fillStyle = '#0e3435'
    ctx.fillRect(0, 0, width, height)

    const staticDraw = () => {
      // pre-roll a little simulated life for a lively still frame
      for (let i = 0; i < 40; i++) draw(performance.now() + i * 16, false)
    }
    if (reduced || snapshot) {
      staticDraw()
    } else {
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const ro = new ResizeObserver(() => {
      build()
      ctx!.fillStyle = '#0e3435'
      ctx!.fillRect(0, 0, width, height)
      if (reduced || snapshot) staticDraw()
    })
    ro.observe(canvas.parentElement!)
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduced && !snapshot
        cancelAnimationFrame(raf)
        if (running) raf = requestAnimationFrame(tick)
      },
      { threshold: 0.05 },
    )
    io.observe(canvas)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  )
}
