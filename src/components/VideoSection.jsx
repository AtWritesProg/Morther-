import { useEffect, useRef, useState } from 'react'
import './VideoSection.css'

function useConfetti(trigger) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 1.5 + Math.random() * 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.12,
      w: 6 + Math.random() * 10,
      h: 4 + Math.random() * 6,
      color: ['#d4a5a5','#d4b483','#c17e6b','#f5f0e8','#8b6356','#dcc8b0'][Math.floor(Math.random()*6)],
      life: 0,
      maxLife: 180 + Math.random() * 120,
    }))

    let id
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      pieces.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.rot += p.rotV
        p.life++
        if (p.life < p.maxLife) alive = true
        const a = p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1
        ctx.save()
        ctx.globalAlpha = a
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive) id = requestAnimationFrame(step)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [trigger])

  return canvasRef
}

export default function VideoSection() {
  const sectionRef = useRef(null)
  const [vis, setVis] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const confettiRef = useConfetti(confetti)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true)
          setTimeout(() => setConfetti(true), 1800)
          obs.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="video-sec section">
      <canvas ref={confettiRef} className="confetti-canvas" />

      <div className="video-inner">
        <div className={`video-header ${vis ? 'fade-in visible' : 'fade-in'}`}>
          <span className="video-label">A SONG — FOR YOU</span>
          <h2 className="video-title">Meri Mumma</h2>
        </div>

        <div
          className={`video-frame-wrap ${vis ? 'video-frame-wrap--visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div className="video-frame">
            <span className="tape tape-tl" />
            <span className="tape tape-tr" />
            <video controls playsInline>
              <source src="/meri-mumma.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="video-vignette" />
        </div>

        <div
          className={`video-end ${vis ? 'fade-in visible' : 'fade-in'}`}
          style={{ transitionDelay: '1.2s' }}
        >
          <p className="video-end-text">Happy Mother's Day</p>
        </div>
      </div>
    </section>
  )
}
