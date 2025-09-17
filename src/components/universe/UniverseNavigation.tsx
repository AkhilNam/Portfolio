import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UniverseSection } from '../../App';

interface UniverseNavigationProps {
  onNavigate: (section: UniverseSection) => void;
  cosmicData: {
    starsExplored: number;
    planetsVisited: number;
    missionsCompleted: number;
  };
}

interface NavigationStar {
  id: UniverseSection;
  name: string;
  description: string;
  position: { x: number; y: number };
  constellation: string;
  color: string;
  size: number;
}

const UniverseNavigation = ({ onNavigate, cosmicData }: UniverseNavigationProps) => {
  const [_selectedStar, setSelectedStar] = useState<UniverseSection | null>(null);
  const [hoveredStar, setHoveredStar] = useState<UniverseSection | null>(null);
  const [constellationLines, setConstellationLines] = useState<Array<{from: {x: number, y: number}, to: {x: number, y: number}}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigationStars: NavigationStar[] = [
    {
      id: 'portfolio',
      name: 'Portfolio Galaxy',
      description: 'Explore my creative projects across the digital cosmos',
      position: { x: 25, y: 30 },
      constellation: 'Creativus',
      color: '#4F46E5',
      size: 1.2
    },
    {
      id: 'about',
      name: 'About Nebula',
      description: 'Discover my journey through space and time',
      position: { x: 75, y: 25 },
      constellation: 'Ingenium',
      color: '#7C3AED',
      size: 1.0
    },
    {
      id: 'contact',
      name: 'Contact Station',
      description: 'Establish communication across the void',
      position: { x: 50, y: 70 },
      constellation: 'Communicatus',
      color: '#EC4899',
      size: 1.1
    }
  ];

  // Generate constellation lines
  useEffect(() => {
    const lines: Array<{from: {x: number, y: number}, to: {x: number, y: number}}> = [];

    // Connect stars in constellation patterns
    if (navigationStars.length >= 2) {
      // Portfolio to About
      lines.push({
        from: navigationStars[0].position,
        to: navigationStars[1].position
      });

      // About to Contact
      lines.push({
        from: navigationStars[1].position,
        to: navigationStars[2].position
      });

      // Contact back to Portfolio (completing triangle)
      lines.push({
        from: navigationStars[2].position,
        to: navigationStars[0].position
      });
    }

    setConstellationLines(lines);
  }, []);

  // Animated background starfield
  useEffect(() => {
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

    // Background stars
    const backgroundStars: Array<{x: number, y: number, opacity: number, twinkleSpeed: number}> = [];
    for (let i = 0; i < 200; i++) {
      backgroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      backgroundStars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleStarClick = (starId: UniverseSection) => {
    setSelectedStar(starId);
    setTimeout(() => {
      onNavigate(starId);
    }, 800);
  };

  return (
    <div className="universe-navigation">
      <canvas
        ref={canvasRef}
        className="background-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      <div className="navigation-overlay">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="navigation-header"
        >
          <h1 className="universe-title">Navigation Hub</h1>
          <p className="universe-subtitle">Choose your destination in the cosmic expanse</p>
        </motion.div>

        {/* Constellation Map */}
        <div className="constellation-map">
          {/* Constellation lines */}
          <svg className="constellation-lines" viewBox="0 0 100 100">
            {constellationLines.map((line, index) => (
              <motion.line
                key={index}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="0.1"
                strokeDasharray="0.5 0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: 1 + index * 0.3 }}
              />
            ))}
          </svg>

          {/* Navigation Stars */}
          {navigationStars.map((star, index) => (
            <motion.div
              key={star.id}
              className="navigation-star"
              style={{
                left: `${star.position.x}%`,
                top: `${star.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredStar(star.id)}
              onHoverEnd={() => setHoveredStar(null)}
              onClick={() => handleStarClick(star.id)}
            >
              <div
                className="star-core"
                style={{
                  backgroundColor: star.color,
                  transform: `scale(${star.size})`,
                  boxShadow: `0 0 20px ${star.color}, 0 0 40px ${star.color}50`
                }}
              >
                <div className="star-pulse" style={{ borderColor: star.color }}></div>
                <div className="star-glow" style={{ backgroundColor: star.color }}></div>
              </div>

              <motion.div
                className="star-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredStar === star.id ? 1 : 0,
                  y: hoveredStar === star.id ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
              >
                <h3>{star.name}</h3>
                <p>{star.constellation}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Star Info Panel */}
        <AnimatePresence>
          {hoveredStar && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="star-info-panel"
            >
              {(() => {
                const star = navigationStars.find(s => s.id === hoveredStar);
                if (!star) return null;
                return (
                  <div>
                    <h3 style={{ color: star.color }}>{star.name}</h3>
                    <p className="constellation-name">Constellation: {star.constellation}</p>
                    <p className="star-description">{star.description}</p>
                    <button
                      className="navigate-button"
                      style={{ borderColor: star.color }}
                      onClick={() => handleStarClick(star.id)}
                    >
                      Navigate →
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cosmic Data Display */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="cosmic-data-display"
        >
          <h4>Mission Statistics</h4>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-value">{cosmicData.starsExplored}</span>
              <span className="data-label">Stars Explored</span>
            </div>
            <div className="data-item">
              <span className="data-value">{cosmicData.planetsVisited}</span>
              <span className="data-label">Planets Visited</span>
            </div>
            <div className="data-item">
              <span className="data-value">{cosmicData.missionsCompleted}</span>
              <span className="data-label">Missions Complete</span>
            </div>
          </div>
        </motion.div>

        {/* Floating cosmic debris */}
        <div className="cosmic-debris">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="debris-particle"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 10 + 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniverseNavigation;