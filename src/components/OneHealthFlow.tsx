import { useEffect, useRef } from 'react'
import { isSnapshotMode } from '@/lib/snapshot'

/**
 * Live layer over the One Health hero photograph. Amber plasmid glow-dots
 * travel along the gene-flow trails between the three scenes (hospital,
 * farm, wastewater), soft pulse rings mark the compartments, and faint
 * motes drift through the air. Reacts to the pointer.
 */

type PathDef = { x0: number; y0: number; x1: number; y1: number; x2: number; y2: number }

type Traveler = { path: number; t: number; speed: number; size: number }

type Mote = { x: number; y: number; r: number; phase: number; speed: number }

type Pulse = { x: number; y: number; r: number; alpha: number }

// bezier control points traced over the light trails in the photograph
const PATHS: PathDef[] = [
  { x0: 0.2, y0: 0.66, x1: 0.34, y1: 0.5, x2: 0.47, y2: 0.6 }, // hospital → farm
  { x0: 0.52, y0: 0.62, x1: 0.62, y1: 0.48, x2: 0.72, y2: 0.6 }, // farm → wastewater
  { x0: 0.24, y0: 0.72, x1: 0.5, y1: 0.86, x2: 0.76, y2: 0.68 }, // hospital → wastewater
]

const ANCHORS = [
  { x: 0.2, y: 0.64 },
  { x: 0.48, y: 0.6 },
  { x: 0.74, y: 0.6 },
]

function bez(p: PathDef, t: number, w: number, h: number) {
  const x = (1 - t) * (1 - t) * p.x0 + 2 * (1 - t) * t * p.x1 + t * t * p.x2
  const y = (1 - t) * (1 - t) * p.y0 + 2 * (1 - t) * t * p.y1 + t * t * p.y2
  return { x: x * w, y: y * h }
}

export function OneHealthFlow({ className = '' }: { className?: string }) {
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
    let travelers: Traveler[] = []
    let motes: Mote[] = []
    let pulses: Pulse[] = []
    let lastPulse = 0
    const start = performance.now()
    const mouse = { x: -9999, y: -9999 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const snapshot = isSnapshotMode()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function build() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      travelers = []
      PATHS.forEach((_, pi) => {
        const n = width < 480 ? 3 : 5
        for (let i = 0; i < n; i++) {
          travelers.push({
            path: pi,
            t: (i / n + Math.random() * 0.2) % 1,
            speed: 0.0016 + Math.random() * 0.0022,
            size: 2 + Math.random() * 2.4,
          })
        }
      })
      motes = Array.from({ length: width < 480 ? 14 : 24 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00004 + Math.random() * 0.00008,
      }))
      pulses = []
    }

    function draw(now: number, animate: boolean) {
      const fade = Math.min(1, (now - start) / 1600)
      ctx!.clearRect(0, 0, width, height)

      // pulse rings at the three compartments
      if (animate && now - lastPulse > 2100) {
        lastPulse = now
        const a = ANCHORS[Math.floor(Math.random() * ANCHORS.length)]
        pulses.push({ x: a.x * width, y: a.y * height, r: 6, alpha: 0.5 })
      }
      pulses = pulses.filter((p) => p.alpha > 0.015)
      for (const p of pulses) {
        p.r += 0.5
        p.alpha *= 0.965
        ctx!.strokeStyle = `rgba(240, 168, 94, ${p.alpha * fade})`
        ctx!.lineWidth = 1.2
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.stroke()
      }

      // traveling plasmid glow-dots
      for (const tr of travelers) {
        if (animate) tr.t += tr.speed
        if (tr.t > 1) tr.t = 0
        const pos = bez(PATHS[tr.path], tr.t, width, height)
        // gentle perpendicular wobble + pointer repulsion
        const wob = animate ? Math.sin(now / 480 + tr.size * 7) * 2.4 : 0
        let px = pos.x
        let py = pos.y + wob
        const dx = px - mouse.x
        const dy = py - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 4900) {
          const d = Math.sqrt(d2) || 1
          px += (dx / d) * 5
          py += (dy / d) * 5
        }
        const tw = animate ? 0.65 + 0.35 * Math.sin(now / 260 + tr.size * 11) : 0.9
        ctx!.save()
        ctx!.globalAlpha = tw * fade
        ctx!.shadowColor = '#f0a85e'
        ctx!.shadowBlur = 9
        ctx!.fillStyle = '#ffd9a3'
        ctx!.beginPath()
        ctx!.arc(px, py, tr.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }

      // ambient motes
      for (const m of motes) {
        if (animate) {
          m.y -= m.speed * height
          if (m.y < -0.02) m.y = 1.02
        }
        const tw = animate ? 0.35 + 0.3 * Math.sin(now / 700 + m.phase) : 0.5
        ctx!.globalAlpha = tw * fade
        ctx!.fillStyle = '#ffe9c9'
        ctx!.beginPath()
        ctx!.arc(m.x * width, m.y * height, m.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
    }

    build()
    const staticDraw = () => draw(performance.now(), false)
    if (reduced || snapshot) {
      staticDraw()
    } else {
      raf = requestAnimationFrame(function tick(now) {
        if (!running) return
        draw(now, true)
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
      if (reduced || snapshot) staticDraw()
    })
    ro.observe(canvas.parentElement!)
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduced && !snapshot
        cancelAnimationFrame(raf)
        if (running) {
          raf = requestAnimationFrame(function tick(now) {
            if (!running) return
            draw(now, true)
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
    </div>
  )
}
