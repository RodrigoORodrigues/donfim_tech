import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── CANVAS PARTICLES ──
    const canvas = canvasRef.current;
    let canvasRafId: number;
    let resizeHandler: () => void;
    
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let W: number, H: number, particles: any[] = [];

        resizeHandler = () => {
          W = canvas.width = window.innerWidth;
          H = canvas.height = window.innerHeight;
        };
        resizeHandler();
        window.addEventListener('resize', resizeHandler);

        const N = Math.min(80, Math.floor(window.innerWidth / 16));
        for (let i = 0; i < N; i++) {
          particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            baseR: Math.random() * 1.8 + 0.6,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            r: 1
          });
        }

        function draw() {
          if (!ctx) return;
          ctx.clearRect(0, 0, W, H);
          particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            p.pulsePhase += p.pulseSpeed;
            p.r = p.baseR * (1 + Math.sin(p.pulsePhase) * 0.5); // Pulsating effect
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,180,255,${0.4 + Math.sin(p.pulsePhase) * 0.2})`;
            ctx.fill();
          });
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,180,255,${0.18 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
          canvasRafId = requestAnimationFrame(draw);
        }
        draw();
      }
    }

    return () => {
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(canvasRafId);
    };
  }, []);

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <canvas id="particle-canvas" ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-55"></canvas>
    </>
  );
}
