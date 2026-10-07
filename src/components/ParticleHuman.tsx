import { useEffect, useRef } from 'react'

/**
 * Live particle hero: hundreds of tiny particles — antibiotics and pathogens —
 * drift like a swarm, then converge to assemble a human figure, hold, and
 * scatter again. Reacts to the pointer.
 */

type ParticleKind = 'pathogen' | 'drug'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  hx: number
  hy: number
  kind: ParticleKind
  size: number
  phase: number
  spin: number
}

type Phase = 'gather' | 'hold' | 'scatter'

const PATHOGEN_COLORS = ['#4fd1c5', '#38b2ac', '#63e2be', '#2c9aa0']
const DRUG_COLORS = ['#e08a4e', '#d97a3e', '#edb25f']

/** Sample target points from a human silhouette drawn on an offscreen canvas. */
function sampleHumanPoints(count: number): { x: number; y: number }[] {
  const w = 220
  const h = 260
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const c = off.getContext('2d')!
  c.fillStyle = '#fff'
  c.strokeStyle = '#fff'

  // Head
  c.beginPath()
  c.arc(w / 2, 40, 25, 0, Math.PI * 2)
  c.fill()
  // Torso
  c.beginPath()
  c.roundRect(w / 2 - 30, 66, 60, 92, 26)
  c.fill()
  // Arms
  c.lineWidth = 15
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(w / 2 - 26, 82)
  c.lineTo(w / 2 - 46, 148)
  c.moveTo(w / 2 + 26, 82)
  c.lineTo(w / 2 + 46, 148)
  c.stroke()
  // Legs
  c.lineWidth = 17
  c.beginPath()
  c.moveTo(w / 2 - 14, 154)
  c.lineTo(w / 2 - 18, 240)
  c.moveTo(w / 2 + 14, 154)
  c.lineTo(w / 2 + 18, 240)
  c.stroke()

  const img = c.getImageData(0, 0, w, h).data
  const pts: { x: number; y: number }[] = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (img[(y * w + x) * 4 + 3] > 120) {
        pts.push({ x: x / w, y: y / h })
      }
    }
  }
  // Shuffle and pick
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }
  const step = Math.max(1, Math.floor(pts.length / count))
  const picked: { x: number; y: number }[] = []
  for (let i = 0; i < pts.length && picked.length < count; i += step) {
    picked.push(pts[i])
  }
  return picked
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, alpha: number) {
  const color =
    p.kind === 'pathogen'
      ? PATHOGEN_COLORS[p.phase % PATHOGEN_COLORS.length]
      : DRUG_COLORS[p.phase % DRUG_COLORS.length]
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.strokeStyle = color

  if (p.kind === 'pathogen') {
    // rod-shaped bacterium with tiny flagellum dots
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.spin)
    ctx.beginPath()
    ctx.roundRect(-p.size * 1.4, -p.size * 0.55, p.size * 2.8, p.size * 1.1, p.size * 0.55)
    ctx.fill()
    ctx.restore()
  } else {
    // antibiotic: plus-shaped molecule / capsule
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.spin)
    const s = p.size * 1.5
    ctx.lineWidth = p.size * 0.62
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-s, 0)
    ctx.lineTo(s, 0)
    ctx.moveTo(0, -s)
    ctx.lineTo(0, s)
    ctx.stroke()
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

export function ParticleHuman({ className = '' }: { className?: string }) {
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
    let particles: Particle[] = []
    let targets: { x: number; y: number }[] = []
    let phase: Phase = 'gather'
    let phaseStarted = performance.now()
    const mouse = { x: -9999, y: -9999 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const DURATIONS: Record<Phase, number> = {
      gather: 2600,
      hold: 9000,
      scatter: 2100,
    }

    function build() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = width < 420 ? 420 : 640
      targets = sampleHumanPoints(count)
      particles = targets.map((t, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        hx: t.x * width * 0.86 + width * 0.07,
        hy: t.y * height * 0.9 + height * 0.05,
        kind: Math.random() < 0.72 ? 'pathogen' : 'drug',
        size: 1.6 + Math.random() * 1.9,
        phase: i,
        spin: Math.random() * Math.PI * 2,
      }))
    }

    function tick(now: number) {
      if (!running) return
      raf = requestAnimationFrame(tick)

      if (now - phaseStarted > DURATIONS[phase]) {
        phase = phase === 'gather' ? 'hold' : phase === 'hold' ? 'scatter' : 'gather'
        phaseStarted = now
        if (phase === 'scatter') {
          for (const p of particles) {
            const a = Math.random() * Math.PI * 2
            const f = 0.8 + Math.random() * 1.6
            p.vx += Math.cos(a) * f
            p.vy += Math.sin(a) * f
          }
        }
      }

      ctx!.clearRect(0, 0, width, height)

      const gatherK = phase === 'gather' ? 0.012 : 0.03
      const damping = phase === 'scatter' ? 0.965 : 0.86

      for (const p of particles) {
        if (phase === 'scatter') {
          p.vx += (Math.random() - 0.5) * 0.12
          p.vy += (Math.random() - 0.5) * 0.12
          if (p.x < 0) p.x += width
          if (p.x > width) p.x -= width
          if (p.y < 0) p.y += height
          if (p.y > height) p.y -= height
        } else {
          const wobble =
            phase === 'hold' ? 0.9 : 0
          const tx = p.hx + (wobble ? Math.sin(now / 640 + p.phase) * wobble : 0)
          const ty = p.hy + (wobble ? Math.cos(now / 700 + p.phase * 1.3) * wobble : 0)
          p.vx += (tx - p.x) * gatherK
          p.vy += (ty - p.y) * gatherK
        }

        // pointer repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 10000) {
          const d = Math.sqrt(d2) || 1
          const f = ((100 - d) / 100) * 1.35
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }

        p.vx *= damping
        p.vy *= damping
        p.x += p.vx
        p.y += p.vy
        p.spin += 0.004 * (p.kind === 'drug' ? 1.6 : 1)

        const twinkle = 0.55 + 0.45 * Math.sin(now / 500 + p.phase * 2.1)
        drawParticle(ctx!, p, phase === 'scatter' ? 0.85 : 0.55 + 0.45 * twinkle)
      }
    }

    build()

    if (reduced) {
      // Static assembled figure for reduced-motion users
      phase = 'hold'
      for (let i = 0; i < 90; i++) {
        for (const p of particles) {
          p.x += (p.hx - p.x) * 0.09
          p.y += (p.hy - p.y) * 0.09
        }
      }
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) drawParticle(ctx, p, 0.95)
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
    const ro = new ResizeObserver(() => build())
    ro.observe(canvas.parentElement!)
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduced
        if (running) {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(tick)
        } else {
          cancelAnimationFrame(raf)
        }
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
