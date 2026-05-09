import CanvasBackground from './components/CanvasBackground'
import Intro from './components/Intro'
import CriminalRecord from './components/CriminalRecord'
import Gallery from './components/Gallery'
import MaaReactions from './components/MaaReactions'
import VideoSection from './components/VideoSection'

export default function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <CanvasBackground />
      <main>
        <Intro />
        <CriminalRecord />
        <Gallery />
        <MaaReactions />
        <VideoSection />
      </main>
    </>
  )
}
