import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${isScrolled ? 'bg-[#050810]/85 backdrop-blur-[20px] border-b border-[#00D4FF]/15 py-0' : 'bg-transparent py-2'}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-[80px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group nav-logo">
          <span className="text-2xl font-bold font-display text-white tracking-widest hidden sm:inline-block">DONFIM<span className="text-[#00D4FF]">TECH</span></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-9">
          <a href="#servicos" className="text-[14px] font-semibold text-white drop-shadow-md hover:text-[#00D4FF] tracking-[0.04em] uppercase transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#00D4FF] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Serviços</a>
          <a href="#sobre" className="text-[14px] font-semibold text-white drop-shadow-md hover:text-[#00D4FF] tracking-[0.04em] uppercase transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#00D4FF] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Sobre</a>
          <a href="#sistemas" className="text-[14px] font-semibold text-white drop-shadow-md hover:text-[#00D4FF] tracking-[0.04em] uppercase transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#00D4FF] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Sistemas</a>
          <a href="#faq" className="text-[14px] font-semibold text-white drop-shadow-md hover:text-[#00D4FF] tracking-[0.04em] uppercase transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#00D4FF] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">FAQ</a>
          <a href="#contato" className="btn-primary">
            Falar com Especialista
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2 relative z-50 rounded-full hover:bg-white/10 transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed inset-0 z-40 bg-[#050810]/98 backdrop-blur-2xl flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center w-full max-w-sm px-6 gap-2">
              <a href="#servicos" className="w-full text-center py-5 text-[#F0F4FF] font-display text-xl sm:text-2xl font-semibold tracking-[0.08em] uppercase hover:text-[#00D4FF] hover:bg-white/5 active:bg-white/10 rounded-2xl transition-all" onClick={() => setIsMobileMenuOpen(false)}>Serviços</a>
              <a href="#sobre" className="w-full text-center py-5 text-[#F0F4FF] font-display text-xl sm:text-2xl font-semibold tracking-[0.08em] uppercase hover:text-[#00D4FF] hover:bg-white/5 active:bg-white/10 rounded-2xl transition-all" onClick={() => setIsMobileMenuOpen(false)}>Sobre</a>
              <a href="#sistemas" className="w-full text-center py-5 text-[#F0F4FF] font-display text-xl sm:text-2xl font-semibold tracking-[0.08em] uppercase hover:text-[#00D4FF] hover:bg-white/5 active:bg-white/10 rounded-2xl transition-all" onClick={() => setIsMobileMenuOpen(false)}>Sistemas</a>
              <a href="#faq" className="w-full text-center py-5 text-[#F0F4FF] font-display text-xl sm:text-2xl font-semibold tracking-[0.08em] uppercase hover:text-[#00D4FF] hover:bg-white/5 active:bg-white/10 rounded-2xl transition-all" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <a href="#contato" className="btn-primary mt-6 w-full max-w-[280px] h-[54px] flex items-center justify-center text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
