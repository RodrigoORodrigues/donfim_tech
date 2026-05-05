import { motion } from 'motion/react';

export default function Sobre() {
  return (
    <section id="sobre">
      <div className="container md:mx-auto max-w-[1200px]">
        <div className="sobre-grid">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="sobre-visual"
          >
            <div className="sobre-img-wrap">
              <img src="/Donfimtech.png" alt="Donfim Tech" className="w-full max-w-[400px] mx-auto block object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="sobre-badge">
              <span className="num">100%</span>
              <span className="lbl">Foco em Resultados</span>
            </div>
          </motion.div>
          <div className="sobre-content">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="section-tag">Quem somos</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="section-title">
              Tecnologia a serviço do <span style={{ color: "var(--color-cyan)" }}>seu crescimento</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
              Somos a Donfim Tech, uma equipa especializada em construir fundações digitais sólidas para empresas que querem crescer com inteligência. Não entregamos apenas código — entregamos resultados.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
              Cada projeto começa com uma análise profunda do seu negócio. Entendemos os seus desafios, objetivos e o mercado onde atua para criar soluções que realmente fazem diferença.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }} className="sobre-pills">
              <span className="pill">React & Next.js</span>
              <span className="pill">Node.js</span>
              <span className="pill">Make / n8n</span>
              <span className="pill">API Integrations</span>
              <span className="pill">SEO Técnico</span>
              <span className="pill">UI/UX Design</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
