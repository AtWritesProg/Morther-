import { useEffect, useRef } from 'react'

const COLORS = [
  '212,180,131',
  '193,126,107',
  '212,165,165',
  '245,225,190',
  '180,140,100',
  '220,200,160',
]

export default function CanvasBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onTouchMove = (e) => {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const COUNT = window.innerWidth < 600 ? 80 : 160
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.08,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.28 + 0.04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 1000,
      maxLife: 700 + Math.random() * 600,
      fiber: Math.random() < 0.25,
      angle: Math.random() * Math.PI,
      len: Math.random() * 8 + 3,
    }))

    const leaks = [
      { fx: 0, fy: 0, color: [212, 165, 100], r: 520 },
      { fx: 1, fy: 1, color: [160, 90, 70], r: 420 },
      { fx: 0.85, fy: 0.08, color: [200, 150, 90], r: 300 },
    ]

    let frame = 0

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      ctx.fillStyle = '#130f08'
      ctx.fillRect(0, 0, W, H)

      leaks.forEach((lk, i) => {
        const x = lk.fx * W
        const y = lk.fy * H
        const pulse = Math.sin(frame * 0.008 + i * 2) * 25
        const r = lk.r + pulse
        const [r0, g0, b0] = lk.color
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, `rgba(${r0},${g0},${b0},0.07)`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life++

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist2 = dx * dx + dy * dy
        if (dist2 < 8000) {
          const d = Math.sqrt(dist2)
          p.vx += (dx / d) * 0.06
          p.vy += (dy / d) * 0.06
        }

        p.vx *= 0.985
        p.vy *= 0.985

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        const lr = p.life / p.maxLife
        const alpha =
          lr < 0.1 ? (lr * 10) * p.opacity
          : lr > 0.9 ? ((1 - lr) * 10) * p.opacity
          : p.opacity

        ctx.beginPath()
        ctx.globalAlpha = alpha

        if (p.fiber) {
          const ex = p.x + Math.cos(p.angle) * p.len
          const ey = p.y + Math.sin(p.angle) * p.len
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(ex, ey)
          ctx.strokeStyle = `rgb(${p.color})`
          ctx.lineWidth = p.size * 0.5
          ctx.stroke()
          p.angle += 0.003
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${p.color})`
          ctx.fill()
        }

        ctx.globalAlpha = 1

        if (p.life >= p.maxLife) {
          p.x = Math.random() * W
          p.y = Math.random() * H
          p.life = 0
          p.vx = (Math.random() - 0.5) * 0.25
          p.vy = (Math.random() - 0.5) * 0.25 - 0.08
        }
      })

      frame++
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="canvas-bg" />
}
