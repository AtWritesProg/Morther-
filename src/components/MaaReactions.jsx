import { useRef, useState } from 'react'
import './MaaReactions.css'

const buttons = [
  {
    label: 'Jevan thanda hota hai',
    note: '"jevan thanda houn gela."',
    rot: -2,
    color: '#e8d5b0',
  },
  {
    label: 'Phone chhod de',
    note: '"Aankhein kharab ho jayengi. Meri baat nahi sunni?"',
    rot: 1.5,
    color: '#dcc8b0',
  },
  {
    label: 'Pankha band kar',
    note: '"Bijli ka bill kaun bharega? Tu bharega?"',
    rot: -1.2,
    color: '#e0cab8',
  },
  {
    label: 'Paise barbaad mat kar',
    note: '"Paisa ped pe nahi ugta, samjha?"',
    rot: 2.1,
    color: '#d8c8a8',
  },
  {
    label: 'Kapde utha apne',
    note: '"Main teri kaamwali nahi hoon, Atherva."',
    rot: -1.8,
    color: '#e4d0b8',
  },
  {
    label: 'Subah uth',
    note: '"Soye rehte ho. Aadhi zindagi khatam ho jayegi."',
    rot: 1.3,
    color: '#dcc0b0',
  },
]

function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  } catch (_) {}
}

function ReactionBtn({ item }) {
  const [shaking, setShaking] = useState(false)
  const [note, setNote] = useState(false)
  const timerRef = useRef(null)

  const handleClick = () => {
    playClick()
    setShaking(true)
    setNote(true)
    clearTimeout(timerRef.current)
    setTimeout(() => setShaking(false), 420)
    timerRef.current = setTimeout(() => setNote(false), 3200)
  }

  return (
    <div className="reaction-wrap">
      <button
        className={`reaction-btn ${shaking ? 'reaction-btn--shake' : ''}`}
        style={{
          transform: `rotate(${item.rot}deg)`,
          background: item.color,
        }}
        onClick={handleClick}
      >
        <span className="tape tape-h" />
        {item.label}
      </button>

      {note && (
        <div className="reaction-note" style={{ transform: `rotate(${-item.rot * 0.6}deg)` }}>
          <span className="tape tape-h" />
          {item.note}
        </div>
      )}
    </div>
  )
}

export default function MaaReactions() {
  return (
    <section className="reactions section">
      <div className="reactions-inner">
        <div className="reactions-header">
          <span className="reactions-label">AUDIO ARCHIVES — CIRCA EVERY DAY</span>
          <h2 className="reactions-title">Mumma Reactions</h2>
          <p className="reactions-sub">Press any button. You already know what happens.</p>
        </div>

        <div className="reactions-grid">
          {buttons.map((b, i) => <ReactionBtn key={i} item={b} />)}
        </div>

        <p className="reactions-note-footer">
          These phrases have been heard an estimated 10,000+ times. Still ring true.
        </p>
      </div>
    </section>
  )
}
