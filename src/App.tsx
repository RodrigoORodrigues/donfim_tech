/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Sobre from './components/Sobre';
import Systems from './components/Systems';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundEffects from './components/BackgroundEffects';
import Intro from './components/Intro';
import Chatbot from './components/Chatbot';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introFadingOut, setIntroFadingOut] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-white overflow-hidden relative">
      {showIntro && (
        <Intro 
          onFadeStart={() => setIntroFadingOut(true)} 
          onComplete={() => setShowIntro(false)} 
        />
      )}
      
      {/* Hide the main content slightly while intro is playing to prevent scrollbars or interaction */}
      {/* As soon as the intro starts fading out, we make content visible to act as background */}
      <div 
        className={`transition-opacity duration-[1200ms] ${(!introFadingOut && showIntro) ? 'opacity-0' : 'opacity-100'} ${showIntro ? 'h-screen overflow-hidden' : ''}`}
      >
        <BackgroundEffects />
        
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <Stats />
            <Services />
            <Sobre />
            <Systems />
            <Faq />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
