import Nav from '../components/Nav.jsx';
import Hero from '../components/Hero.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import { About, Events, Involve, Ministries, Scripture, Stories } from '../components/Sections.jsx';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Scripture
          quote="Let no one despise your youth, but set the believers an example in speech, in conduct, in love, in faith, in purity."
          cite="1 Timothy 4:12"
        />
        <Ministries />
        <Stories />
        <Events />
        <Involve />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
