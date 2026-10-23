import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import FilterDefs from './components/common/FilterDefs'
import PaintProgress from './components/common/PaintProgress'
import Loader from './components/Loader/Loader'
import Cursor from './components/Cursor/Cursor'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import TapeMarquee from './components/Marquee/TapeMarquee'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Education from './components/Education/Education'
import Contact from './components/Contact/Contact'
import Footer from './components/Contact/Footer'

function App() {
  const [loading, setLoading] = useState(true)
  const finishLoading = useCallback(() => setLoading(false), [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', loading)
  }, [loading])

  return (
    <MotionConfig reducedMotion="user">
      <FilterDefs />

      <AnimatePresence>{loading && <Loader key="loader" onDone={finishLoading} />}</AnimatePresence>

      {!loading && (
        <>
          <Cursor />
          <PaintProgress />
          <Navbar />
          <main>
            <Hero />
            <TapeMarquee />
            <About />
            <Projects />
            <Education />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </MotionConfig>
  )
}

export default App
