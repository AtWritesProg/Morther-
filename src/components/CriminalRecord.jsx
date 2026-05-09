import { useEffect, useRef, useState } from 'react'
import './CriminalRecord.css'

const crimes = [
  {
    year: '2007',
    crime: 'Jevtana Hagat hota"',
    stamp: 'CASE FILED',
    rot: -2.5,
  },
  {
    year: '2011',
    crime: 'IDK man faltu ki bohot maar khayi hai. Witnesses unavailable due to trauma.',
    stamp: 'EVIDENCE',
    rot: 1.8,
  },
  {
    year: '2013',
    crime: 'Woke her up at 2AM for my diya making competition for school',
    stamp: 'VERIFIED',
    rot: -1.2,
  },
  {
    year: '2016',
    crime: 'Made her write my unfinished notebook.',
    stamp: 'GUILTY',
    rot: 2.3,
  },
  {
    year: '2022',
    crime: 'Ordered food sneakily and hid the evidence.',
    stamp: 'CLASSIC',
    rot: 1.5,
  },
  {
    year: '2025',
    crime: 'Still asks "Mumma where are my clothes?" as if she is the filing system.',
    stamp: 'ONGOING',
    rot: -2.1,
  },
]

function CrimeCard({ item, index }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`crime-card ${vis ? 'crime-card--visible' : ''}`}
      style={{
        transform: `rotate(${item.rot}deg)`,
        transitionDelay: `${index * 0.09}s`,
      }}
    >
      <span className="crime-pin" />
      <div className="crime-year">{item.year}</div>
      <p className="crime-text">{item.crime}</p>
      <div className="crime-stamp">{item.stamp}</div>
    </div>
  )
}

export default function CriminalRecord() {
  const titleRef = useRef(null)
  const [titleVis, setTitleVis] = useState(false)
  const footRef = useRef(null)
  const [footVis, setFootVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTitleVis(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(titleRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFootVis(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(footRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="criminal" className="criminal section">
      <div className="criminal-inner">
        <div ref={titleRef} className={`criminal-header ${titleVis ? 'fade-in visible' : 'fade-in'}`}>
          <span className="criminal-label">CLASSIFIED DOCUMENT</span>
          <h2 className="criminal-title">My Criminal Record</h2>
          <p className="criminal-sub">Evidence collected over 20+ years. Witness: Mumma.</p>
        </div>

        <div className="crimes-grid">
          {crimes.map((c, i) => <CrimeCard key={i} item={c} index={i} />)}
        </div>

        <div ref={footRef} className={`criminal-footer ${footVis ? 'fade-in visible' : 'fade-in'}`}>
          <p className="criminal-end">Yet somehow… she still loves me.</p>
          <div className="doodle-line">⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇⌇</div>
        </div>
      </div>
    </section>
  )
}
