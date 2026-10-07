import { useEffect, useRef, useState } from 'react'
import { isSnapshotMode } from '@/lib/snapshot'

/**
 * "Morphing Resistome" — a glowing particle swarm that coalesces into a
 * human silhouette, morphs into an animal paw, then a leaf, then dissolves
 * into a free-floating constellation (One Health network) before re-forming.
 * Mint particles are the microbial world; amber ones are resistance.
 * Pointer repels the swarm.
 */

type Pt = { x: number; y: number }

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  targets: Pt[] // [human, animal, environment]
  amber: boolean
  size: number
  tw: number
}

type Seg = { label: string; mode: 'gather' | 'hold' | 'net'; shape?: number; dur: number }

const SEGMENTS: Seg[] = [
  { label: 'HUMANS', mode: 'gather', shape: 0, dur: 1900 },
  { label: 'HUMANS', mode: 'hold', shape: 0, dur: 3400 },
  { label: 'ANIMALS', mode: 'gather', shape: 1, dur: 1900 },
  { label: 'ANIMALS', mode: 'hold', shape: 1, dur: 3400 },
  { label: 'ENVIRONMENTS', mode: 'gather', shape: 2, dur: 1900 },
  { label: 'ENVIRONMENTS', mode: 'hold', shape: 2, dur: 3400 },
  { label: 'ONE HEALTH', mode: 'net', dur: 4600 },
]
const TOTAL = SEGMENTS.reduce((a, s) => a + s.dur, 0)

function segAt(el: number): { seg: Seg; local: number } {
  let acc = 0
  for (const s of SEGMENTS) {
    if (el < acc + s.dur) return { seg: s, local: el - acc }
    acc += s.dur
  }
  return { seg: SEGMENTS[SEGMENTS.length - 1], local: SEGMENTS[SEGMENTS.length - 1].dur }
}

function sampleShape(draw: (c: CanvasRenderingContext2D, s: number) => void, size: number, count: number): Pt[] {
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const c = off.getContext('2d')!
  c.fillStyle = '#fff'
  c.strokeStyle = '#fff'
  draw(c, size)
  const img = c.getImageData(0, 0, size, size).data
  const pts: Pt[] = []
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (img[(y * size + x) * 4 + 3] > 120) pts.push({ x: x / size - 0.5, y: y / size - 0.5 })
    }
  }
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }
  const picked: Pt[] = []
  const step = Math.max(1, Math.floor(pts.length / count))
  for (let i = 0; i < pts.length && picked.length < count; i += step) picked.push(pts[i])
  return picked
}

function humanShape(c: CanvasRenderingContext2D, s: number) {
  const u = s / 100
  c.beginPath()
  c.arc(50 * u, 15 * u, 10.5 * u, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.roundRect(37 * u, 27 * u, 26 * u, 36 * u, 11 * u)
  c.fill()
  c.lineWidth = 7 * u
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(40 * u, 34 * u)
  c.lineTo(28 * u, 58 * u)
  c.moveTo(60 * u, 34 * u)
  c.lineTo(72 * u, 58 * u)
  c.stroke()
  c.lineWidth = 7.5 * u
  c.beginPath()
  c.moveTo(44.5 * u, 62 * u)
  c.lineTo(42 * u, 88 * u)
  c.moveTo(55.5 * u, 62 * u)
  c.lineTo(58 * u, 88 * u)
  c.stroke()
}

function pawShape(c: CanvasRenderingContext2D, s: number) {
  const u = s / 100
  c.beginPath()
  c.ellipse(50 * u, 63 * u, 18 * u, 14 * u, 0, 0, Math.PI * 2)
  c.fill()
  const toes: [number, number, number][] = [
    [25, 42, 8],
    [41.5, 29, 8.5],
    [58.5, 29, 8.5],
    [75, 42, 8],
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
  c.translate(50 * u, 50 * u)
  c.rotate(-Math.PI / 4)
  c.beginPath()
  c.ellipse(0, 0, 28 * u, 16 * u, 0, 0, Math.PI * 2)
  c.fill()
  c.restore()
  c.lineWidth = 4.5 * u
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(67 * u, 67 * u)
  c.quadraticCurveTo(75 * u, 78 * u, 79 * u, 89 * u)
  c.stroke()
}

function makeGlow(r: number, g: number, b: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(255,255,255,0.95)`)
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.85)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return c
}

export function LiveResistome({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [label, setLabel] = useState('HUMANS')

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
    let lastLabel = ''
    const start = performance.now()
    const mouse = { x: -9999, y: -9999 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const snapshot = isSnapshotMode()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const BG = '#0e3435'

    const glowMint = makeGlow(120, 226, 206)
    const glowAmber = makeGlow(240, 168, 94)

    function build() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = width < 480 ? 340 : 520
      const box = Math.min(width, height) * 0.74
      const cx = width / 2
      const cy = height / 2 - height * 0.02
      const shapes = [sampleShape(humanShape, 100, count), sampleShape(pawShape, 100, count), sampleShape(leafShape, 100, count)]

      particles = Array.from({ length: count }, (_, i) => ({
        x: cx + (Math.random() - 0.5) * width,
        y: cy + (Math.random() - 0.5) * height,
        vx: 0,
        vy: 0,
        targets: shapes.map((pts) => ({
          x: cx + pts[i % pts.length].x * box,
          y: cy + pts[i % pts.length].y * box,
        })),
        amber: Math.random() < 0.13,
        size: 5 + Math.random() * 5,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    function frame(now: number) {
      const el = (now - start) % TOTAL
      const { seg } = segAt(el)
      if (seg.label !== lastLabel) {
        lastLabel = seg.label
        setLabel(seg.label)
      }

      // motion trails
      ctx!.fillStyle = 'rgba(14, 52, 53, 0.32)'
      ctx!.fillRect(0, 0, width, height)

      // physics
      const gatherK = seg.mode === 'gather' ? 0.013 : seg.mode === 'hold' ? 0.034 : 0
      const damp = seg.mode === 'net' ? 0.955 : 0.85
      for (const p of particles) {
        if (seg.mode === 'net') {
          p.vx += (Math.random() - 0.5) * 0.14
          p.vy += (Math.random() - 0.5) * 0.14
          if (p.x < 8) p.vx += 0.08
          if (p.x > width - 8) p.vx -= 0.08
          if (p.y < 8) p.vy += 0.08
          if (p.y > height - 8) p.vy -= 0.08
        } else {
          const t = p.targets[seg.shape!]
          const wob = seg.mode === 'hold' ? 2.2 : 0
          const tx = t.x + (wob ? Math.sin(now / 620 + p.tw) * wob : 0)
          const ty = t.y + (wob ? Math.cos(now / 700 + p.tw * 1.4) * wob : 0)
          p.vx += (tx - p.x) * gatherK
          p.vy += (ty - p.y) * gatherK
        }
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1
          const f = ((90 - d) / 90) * 1.5
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx *= damp
        p.vy *= damp
        p.x += p.vx
        p.y += p.vy
      }

      // constellation lines
      const R = seg.mode === 'net' ? 56 : 40
      const R2 = R * R
      const baseA = seg.mode === 'net' ? 0.3 : 0.05
      ctx!.lineWidth = 0.7
      ctx!.strokeStyle = '#8fe6d7'
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            ctx!.globalAlpha = (1 - Math.sqrt(d2) / R) * baseA
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }
      ctx!.globalAlpha = 1

      // particles
      for (const p of particles) {
        const tw = 0.75 + 0.25 * Math.sin(now / 420 + p.tw)
        const s = p.size * tw
        ctx!.drawImage(p.amber ? glowAmber : glowMint, p.x - s, p.y - s, s * 2, s * 2)
      }
    }

    build()
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, width, height)

    const staticFrame = () => {
      // settle into the human shape, then draw one clean frame
      const seg = SEGMENTS[1]
      for (let k = 0; k < 120; k++) {
        for (const p of particles) {
          const t = p.targets[seg.shape!]
          p.vx += (t.x - p.x) * 0.034
          p.vy += (t.y - p.y) * 0.034
          p.vx *= 0.85
          p.vy *= 0.85
          p.x += p.vx
          p.y += p.vy
        }
      }
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, width, height)
      frame(performance.now())
    }

    if (reduced || snapshot) {
      staticFrame()
    } else {
      raf = requestAnimationFrame(function tick(now) {
        if (!running) return
        frame(now)
        raf = requestAnimationFrame(tick)
      })
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
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, width, height)
      if (reduced || snapshot) staticFrame()
    })
    ro.observe(canvas.parentElement!)
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduced && !snapshot
        cancelAnimationFrame(raf)
        if (running) {
          raf = requestAnimationFrame(function tick(now) {
            if (!running) return
            frame(now)
            raf = requestAnimationFrame(tick)
          })
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
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
        {['HUMANS', 'ANIMALS', 'ENVIRONMENTS', 'ONE HEALTH'].map((s) => (
          <span
            key={s}
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-700 ${
              label === s ? 'text-amber-300' : 'text-primary-foreground/35'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
