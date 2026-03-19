import SectionsContainer from '@/components/SectionsContainer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experiences from '@/components/sections/Experiences'
import Education from '@/components/sections/Education'
import { MacBookTransitionProvider } from '@/contexts/MacBookTransitionContext'
import MacBookSceneLoader from '@/components/macbook/MacBookSceneLoader'

export default function Home() {
  return (
    <MacBookTransitionProvider>
      <MacBookSceneLoader />
      <SectionsContainer>
        <Hero />
        <About />
        <Experiences />
        <Education />
      </SectionsContainer>
    </MacBookTransitionProvider>
  )
}
