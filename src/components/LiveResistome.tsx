import { useEffect, useRef, useState } from 'react'
import { isSnapshotMode } from '@/lib/snapshot'

/**
 * "The Resistome Speaks" — a glowing particle swarm that gathers to spell
 * HUMANS → ANIMALS → ENVIRONMENTS → ONE HEALTH, then loops. Amber particles
 * scattered through the swarm are the resistance genes. Pointer repels.
 */

type Pt = { x: number; y: number }

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  targets: Pt[]
  amber: boolean
  size: number
  tw: number
}

type Seg = { label: string; mode: 'gather' | 'hold'; shape: number; dur: number }

const WORDS = ['HUMANS', 'ANIMALS', 'ENVIRONMENTS', 'ONE HEALTH']

const SEGMENTS: Seg[] = [
  { label: WORDS[0], mode: 'gather', shape: 0, dur: 1700 },
  { label: WORDS[0], mode: 'hold', shape: 0, dur: 2600 },
  { label: WORDS[1], mode: 'gather', shape: 1, dur: 1700 },
  { label: WORDS[1], mode: 'hold', shape: 1, dur: 2600 },
  { label: WORDS[2], mode: 'gather', shape: 2, dur: 1700 },
  { label: WORDS[2], mode: 'hold', shape: 2, dur: 2600 },
  { label: WORDS[3], mode: 'gather', shape: 3, dur: 1800 },
  { label: WORDS[3], mode: 'hold', shape: 3, dur: 3600 },
]
const TOTAL = SEGMENTS.reduce((a, s) => a + s.dur, 0)

function segAt(el: number): Seg {
  let acc = 0
  for (const s of SEGMENTS) {
    if (el < acc + s.dur) return s
    acc += s.dur
  }
  return SEGMENTS[SEGMENTS.length - 1]
}

/** Render a word in heavy type on an offscreen canvas and sample it to dots. */
function sampleWord(word: string, count: number): Pt[] {
  const off = document.createElement('canvas')
  off.width = 560
  off.height = 200
  const c = off.getContext('2d')!
  let fs = 100
  c.font = `900 ${fs}px Arial, Helvetica, sans-serif`
  const measured = c.measureText(word).width
  fs = Math.min((fs * 500) / measured, 150)
  c.font = `900 ${fs}px Arial, Helvetica, sans-serif`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = '#fff'
  c.fillText(word, 280, 104)
  const img = c.getImageData(0, 0, 560, 200).data
  const pts: Pt[] = []
  for (let y = 0; y < 200; y++) {
    for (let x = 0; x < 560; x++) {
      if (img[(y * 560 + x) * 4 + 3] > 120) pts.push({ x: x / 560 - 0.5, y: y / 200 - 0.5 })
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

function makeGlow(r: number, g: number, b: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.85)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return c
}

export function LiveResistome({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [label, setLabel] = useState(WORDS[0])

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

      const count = width < 480 ? 900 : 1600
      const boxW = width * 0.92
      const boxH = Math.min(height * 0.46, boxW * 0.36)
      const cx = width / 2
      const cy = height / 2
      const words = WORDS.map((w) => sampleWord(w, count))

      particles = Array.from({ length: count }, (_, i) => ({
        x: cx + (Math.random() - 0.5) * width,
        y: cy + (Math.random() - 0.5) * height,
        vx: 0,
        vy: 0,
        targets: words.map((pts) => ({
          x: cx + pts[i % pts.length].x * boxW,
          y: cy + pts[i % pts.length].y * boxH,
        })),
        amber: Math.random() < 0.15,
        size: 2.6 + Math.random() * 3.2,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    function frame(now: number) {
      const el = (now - start) % TOTAL
      const seg = segAt(el)
      if (seg.label !== lastLabel) {
        lastLabel = seg.label
        setLabel(seg.label)
      }

      // motion trails
      ctx!.fillStyle = 'rgba(14, 52, 53, 0.3)'
      ctx!.fillRect(0, 0, width, height)

      const k = seg.mode === 'gather' ? 0.014 : 0.038
      for (const p of particles) {
        const t = p.targets[seg.shape]
        const wob = seg.mode === 'hold' ? 1.6 : 0
        const tx = t.x + (wob ? Math.sin(now / 600 + p.tw) * wob : 0)
        const ty = t.y + (wob ? Math.cos(now / 680 + p.tw * 1.4) * wob : 0)
        p.vx += (tx - p.x) * k
        p.vy += (ty - p.y) * k

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1
          const f = ((90 - d) / 90) * 1.6
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx *= 0.84
        p.vy *= 0.84
        p.x += p.vx
        p.y += p.vy
      }

      // particles — clean legible type, no cross-lines
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
      const seg = SEGMENTS[SEGMENTS.length - 1] // ONE HEALTH
      for (let n = 0; n < 140; n++) {
        for (const p of particles) {
          const t = p.targets[seg.shape]
          p.vx += (t.x - p.x) * 0.038
          p.vy += (t.y - p.y) * 0.038
          p.vx *= 0.84
          p.vy *= 0.84
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
        {WORDS.map((s) => (
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
