import { useEffect, useRef } from 'react'
import { User, PawPrint, TreePine } from 'lucide-react'
import { isSnapshotMode } from '@/lib/snapshot'

/**
 * "The Resistome Triangle" — a live One Health animation in three acts:
 *   1. GROW   — bacteria multiply inside the human, animal and environment hubs,
 *               and resistant ones (amber) steadily take over each hub.
 *   2. FLOW   — plasmid rings travel between hubs, seeding resistance wherever
 *               they land; glowing flow lines connect the triangle.
 *   3. ONE    — all three hubs burn bright and the triangle is fully lit:
 *               one system, not three problems. Fade, and the cycle restarts.
 * Reacts to the pointer (repulsion inside hubs, faster transfer near lines).
 */

type Bac = {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  size: number
  resistant: boolean
  wobble: number
}

type Plasmid = {
  t: number
  from: number
  to: number
  speed: number
  ctrl: { x: number; y: number }
}

type Hub = { fx: number; fy: number; x: number; y: number; r: number }

const CYCLE = 34000 // ms
const GROW_END = 10000
const FLOW_END = 22000
const ONE_END = 30000

const SUSCEPTIBLE = ['#b9f2e7', '#93e9d9', '#d2f7ef']
const RESISTANT = ['#f5a85e', '#ec8c46', '#ffcf82']

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

export function ResistomeFlow({ className = '' }: { className?: string }) {
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
    let hubs: Hub[] = []
    let bacs: Bac[][] = [[], [], []]
    let plasmids: Plasmid[] = []
    let start = performance.now()
    let lastSpawn = 0
    let lastPlasmid = 0
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

      const r = Math.min(width, height) * 0.17
      hubs = [
        { fx: 0.5, fy: 0.25, x: width * 0.5, y: height * 0.27, r },
        { fx: 0.24, fy: 0.72, x: width * 0.25, y: height * 0.73, r },
        { fx: 0.76, fy: 0.72, x: width * 0.75, y: height * 0.73, r },
      ]
      const perHub = width < 420 ? 22 : 30
      bacs = hubs.map((h, hi) => {
        const arr: Bac[] = []
        for (let i = 0; i < perHub; i++) {
          const a = Math.random() * Math.PI * 2
          const d = Math.sqrt(Math.random()) * h.r * 0.8
          arr.push({
            x: h.x + Math.cos(a) * d,
            y: h.y + Math.sin(a) * d,
            vx: 0,
            vy: 0,
            angle: Math.random() * Math.PI * 2,
            size: 2 + Math.random() * 2,
            resistant: snapshot ? i % 2 === 0 : i === 0,
            wobble: hi * 10 + i,
          })
        }
        return arr
      })
      plasmids = []
      start = performance.now()
    }

    function drawBac(b: Bac, alphaScale: number) {
      const c = b.resistant
        ? RESISTANT[b.wobble % RESISTANT.length]
        : SUSCEPTIBLE[b.wobble % SUSCEPTIBLE.length]
      ctx!.save()
      ctx!.translate(b.x, b.y)
      ctx!.rotate(b.angle)
      ctx!.globalAlpha = alphaScale
      ctx!.shadowColor = b.resistant ? '#e8894a' : '#4fd1c5'
      ctx!.shadowBlur = b.resistant ? 7 : 3
      ctx!.fillStyle = c
      ctx!.beginPath()
      ctx!.roundRect(-b.size * 1.4, -b.size * 0.55, b.size * 2.8, b.size * 1.1, b.size * 0.55)
      ctx!.fill()
      ctx!.restore()
    }

    function pairProgress(el: number, a: number, b: number) {
      // stagger the three triangle edges during FLOW
      const order = a === 0 && b === 1 ? 0 : a === 0 ? 1 : 2
      const local = (el - order * 1800) / 5200
      return Math.max(0, Math.min(1, local))
    }

    function drawScene(now: number) {
      const el = (now - start) % CYCLE
      const fade =
        snapshot || reduced
          ? 1
          : el > ONE_END
            ? 1 - smooth((el - ONE_END) / (CYCLE - ONE_END))
            : smooth(Math.min(1, el / 1500))

      ctx!.clearRect(0, 0, width, height)

      // ── triangle flow lines ──
      const pairs: [number, number][] = [[0, 1], [0, 2], [1, 2]]
      for (const [a, b] of pairs) {
        let alpha: number
        if (snapshot || reduced) alpha = 0.5
        else if (el < GROW_END) alpha = 0
        else if (el < FLOW_END) alpha = smooth(pairProgress(el, a, b)) * 0.5
        else alpha = 0.55
        if (alpha <= 0.01) continue
        ctx!.save()
        ctx!.strokeStyle = `rgba(150, 245, 225, ${alpha * fade})`
        ctx!.lineWidth = 1.6
        ctx!.setLineDash([3, 7])
        ctx!.lineDashOffset = -now / 40
        ctx!.beginPath()
        ctx!.moveTo(hubs[a].x, hubs[a].y)
        ctx!.lineTo(hubs[b].x, hubs[b].y)
        ctx!.stroke()
        ctx!.restore()
      }

      // ── hub glows ──
      for (let i = 0; i < 3; i++) {
        const h = hubs[i]
        const frac =
          snapshot || reduced
            ? 0.8
            : el < GROW_END
              ? 0.25 + 0.45 * smooth(el / GROW_END)
              : el < FLOW_END
                ? 0.7 + 0.3 * smooth((el - GROW_END) / (FLOW_END - GROW_END))
                : 1
        const g = ctx!.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r * 1.5)
        g.addColorStop(0, `rgba(79, 209, 197, ${0.2 * frac * fade})`)
        g.addColorStop(1, 'rgba(79, 209, 197, 0)')
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(h.x, h.y, h.r * 1.5, 0, Math.PI * 2)
        ctx!.fill()
        // hub ring
        ctx!.strokeStyle = `rgba(160, 240, 225, ${0.16 * frac * fade})`
        ctx!.lineWidth = 1
        ctx!.setLineDash([])
        ctx!.beginPath()
        ctx!.arc(h.x, h.y, h.r, 0, Math.PI * 2)
        ctx!.stroke()
      }

      // ── plasmids in transit ──
      for (const p of plasmids) {
        const A = hubs[p.from]
        const B = hubs[p.to]
        const t = smooth(Math.min(1, p.t))
        const x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * p.ctrl.x + t * t * B.x
        const y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * p.ctrl.y + t * t * B.y
        ctx!.save()
        ctx!.globalAlpha = fade
        ctx!.strokeStyle = '#ffcb7a'
        ctx!.shadowColor = '#e8894a'
        ctx!.shadowBlur = 8
        ctx!.lineWidth = 1.6
        ctx!.beginPath()
        ctx!.arc(x, y, 4, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.restore()
      }

      // ── bacteria ──
      for (let i = 0; i < 3; i++) {
        for (const b of bacs[i]) drawBac(b, fade)
      }
      return el
    }

    function tick(now: number) {
      if (!running) return
      raf = requestAnimationFrame(tick)
      const el = (now - start) % CYCLE

      // population growth during GROW
      if (el < GROW_END && now - lastSpawn > 650) {
        lastSpawn = now
        for (let i = 0; i < 3; i++) {
          const cap = width < 420 ? 30 : 42
          if (bacs[i].length < cap && bacs[i].length > 0) {
            const parent = bacs[i][Math.floor(Math.random() * bacs[i].length)]
            bacs[i].push({
              x: parent.x + (Math.random() - 0.5) * 10,
              y: parent.y + (Math.random() - 0.5) * 10,
              vx: 0,
              vy: 0,
              angle: Math.random() * Math.PI * 2,
              size: 1.6 + Math.random() * 2,
              resistant: false,
              wobble: Math.floor(Math.random() * 100),
            })
          }
        }
      }

      // resistance take-over targets
      const target =
        el < GROW_END
          ? 0.1 + 0.3 * smooth(el / GROW_END)
          : el < FLOW_END
            ? 0.4 + 0.35 * smooth((el - GROW_END) / (FLOW_END - GROW_END))
            : 0.85

      // plasmid transfer during FLOW
      if (el >= GROW_END && el < FLOW_END && now - lastPlasmid > 480) {
        lastPlasmid = now
        const from = Math.floor(Math.random() * 3)
        const to = (from + 1 + Math.floor(Math.random() * 2)) % 3
        const A = hubs[from]
        const B = hubs[to]
        plasmids.push({
          t: 0,
          from,
          to,
          speed: 0.008 + Math.random() * 0.006,
          ctrl: { x: (A.x + B.x) / 2 + (Math.random() - 0.5) * 60, y: (A.y + B.y) / 2 + (Math.random() - 0.5) * 60 },
        })
      }

      // update bacteria
      for (let i = 0; i < 3; i++) {
        const h = hubs[i]
        const arr = bacs[i]
        const resCount = arr.filter((b) => b.resistant).length
        // local spread: resistant convert a neighbour
        if (resCount / arr.length < target && resCount > 0 && Math.random() < 0.09) {
          const r = arr[Math.floor(Math.random() * arr.length)]
          const s = arr[Math.floor(Math.random() * arr.length)]
          if (r.resistant && !s.resistant) s.resistant = true
        }
        for (const b of arr) {
          b.vx += (Math.random() - 0.5) * 0.14
          b.vy += (Math.random() - 0.5) * 0.14
          // soft confinement to hub
          const dx = h.x - b.x
          const dy = h.y - b.y
          const d = Math.hypot(dx, dy)
          if (d > h.r * 0.85) {
            b.vx += (dx / d) * 0.06
            b.vy += (dy / d) * 0.06
          }
          // pointer repulsion
          const mx = b.x - mouse.x
          const my = b.y - mouse.y
          const md2 = mx * mx + my * my
          if (md2 < 6400) {
            const md = Math.sqrt(md2) || 1
            const f = ((80 - md) / 80) * 1.1
            b.vx += (mx / md) * f
            b.vy += (my / md) * f
          }
          b.vx *= 0.88
          b.vy *= 0.88
          b.x += b.vx
          b.y += b.vy
          b.angle += Math.sin(now / 900 + b.wobble) * 0.015
        }
      }

      // update plasmids; arrival seeds resistance
      plasmids = plasmids.filter((p) => {
        p.t += p.speed
        if (p.t >= 1) {
          const dest = bacs[p.to]
          for (let k = 0; k < 3 && dest.length > 0; k++) {
            dest[Math.floor(Math.random() * dest.length)].resistant = true
          }
          return false
        }
        return true
      })

      drawScene(now)
    }

    function renderStatic() {
      ctx!.clearRect(0, 0, width, height)
      drawScene(performance.now())
    }

    build()

    if (reduced || snapshot) {
      renderStatic()
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
      if (reduced || snapshot) renderStatic()
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
      {/* Hub icons + labels */}
      <div className="pointer-events-none absolute left-1/2 top-[27%] -translate-x-1/2 -translate-y-1/2 text-center">
        <User className="mx-auto h-7 w-7 text-primary-foreground/85" strokeWidth={1.6} />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
          Human
        </p>
      </div>
      <div className="pointer-events-none absolute left-[25%] top-[73%] -translate-x-1/2 -translate-y-1/2 text-center">
        <PawPrint className="mx-auto h-7 w-7 text-primary-foreground/85" strokeWidth={1.6} />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
          Animal
        </p>
      </div>
      <div className="pointer-events-none absolute left-[75%] top-[73%] -translate-x-1/2 -translate-y-1/2 text-center">
        <TreePine className="mx-auto h-7 w-7 text-primary-foreground/85" strokeWidth={1.6} />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
          Environment
        </p>
      </div>
    </div>
  )
}
