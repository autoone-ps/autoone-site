import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { HowWeWork } from './components/HowWeWork'
import { WhyUs } from './components/WhyUs'
import { WhoWeHelp } from './components/WhoWeHelp'
import { Team } from './components/Team'
import { TechSystems } from './components/TechSystems'
import { FAQ } from './components/FAQ'
import { ContactSection } from './components/ContactSection'
import { Support } from './components/Support'
import { ContactInfo } from './components/ContactInfo'
import { Footer } from './components/Footer'
import { GuideDock } from './components/GuideDock'
import { SiteMark } from './components/SiteMark'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <HowWeWork />
        <WhyUs />
        <WhoWeHelp />
        <Team />
        <TechSystems />
        <FAQ />
        <ContactSection />
        <Support />
        <ContactInfo />
      </main>
      <Footer />
      <SiteMark />
      <GuideDock />
    </>
  )
}
