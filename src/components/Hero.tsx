import Logo from '../assets/Donfimtech.png';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="dot"></span>
          Construindo o Alicerce Digital
        </div>

        <div className="hero-logo mb-10 w-full max-w-[480px] mx-auto">
          <img src={Logo} alt="Donfim Tech" className="w-full h-auto object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
        </div>

        <h1>
          A sua nova <span className="gradient-text">Central de Tecnologia</span>
        </h1>

        <p className="typewriter">
          De sistemas customizados a automações inteligentes, criamos a estrutura digital que a sua empresa precisa para <strong style={{ color: 'var(--color-white)' }}>escalar com precisão.</strong>
        </p>

        <div className="hero-cta">
          <a href="#contato" className="btn-primary">
            Iniciar Projeto
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
          <a href="#servicos" className="btn-ghost">
            Explorar Soluções
          </a>
        </div>
      </div>
    </section>
  );
}
