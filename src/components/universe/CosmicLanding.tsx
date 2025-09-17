import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CosmicLandingProps {
  onEnterUniverse: () => void;
}

const CosmicLanding = ({ onEnterUniverse }: CosmicLandingProps) => {
  const [_isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animated starfield canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star system
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      opacity: number;
      speed: number;
    }> = [];

    // Initialize stars
    for (let i = 0; i < 800; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach(star => {
        // Move star towards viewer
        star.z -= star.speed;

        // Reset star when it gets too close
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.opacity = Math.random();
        }

        // Calculate screen position
        const x = (star.x / star.z) * 100 + centerX;
        const y = (star.y / star.z) * 100 + centerY;

        // Calculate size and opacity based on distance
        const size = (1 - star.z / 1000) * star.size * 2;
        const opacity = (1 - star.z / 1000) * star.opacity;

        // Draw star
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Add glow for larger stars
          if (size > 1) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(135, 206, 250, ${opacity * 0.3})`;
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw star trail
          const prevX = ((star.x + star.speed * 10) / (star.z + star.speed)) * 100 + centerX;
          const prevY = ((star.y + star.speed * 10) / (star.z + star.speed)) * 100 + centerY;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          ctx.lineWidth = size * 0.5;
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation after short delay
    setTimeout(() => {
      console.log('Setting isLoaded to true');
      setIsLoaded(true);
      animate();
      setTimeout(() => {
        console.log('Setting showContent to true');
        setShowContent(true);
      }, 800);
    }, 500);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleEnterUniverse = () => {
    console.log('Button clicked! showContent:', showContent);

    // Add launch effect
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transform = 'scale(1.1)';
      canvas.style.filter = 'brightness(2)';
    }

    setTimeout(() => {
      console.log('Calling onEnterUniverse');
      onEnterUniverse();
    }, 800);
  };

  return (
    <div className="cosmic-landing">
      <canvas
        ref={canvasRef}
        className="starfield-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transition: 'all 0.8s ease-out'
        }}
      />

      <div className="cosmic-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="landing-content"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: showContent ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="cosmic-title"
          >
            Welcome to Akhil's Universe
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: showContent ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="cosmic-subtitle"
          >
            Explore the infinite expanse of creativity and innovation
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="launch-controls"
          >
            <button
              onClick={handleEnterUniverse}
              className="launch-button"
              disabled={false}
              style={{
                zIndex: 1000,
                position: 'relative',
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
            >
              <span className="launch-text">Launch Into Space</span>
              <div className="launch-trail"></div>
            </button>

            <div className="cosmic-hint">
              <div className="hint-pulse"></div>
              <span>Click to begin your journey</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Cosmic particles */}
        <div className="cosmic-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="cosmic-particle"
              initial={{
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Nebula background effects */}
        <div className="nebula-background">
          <div className="nebula-cloud nebula-1"></div>
          <div className="nebula-cloud nebula-2"></div>
          <div className="nebula-cloud nebula-3"></div>
        </div>
      </div>
    </div>
  );
};

export default CosmicLanding;