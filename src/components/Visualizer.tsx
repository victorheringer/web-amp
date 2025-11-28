import { useEffect, useRef, useState } from "react";

interface VisualizerProps {
  isPlaying: boolean;
}

type VisualizerMode = "bars" | "wave" | "circle" | "spectrum";

const Visualizer = ({ isPlaying }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<VisualizerMode>("bars");

  // Alternar modos automaticamente
  useEffect(() => {
    if (!isPlaying) return;

    const modes: VisualizerMode[] = ["bars", "spectrum", "wave", "circle"];

    const interval = setInterval(() => {
      setMode((prevMode) => {
        let nextMode;
        do {
          nextMode = modes[Math.floor(Math.random() * modes.length)];
        } while (nextMode === prevMode);
        return nextMode;
      });
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [isPlaying]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const barCount = 64;
    const bars: number[] = new Array(barCount).fill(0);

    const resize = () => {
      if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    };

    // Usar ResizeObserver para detectar mudanças no tamanho do container (animação de abrir)
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    resize();

    const draw = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Atualizar dados da simulação
      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          const time = Date.now() / 1000;

          // Simulação mais complexa de áudio
          // Batida (Beat) a cada ~0.5s
          const beat = Math.pow(Math.sin(time * Math.PI * 2), 20);

          // Várias ondas combinadas
          const wave1 = Math.sin(i * 0.1 + time * 3);
          const wave2 = Math.cos(i * 0.3 - time * 5);
          const wave3 = Math.sin(i * 0.5 + time * 10) * beat; // Explosão nas altas frequências na batida

          // Ruído aleatório
          const noise = Math.random() * 0.3;

          // Combinação
          let value = wave1 * 0.3 + wave2 * 0.3 + wave3 * 0.2 + noise + 0.5;

          // Viés de frequência (graves mais fortes)
          const freqBias = 1 - (i / barCount) * 0.3;

          // Altura alvo baseada no modo
          let targetHeight = height * 0.5 * value * freqBias;

          if (mode === "circle") targetHeight *= 0.6;

          // Suavização do movimento
          bars[i] += (targetHeight - bars[i]) * 0.2;
        } else {
          bars[i] *= 0.9;
          if (bars[i] < 1) bars[i] = 0;
        }
      }

      // Renderização baseada no modo
      if (mode === "bars") {
        const barWidth = width / barCount;
        const gap = 2;
        const actualBarWidth = barWidth - gap;

        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth;
          const h = bars[i];
          const y = height - h;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, "#22c55e");
          gradient.addColorStop(0.5, "#eab308");
          gradient.addColorStop(1, "#ef4444");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, actualBarWidth, h);
        }
      } else if (mode === "spectrum") {
        // Espelhado no centro
        const barWidth = (width / barCount) * 2;
        const gap = 2;
        const actualBarWidth = barWidth - gap;
        const halfCount = Math.floor(barCount / 2);

        for (let i = 0; i < halfCount; i++) {
          const h = bars[i];

          // Lado esquerdo (invertido)
          const x1 = centerX - (i + 1) * barWidth;
          // Lado direito
          const x2 = centerX + i * barWidth;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, "#3b82f6"); // Blue
          gradient.addColorStop(0.5, "#8b5cf6"); // Purple
          gradient.addColorStop(1, "#ec4899"); // Pink

          ctx.fillStyle = gradient;
          ctx.fillRect(x1, height - h, actualBarWidth, h);
          ctx.fillRect(x2, height - h, actualBarWidth, h);
        }
      } else if (mode === "wave") {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let i = 0; i < barCount; i++) {
          const x = (i / (barCount - 1)) * width;
          // Usar o valor da barra para deslocar Y
          const offset = bars[i] * (i % 2 === 0 ? 1 : -1) * 0.5;
          const y = centerY + offset;

          // Curva suave
          if (i === 0) ctx.moveTo(x, y);
          else {
            const prevX = ((i - 1) / (barCount - 1)) * width;
            const prevOffset = bars[i - 1] * ((i - 1) % 2 === 0 ? 1 : -1) * 0.5;
            const prevY = centerY + prevOffset;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
          }
        }

        ctx.strokeStyle = "#06b6d4"; // Cyan
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#06b6d4";
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (mode === "circle") {
        const radius = Math.min(width, height) * 0.2;

        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2;
          const h = bars[i];

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;

          const x2 = centerX + Math.cos(angle) * (radius + h);
          const y2 = centerY + Math.sin(angle) * (radius + h);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);

          const hue = (i / barCount) * 360 + Date.now() / 50;
          ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isPlaying, mode]);

  return (
    <div className="relative w-full h-full group">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded text-xs text-white pointer-events-none">
        Modo: {mode.toUpperCase()}
      </div>
    </div>
  );
};

export default Visualizer;
