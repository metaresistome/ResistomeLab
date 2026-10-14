import { useEffect, useRef } from 'react'
import { isSnapshotMode } from '@/lib/snapshot'

type ParticleType = 'bacteria' | 'virus' | 'fungus' | 'drug'

type Particle = {
  hx: number
  hy: number
  hz: number
  fx: number
  fy: number
  fz: number
  delay: number
  type: ParticleType
  size: number
  phase: number
  spin: number
}

const GROUND_Y = -0.72

const TYPE_META: Record<ParticleType, { color: string }> = {
  bacteria: { color: '#159a94' },
  virus: { color: '#e8862d' },
  fungus: { color: '#6a994e' },
  drug: { color: '#3d6fb4' },
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

/** Sample a random point inside a capsule (segment p1->p2 with radius r). */
function sampleCapsule(
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  r: number,
): [number, number, number] {
  const t = Math.random()
  const cx = x1 + (x2 - x1) * t
  const cy = y1 + (y2 - y1) * t
  const cz = z1 + (z2 - z1) * t
  // random direction
  let dx = rand(-1, 1), dy = rand(-1, 1), dz = rand(-1, 1)
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
  const dist = r * Math.cbrt(Math.random())
  dx = (dx / len) * dist
  dy = (dy / len) * dist
  dz = (dz / len) * dist
  return [cx + dx, cy + dy, cz + dz]
}

function sampleSphere(cx: number, cy: number, cz: number, r: number): [number, number, number] {
  return sampleCapsule(cx, cy, cz, cx, cy, cz, r)
}

function buildHumanParticles(): Particle[] {
  const parts: Particle[] = []
  const push = (p: [number, number, number], count: number, weights: [ParticleType, number][]) => {
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * weights.reduce((s, w) => s + w[1], 0)
      let acc = 0
      let type: ParticleType = weights[0][0]
      for (const [t, w] of weights) {
        acc += w
        if (roll <= acc) {
          type = t
          break
        }
      }
      const hx = p[0] + rand(-0.012, 0.012)
      const hy = p[1] + rand(-0.012, 0.012)
      const hz = p[2] + rand(-0.012, 0.012)
      // scattered resting spot on the "ground" for the collapse phase
      const spread = rand(0.35, 1.15)
      parts.push({
        hx,
        hy,
        hz,
        fx: hx * spread + rand(-0.28, 0.28),
        fy: GROUND_Y + rand(0, 0.1),
        fz: hz * spread + rand(-0.22, 0.22),
        delay: rand(0, 0.45),
        type,
        size: rand(0.75, 1.35),
        phase: rand(0, Math.PI * 2),
        spin: rand(-0.6, 0.6),
      })
    }
  }

  const core: [ParticleType, number][] = [
    ['bacteria', 0.42],
    ['virus', 0.22],
    ['fungus', 0.12],
    ['drug', 0.24],
  ]

  // head
  for (let i = 0; i < 170; i++) push(sampleSphere(0, 1.52, 0, 0.21), 1, core)
  // neck
  for (let i = 0; i < 30; i++) push(sampleCapsule(0, 1.3, 0, 0, 1.38, 0, 0.09), 1, core)
  // torso (chest)
  for (let i = 0; i < 330; i++) push(sampleCapsule(0, 0.78, 0, 0, 1.28, 0, 0.3), 1, core)
  // hips
  for (let i = 0; i < 170; i++) push(sampleCapsule(0, 0.5, 0, 0, 0.76, 0, 0.25), 1, core)
  // arms
  for (let i = 0; i < 120; i++) push(sampleCapsule(-0.34, 1.24, 0, -0.46, 0.72, 0, 0.085), 1, core)
  for (let i = 0; i < 120; i++) push(sampleCapsule(0.34, 1.24, 0, 0.46, 0.72, 0, 0.085), 1, core)
  // forearms + hands
  for (let i = 0; i < 90; i++) push(sampleCapsule(-0.46, 0.72, 0, -0.5, 0.32, 0, 0.07), 1, core)
  for (let i = 0; i < 90; i++) push(sampleCapsule(0.46, 0.72, 0, 0.5, 0.32, 0, 0.07), 1, core)
  // legs
  for (let i = 0; i < 200; i++) push(sampleCapsule(-0.13, 0.48, 0, -0.15, -0.15, 0, 0.115), 1, core)
  for (let i = 0; i < 200; i++) push(sampleCapsule(0.13, 0.48, 0, 0.15, -0.15, 0, 0.115), 1, core)
  // shins + feet
  for (let i = 0; i < 130; i++) push(sampleCapsule(-0.15, -0.15, 0, -0.16, -0.62, 0, 0.085), 1, core)
  for (let i = 0; i < 130; i++) push(sampleCapsule(0.15, -0.15, 0, 0.16, -0.62, 0, 0.085), 1, core)
  for (let i = 0; i < 40; i++) push(sampleCapsule(-0.16, -0.66, 0.05, -0.16, -0.66, 0.12, 0.06), 1, core)
  for (let i = 0; i < 40; i++) push(sampleCapsule(0.16, -0.66, 0.05, 0.16, -0.66, 0.12, 0.06), 1, core)

  return parts
}

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  type: ParticleType,
  x: number,
  y: number,
  r: number,
  rot: number,
  alpha: number,
) {
  const c = TYPE_META[type].color
  ctx.globalAlpha = alpha
  ctx.strokeStyle = c
  ctx.fillStyle = c
  ctx.lineWidth = Math.max(1, r * 0.32)

  if (type === 'bacteria') {
    // rod shape
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.roundRect(-r * 1.5, -r * 0.55, r * 3, r * 1.1, r * 0.55)
    ctx.globalAlpha = alpha * 0.85
    ctx.fill()
    ctx.restore()
  } else if (type === 'virus') {
    // spiked circle
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      ctx.moveTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8)
      ctx.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45)
    }
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2)
    ctx.globalAlpha = alpha * 0.9
    ctx.fill()
    ctx.restore()
  } else if (type === 'fungus') {
    // mushroom
    ctx.save()
    ctx.translate(x, y)
    ctx.beginPath()
    ctx.arc(0, -r * 0.25, r * 1.05, Math.PI, 0)
    ctx.closePath()
    ctx.globalAlpha = alpha * 0.9
    ctx.fill()
    ctx.globalAlpha = alpha
    ctx.fillRect(-r * 0.28, -r * 0.2, r * 0.56, r * 1.2)
    ctx.restore()
  } else {
    // drug: capsule
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.roundRect(-r * 1.4, -r * 0.6, r * 2.8, r * 1.2, r * 0.6)
    ctx.globalAlpha = alpha * 0.85
    ctx.fill()
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

export function ParticleHuman() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = buildHumanParticles()
    const snapshot = isSnapshotMode()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const staticFrame = snapshot || reduceMotion

    let raf = 0
    let running = true
    let visible = true
    let angle = 0.6
    let pointerX = 0
    let lastW = 0
    let lastH = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.round(width * dpr))
      const h = Math.max(1, Math.round(height * dpr))
      if (w === lastW && h === lastH) return
      lastW = w
      lastH = h
      canvas.width = w
      canvas.height = h
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    io.observe(wrap)
    const cleanupFns: (() => void)[] = [() => io.disconnect()]

    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7
    }
    wrap.addEventListener('pointermove', onPointer)

    const render = (now: number) => {
      if (!running) return
      if (visible) {
        const t = (now - start) / 1000
        if (!staticFrame) {
          angle = 0.6 + t * 0.22 + pointerX
        }
        const w = canvas.width
        const h = canvas.height
        ctx.clearRect(0, 0, w, h)

        const scale = Math.min(w, h) * 0.85 / 2.45
        const cx = w / 2
        const cy = h / 2 + 0.505 * scale
        const f = 3.4 // perspective distance
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        // animation cycle (seconds)
        const HOLD = 4.2
        const FALL = 2.6
        const REST = 1.6
        const RISE = 2.8
        const CYCLE = HOLD + FALL + REST + RISE + 0.6
        const ctParam = new URLSearchParams(window.location.search).get('pcycle')
        const ct = staticFrame
          ? ctParam
            ? parseFloat(ctParam) % CYCLE
            : 0
          : t % CYCLE

        const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
        const easeInQuad = (v: number) => v * v
        const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3)

        // project every particle at its animated position
        const proj = particles.map((p) => {
          let px = p.hx
          let py = p.hy
          let pz = p.hz
          let fallAmount = 0

          if (!staticFrame || ctParam) {
            if (ct < HOLD) {
              // gentle breathing while formed
              py += Math.sin(t * 1.3 + p.phase) * 0.012
            } else if (ct < HOLD + FALL) {
              // collapse: each particle drops with its own delay
              const local = clamp01((ct - HOLD - p.delay * FALL * 0.7) / (FALL * 0.55))
              const e = easeInQuad(local)
              fallAmount = e
              px = p.hx + (p.fx - p.hx) * e
              py = p.hy + (p.fy - p.hy) * e
              pz = p.hz + (p.fz - p.hz) * e
            } else if (ct < HOLD + FALL + REST) {
              // resting on the ground, faint shimmer
              fallAmount = 1
              px = p.fx + Math.sin(t * 2.2 + p.phase) * 0.006
              py = p.fy
              pz = p.fz
            } else if (ct < HOLD + FALL + REST + RISE) {
              // reform: rise back into the human
              const local = clamp01((ct - HOLD - FALL - REST - p.delay * RISE * 0.7) / (RISE * 0.55))
              const e = easeOutCubic(local)
              fallAmount = 1 - e
              px = p.fx + (p.hx - p.fx) * e
              py = p.fy + (p.hy - p.fy) * e
              pz = p.fz + (p.hz - p.fz) * e
            } else {
              py += Math.sin(t * 1.3 + p.phase) * 0.012
            }
          }

          const rx = px * cosA + pz * sinA
          const rz = -px * sinA + pz * cosA
          const s = f / (f + rz)
          return { p, sx: cx + rx * scale * s, sy: cy - py * scale * s, depth: rz, s, fallAmount }
        })
        proj.sort((a, b) => b.depth - a.depth)

        // soft ground shadow that appears as particles fall
        if (!staticFrame) {
          const shadowAlpha = 0.1 * (proj.reduce((s, q) => s + q.fallAmount, 0) / proj.length)
          if (shadowAlpha > 0.004) {
            ctx.beginPath()
            ctx.ellipse(cx, cy - GROUND_Y * scale + scale * 0.05, scale * 1.05, scale * 0.13, 0, 0, Math.PI * 2)
            ctx.fillStyle = '#0d4a52'
            ctx.globalAlpha = shadowAlpha
            ctx.fill()
            ctx.globalAlpha = 1
          }
        }

        for (const { p, sx, sy, depth, s, fallAmount } of proj) {
          const twinkle = staticFrame ? 1 : 0.72 + 0.28 * Math.sin(t * 1.6 + p.phase)
          const alpha = Math.max(0.12, Math.min(1, (1.15 - (depth + 0.35) / 0.9) * 0.9)) * twinkle
          const r = Math.max(0.6, 2.6 * p.size * s * (Math.min(w, h) / 520))
          const rot = staticFrame ? p.phase : p.phase + t * p.spin * (1 - fallAmount * 0.6)
          drawGlyph(ctx, p.type, sx, sy, r, rot, alpha)
        }
      }
      if (!staticFrame) raf = requestAnimationFrame(render)
    }

    if (staticFrame) {
      // size the canvas once layout has settled, then paint a single frame
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          resize()
          render(start + 800)
        }),
      )
    } else {
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(wrap)
      raf = requestAnimationFrame(render)
      cleanupFns.push(() => ro.disconnect())
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      cleanupFns.forEach((fn) => fn())
      wrap.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative h-[420px] w-full sm:h-[500px]">
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  )
}
