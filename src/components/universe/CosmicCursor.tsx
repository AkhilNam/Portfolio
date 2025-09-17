import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CosmicCursorProps {
  variant?: 'default' | 'hover' | 'click';
}

const CosmicCursor = ({ }: CosmicCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Trail particles for cosmic effect
  const [trailParticles, setTrailParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    life: number;
    size: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      setCursorPosition({ x, y });
      setIsVisible(true);

      // Create trail particles
      if (Math.random() < 0.3) { // 30% chance to spawn particle
        const newParticle = {
          id: particleId++,
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          life: 30,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.8 + 0.2
        };

        setTrailParticles(prev => [...prev, newParticle].slice(-20)); // Keep only last 20 particles
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Check for hoverable elements
    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('a, button, input, textarea, [role="button"], .hoverable, .clickable');
      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Animate trail particles
  useEffect(() => {
    const animateParticles = () => {
      setTrailParticles(prev =>
        prev.map(particle => ({
          ...particle,
          life: particle.life - 1,
          opacity: particle.opacity * 0.95,
          size: particle.size * 0.98
        })).filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail particles */}
      <div className="cosmic-cursor-trails">
        {trailParticles.map(particle => (
          <div
            key={particle.id}
            className="trail-particle"
            style={{
              position: 'fixed',
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              opacity: particle.opacity,
              pointerEvents: 'none',
              zIndex: 9999,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, ${particle.opacity * 0.5})`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className={`cosmic-cursor ${isClicking ? 'clicking' : ''} ${isHovering ? 'hovering' : ''}`}
        style={{
          position: 'fixed',
          left: cursorPosition.x,
          top: cursorPosition.y,
          pointerEvents: 'none',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Outer ring */}
        <motion.div
          className="cursor-outer-ring"
          style={{
            width: 40,
            height: 40,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: isHovering ? 1.2 : 1,
            rotate: 360
          }}
          transition={{
            scale: { type: "spring", stiffness: 300, damping: 30 },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Inner core */}
        <motion.div
          className="cursor-core"
          style={{
            width: 8,
            height: 8,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            scale: isClicking ? 1.5 : 1,
            opacity: isClicking ? 0.8 : 1
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {/* Cosmic particles around cursor */}
        {isHovering && (
          <div className="cursor-particles">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="cursor-particle"
                style={{
                  position: 'absolute',
                  width: 3,
                  height: 3,
                  backgroundColor: '#87CEEB',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%'
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 25],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 25],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Click ripple effect */}
        {isClicking && (
          <motion.div
            className="click-ripple"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 60,
              height: 60,
              border: '2px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Hover glow effect */}
        {isHovering && (
          <motion.div
            className="cursor-glow"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 80,
              height: 80,
              background: 'radial-gradient(circle, rgba(135, 206, 250, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Cursor styles */}
      <style>{`
        .cosmic-cursor {
          mix-blend-mode: difference;
        }

        .cursor-outer-ring {
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent,
            rgba(135, 206, 250, 0.2),
            transparent
          );
        }

        .trail-particle {
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(135, 206, 250, 0.4) 50%,
            transparent 100%
          );
        }

        @media (max-width: 768px) {
          .cosmic-cursor,
          .cosmic-cursor-trails {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CosmicCursor;