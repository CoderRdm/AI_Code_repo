import Header from "../components/Header";
import Hero from "../components/Hero";
import BugDemo from "../components/BugDemo";
import { HowItWorks, Differences, Faq, FinalCta, Footer } from "../components/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BugDemo />
        <HowItWorks />
        <Differences />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
