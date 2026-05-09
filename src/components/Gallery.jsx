import { useCallback, useEffect, useRef, useState } from 'react'
import './Gallery.css'

const photos = [
  { src: '/Behna.jpeg',           caption: 'Behna',                   initRot: -3.5  },
  { src: '/Beli.png',             caption: 'Village chronicles',               initRot:  2.1  },
  { src: '/Bougie.JPG',           caption: 'Main character behaviour',         initRot: -1.8  },
  { src: '/Dulhan.jpeg',          caption: 'The original dulhan',              initRot:  3.2  },
  { src: '/Engineer.jpg',         caption: 'Engineering in my Blood',                initRot: -2.6  },
  { src: '/Flower.jpg',           caption: 'Heroine Only',                     initRot:  1.4  },
  { src: '/Lift.jpeg',            caption: 'Gym did not prepare me enough',                     initRot: -3.0  },
  { src: '/Par.jpeg',             caption: 'Pati Patni',                   initRot:  2.8  },
  { src: '/RetroBahu.jpeg',       caption: 'Retro bahu realness',              initRot: -1.5  },
  { src: '/cake.jpg',             caption: 'She wanted the cake more than me',                initRot:  3.5  },
  { src: '/cycle.jpg',            caption: '90s Vibe',                 initRot: -2.0  },
  { src: '/devCaske.jpeg',        caption: 'Still after the cake',                initRot:  1.9  },
  { src: '/lilCharuMePreggers.jpeg', caption: 'This is where I became her problem', initRot: -3.3 },
  { src: '/meSheCry.jpg',         caption: 'Tears: shared equally',            initRot:  2.4  },
  { src: '/shanta.jpeg',          caption: 'No',                initRot: -1.6  },
  { src: '/vegesYuk.jpeg',        caption: 'Ratri che 11 vajle ani majhe kaam sampat aj naahi',    initRot:  3.0  },
]

function Polaroid({ photo, index, pos, onDragStart, onTouchStart, isDragging, zIndex }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseEnter = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 12,
      y: -((e.clientX - cx) / rect.width) * 12,
    })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (isDragging) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 12,
      y: -((e.clientX - cx) / rect.width) * 12,
    })
  }

  const rotate = isDragging ? 0 : photo.initRot
  const transform = `
    translate(${pos.x}px, ${pos.y}px)
    rotate(${rotate}deg)
    rotateX(${isDragging ? 0 : tilt.x}deg)
    rotateY(${isDragging ? 0 : tilt.y}deg)
  `

  return (
    <div
      ref={ref}
      className={`gallery-polaroid polaroid ${isDragging ? 'gallery-polaroid--dragging' : ''}`}
      style={{
        transform,
        zIndex,
        transition: isDragging ? 'none' : 'transform 0.25s ease, box-shadow 0.25s ease, z-index 0s',
        perspective: '800px',
      }}
      onMouseDown={(e) => onDragStart(e, index)}
      onTouchStart={(e) => onTouchStart(e, index)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img src={photo.src} alt={photo.caption} loading="lazy" />
      <p className="polaroid-caption">{photo.caption}</p>
    </div>
  )
}

const COLS  = () => window.innerWidth < 600 ? 2 : 4
const CELLH = 240

function initPositions(count) {
  const cols  = COLS()
  const W     = window.innerWidth - 32
  const cellW = W / cols

  return Array.from({ length: count }, (_, i) => ({
    x: (i % cols) * cellW + (Math.random() - 0.5) * cellW * 0.28,
    y: Math.floor(i / cols) * CELLH + (Math.random() - 0.5) * 28,
  }))
}

function stageHeight(count) {
  return Math.ceil(count / COLS()) * CELLH + 80
}

export default function Gallery() {
  const [positions, setPositions] = useState(() => initPositions(photos.length))
  const [zIndexes, setZIndexes] = useState(() => photos.map((_, i) => i + 1))
  const maxZRef = useRef(photos.length)

  const dragging = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const titleRef = useRef(null)
  const [titleVis, setTitleVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTitleVis(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(titleRef.current)
    return () => obs.disconnect()
  }, [])

  const startDrag = useCallback((clientX, clientY, index) => {
    dragging.current = index
    dragOffset.current = {
      x: clientX - positions[index].x,
      y: clientY - positions[index].y,
    }
    maxZRef.current++
    const top = maxZRef.current
    setZIndexes(prev => prev.map((z, i) => i === index ? top : z))
  }, [positions])

  const onDragStart = useCallback((e, index) => {
    if (e.button !== 0) return
    e.preventDefault()
    startDrag(e.clientX, e.clientY, index)
  }, [startDrag])

  const onTouchStart = useCallback((e, index) => {
    e.preventDefault()
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY, index)
  }, [startDrag])

  const moveBy = useCallback((clientX, clientY) => {
    if (dragging.current === null) return
    const idx = dragging.current
    setPositions(prev => prev.map((p, i) =>
      i === idx ? { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y } : p
    ))
  }, [])

  const onMouseMove = useCallback((e) => moveBy(e.clientX, e.clientY), [moveBy])
  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    moveBy(e.touches[0].clientX, e.touches[0].clientY)
  }, [moveBy])

  const onMouseUp = useCallback(() => { dragging.current = null }, [])
  const onTouchEnd = useCallback(() => { dragging.current = null }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  return (
    <section className="gallery section">
      <div
        ref={titleRef}
        className={`gallery-header ${titleVis ? 'fade-in visible' : 'fade-in'}`}
      >
        <span className="gallery-label">PHOTO EVIDENCE</span>
        <h2 className="gallery-title">The Family Archives</h2>
        <p className="gallery-sub">Drag them around. She would.</p>
      </div>

      <div className="gallery-stage" style={{ minHeight: stageHeight(photos.length) }}>
        {photos.map((photo, i) => (
          <Polaroid
            key={i}
            photo={photo}
            index={i}
            pos={positions[i]}
            onDragStart={onDragStart}
            onTouchStart={onTouchStart}
            isDragging={false}
            zIndex={zIndexes[i]}
          />
        ))}
      </div>
    </section>
  )
}
