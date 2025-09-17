import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UniverseSection } from '../../App';

interface GalaxyPortfolioProps {
  onNavigate: (section: UniverseSection) => void;
}

interface Project {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'nebula';
  category: string;
  description: string;
  technologies: string[];
  position: { x: number; y: number };
  color: string;
  size: number;
  link?: string;
  github?: string;
  featured?: boolean;
}

const GalaxyPortfolio = ({ onNavigate }: GalaxyPortfolioProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [_currentView, setCurrentView] = useState<'overview' | 'detailed'>('overview');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const projects: Project[] = [
    {
      id: 'phantomshield',
      name: 'PhantomShield',
      type: 'star',
      category: 'AI/ML Security',
      description: 'Real-time deepfake detection system that flags AI-generated faces and audio in live Zoom/Teams calls with sub-200ms latency. Reduced false positives through advanced threshold tuning.',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'ResNet18', 'React'],
      position: { x: 20, y: 25 },
      color: '#FFD700',
      size: 1.5,
      featured: true,
      github: 'https://github.com/akhilnam'
    },
    {
      id: 'biasscope',
      name: 'BiasScope',
      type: 'planet',
      category: 'NLP/Analytics',
      description: 'Media bias analyzer that compares news bias in real-time using tone analysis and multi-source citations with Sonar Reasoning Pro for deep reasoning.',
      technologies: ['React', 'FastAPI', 'Sonar API', 'NLP', 'Multi-source Analysis'],
      position: { x: 60, y: 35 },
      color: '#00CED1',
      size: 1.2,
      github: 'https://github.com/akhilnam'
    },
    {
      id: 'llm-sdq',
      name: 'LLM-SDQ',
      type: 'nebula',
      category: 'ML Optimization',
      description: 'Efficient LLMs via dynamic quantization. Implemented per-layer quantization in GPT-2, reducing model size 4x while maintaining 85% accuracy on SQuAD.',
      technologies: ['PyTorch', 'Transformers', 'LoRA', 'CUDA', 'HPC'],
      position: { x: 75, y: 60 },
      color: '#9370DB',
      size: 1.0,
      github: 'https://github.com/akhilnam'
    },
    {
      id: 'ev-arb-tool',
      name: 'EV-Arb-Tool',
      type: 'planet',
      category: 'Sports Analytics',
      description: 'Sports analytics platform processing 10,000+ betting props daily to calculate expected value and identify arbitrage opportunities with real-time monitoring.',
      technologies: ['Python', 'FastAPI', 'React', 'Pandas', 'MongoDB'],
      position: { x: 25, y: 70 },
      color: '#FF6347',
      size: 1.1,
      github: 'https://github.com/akhilnam'
    },
    {
      id: 'anyinsight',
      name: 'AnyInsight',
      type: 'star',
      category: 'Data Intelligence',
      description: 'Analytics platform for structured/unstructured data with anomaly detection. Optimized query response by 60% and scaled to 500+ concurrent users.',
      technologies: ['FastAPI', 'PostgreSQL', 'React', 'Docker', 'AWS'],
      position: { x: 45, y: 15 },
      color: '#32CD32',
      size: 1.0,
      github: 'https://github.com/akhilnam'
    },
    {
      id: 'autonomous-robot',
      name: 'Autonomous SLAM Robot',
      type: 'nebula',
      category: 'Robotics/AI',
      description: 'Navigation robot with SLAM-based mapping and obstacle avoidance. Implemented reinforcement learning for adaptive multi-goal path planning.',
      technologies: ['ROS', 'Gazebo', 'Python', 'C++', 'SLAM'],
      position: { x: 80, y: 20 },
      color: '#FF69B4',
      size: 0.9,
      github: 'https://github.com/akhilnam'
    }
  ];

  // Animate background galaxy
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

    // Galaxy stars and cosmic dust
    const cosmicElements: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 300; i++) {
      cosmicElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        color: ['#FFD700', '#87CEEB', '#DDA0DD', '#98FB98'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      // Create galaxy spiral effect
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cosmicElements.forEach((element, index) => {
        // Spiral galaxy motion
        const spiralAngle = time * element.speed + index * 0.1;
        const spiralRadius = element.z * 2;

        element.x = canvas.width / 2 + Math.cos(spiralAngle) * spiralRadius;
        element.y = canvas.height / 2 + Math.sin(spiralAngle) * spiralRadius * 0.3;

        // Pulsing effect
        const pulse = Math.sin(time * 2 + index) * 0.3 + 0.7;
        const currentOpacity = element.opacity * pulse;

        ctx.beginPath();
        ctx.fillStyle = element.color.replace(')', `, ${currentOpacity})`).replace('rgb', 'rgba');
        ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          element.x, element.y, 0,
          element.x, element.y, element.size * 3
        );
        gradient.addColorStop(0, element.color.replace(')', `, ${currentOpacity * 0.5})`).replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size * 3, 0, Math.PI * 2);
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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('detailed');
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setCurrentView('overview');
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'star': return '⭐';
      case 'planet': return '🪐';
      case 'nebula': return '🌌';
      default: return '✨';
    }
  };

  return (
    <div className="galaxy-portfolio">
      <canvas
        ref={canvasRef}
        className="galaxy-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      <div className="portfolio-overlay">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="portfolio-header"
        >
          <h1 className="galaxy-title">Portfolio Galaxy</h1>
          <p className="galaxy-subtitle">Explore stellar projects across the digital cosmos</p>
        </motion.div>

        {/* Project Constellation */}
        <div className="project-constellation">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`project-celestial ${project.type} ${project.featured ? 'featured' : ''}`}
              style={{
                left: `${project.position.x}%`,
                top: `${project.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.3 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              onClick={() => handleProjectClick(project)}
            >
              <div
                className="project-core"
                style={{
                  backgroundColor: project.color,
                  transform: `scale(${project.size})`,
                  boxShadow: `0 0 30px ${project.color}80`
                }}
              >
                <span className="project-icon">{getProjectIcon(project.type)}</span>
                <div className="project-pulse" style={{ borderColor: project.color }}></div>

                {project.featured && (
                  <div className="featured-ring" style={{ borderColor: project.color }}></div>
                )}
              </div>

              <motion.div
                className="project-label"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: hoveredProject === project.id ? 1 : 0,
                  y: hoveredProject === project.id ? 0 : 20
                }}
                transition={{ duration: 0.3 }}
              >
                <h3>{project.name}</h3>
                <p>{project.category}</p>
              </motion.div>

              {/* Orbital rings for featured projects */}
              {project.featured && (
                <div className="orbital-system">
                  <div className="orbit orbit-1"></div>
                  <div className="orbit orbit-2"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="project-modal-backdrop"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="project-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ borderColor: selectedProject.color }}
              >
                <div className="modal-header">
                  <div className="project-title-section">
                    <span className="project-type-icon" style={{ color: selectedProject.color }}>
                      {getProjectIcon(selectedProject.type)}
                    </span>
                    <div>
                      <h2 style={{ color: selectedProject.color }}>{selectedProject.name}</h2>
                      <span className="project-category">{selectedProject.category}</span>
                    </div>
                  </div>
                  <button className="close-button" onClick={handleCloseModal}>×</button>
                </div>

                <div className="modal-content">
                  <p className="project-description">{selectedProject.description}</p>

                  <div className="tech-constellation">
                    <h4>Technologies</h4>
                    <div className="tech-grid">
                      {selectedProject.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          className="tech-badge"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ borderColor: selectedProject.color }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="project-links">
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link live-link"
                        style={{ backgroundColor: selectedProject.color }}
                      >
                        🚀 Launch Project
                      </a>
                    )}
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github-link"
                        style={{ borderColor: selectedProject.color }}
                      >
                        💫 View Code
                      </a>
                    )}
                  </div>
                </div>

                {/* Modal cosmic effects */}
                <div className="modal-cosmic-effects">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="cosmic-spark"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                      style={{ backgroundColor: selectedProject.color }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation back button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="nav-back-button"
          onClick={() => onNavigate('navigation')}
        >
          ← Back to Navigation
        </motion.button>
      </div>
    </div>
  );
};

export default GalaxyPortfolio;