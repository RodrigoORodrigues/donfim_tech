import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

const CountUp = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let current = 0;
    // Conta durante 1.5 segundos (1500ms). Atualiza a cada 30ms -> 50 passos
    const step = target / 50; 
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target, isInView]);

  return <span ref={ref} className="count-up">{count}</span>;
};

export default function Stats() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7 }}
      className="stats-bar"
    >
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">
            <CountUp target={17} />
            <span>+</span>
          </div>
          <div className="stat-label">Projetos Entregues</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            <CountUp target={100} />
            <span>%</span>
          </div>
          <div className="stat-label">Clientes Satisfeitos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
            <span>Inovação</span>
          </div>
          <div className="stat-label">Experiência & Expertise</div>
        </div>
      </div>
    </motion.div>
  );
}
