import { useEffect, useRef, useState } from 'react'
import './Intro.css'

const LINE1 = "Happy Mother's Day to the woman who survived raising US."
const LINE2 = "NASA should study how she handled our tantrums...vice versa. //Intentional"

export default function Intro({ onEnter }) {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [phase, setPhase] = useState(0)
  const [btnVisible, setBtnVisible] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    let t1, t2, t3, t4

    t1 = setTimeout(() => {
      setPhase(1)
      let i = 0
      const iv = setInterval(() => {
        i++
        setText1(LINE1.slice(0, i))
        if (i >= LINE1.length) {
          clearInterval(iv)
          t2 = setTimeout(() => {
            setPhase(2)
            let j = 0
            const iv2 = setInterval(() => {
              j++
              setText2(LINE2.slice(0, j))
              if (j >= LINE2.length) {
                clearInterval(iv2)
                t4 = setTimeout(() => setBtnVisible(true), 600)
              }
            }, 45)
          }, 700)
        }
      }, 48)
    }, 900)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [])

  const handleScroll = () => {
    const el = document.getElementById('criminal')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    if (onEnter) onEnter()
  }

  return (
    <section className="intro section">
      <div className="intro-inner">
        <div className="intro-polaroid-wrap" ref={imgRef}>
          <div className="intro-polaroid polaroid">
            <span className="tape tape-tl" />
            <span className="tape tape-tr" />
            <img src="/CharuMaa.png" alt="Mumma" />
            <p className="polaroid-caption">Mumma ♡</p>
          </div>
        </div>

        <div className="intro-text">
          {phase >= 1 && (
            <h1 className="intro-line1">
              {text1}
              {text1.length < LINE1.length && <span className="cursor" />}
            </h1>
          )}
          {phase >= 2 && (
            <p className="intro-line2">
              {text2}
              {text2.length < LINE2.length && <span className="cursor" />}
            </p>
          )}
        </div>

        {btnVisible && (
          <button className="intro-btn" onClick={handleScroll}>
            Aage Badho
          </button>
        )}
      </div>

      <div className="intro-scroll-hint">↓ scroll</div>
    </section>
  )
}
