import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { UniverseSection } from '../../App';

interface NebulaAboutProps {
  onNavigate: (section: UniverseSection) => void;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'experience' | 'achievement';
  color: string;
  position: number;
}

const NebulaAbout = ({ onNavigate }: NebulaAboutProps) => {
  const [activeSection, setActiveSection] = useState<'story' | 'timeline' | 'skills'>('story');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const nebulaOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.4, 0.8]);
  const nebulaScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  const timelineEvents: TimelineEvent[] = [
    {
      year: '2024',
      title: 'Analyst Intern at Strategy Kiln',
      description: 'Managed $65M in client leads, optimized CRM workflows increasing efficiency by 25%, and deployed AI-driven tools for client acquisition.',
      type: 'experience',
      color: '#FFD700',
      position: 10
    },
    {
      year: '2023',
      title: 'Undergraduate Researcher at Georgia Tech',
      description: 'Designed liquid-level capacitive sensors for moth feeding studies, built reusable double-capacitor setups with Arduino integration.',
      type: 'experience',
      color: '#00CED1',
      position: 25
    },
    {
      year: '2023',
      title: 'Started at Georgia Institute of Technology',
      description: 'Pursuing Bachelor of Science in Computer Science and Mathematics, expected graduation May 2027.',
      type: 'education',
      color: '#32CD32',
      position: 40
    },
    {
      year: '2024',
      title: 'BiasScope - Media Bias Analyzer',
      description: 'Built media bias analyzer using React, FastAPI, and Sonar API for real-time news analysis and multi-source citations.',
      type: 'achievement',
      color: '#9370DB',
      position: 55
    },
    {
      year: '2024',
      title: 'PhantomShield - Deepfake Detection',
      description: 'Developed real-time deepfake detection system for Zoom/Teams calls with sub-200ms latency using PyTorch and OpenCV.',
      type: 'achievement',
      color: '#FF6347',
      position: 70
    },
    {
      year: '2024',
      title: 'LLM-SDQ Research Project',
      description: 'Implemented per-layer quantization in GPT-2, reducing model size 4x while maintaining 95% accuracy on SQuAD.',
      type: 'achievement',
      color: '#FF69B4',
      position: 85
    }
  ];

  const skills = {
    'Programming Languages': ['Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
    'Frameworks & APIs': ['PyTorch', 'TensorFlow', 'React', 'FastAPI', 'Node.js', 'Flask', 'ROS', 'Express.js', 'Django', 'Next.js'],
    'Databases & Cloud': ['PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'Firebase'],
    'Data Science & Tools': ['Pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'Airflow', 'Git', 'Jupyter', 'Plotly'],
    'AI/ML': ['PyTorch', 'TensorFlow', 'OpenCV', 'ResNet18', 'Transformers', 'LoRA', 'CUDA', 'Hugging Face'],
    'Systems & Hardware': ['Linux', 'VSCode Remote-SSH', 'HPC clusters', 'Arduino', 'Gazebo', 'NVIDIA GPUs']
  };

  // Animated nebula background
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

    // Nebula particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      life: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: ['#FF6B9D', '#C44569', '#F8B500', '#40E0D0', '#9B59B6'][Math.floor(Math.random() * 5)],
        opacity: Math.random() * 0.8 + 0.2,
        life: Math.random() * 100 + 50
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      // Create nebula effect
      ctx.fillStyle = 'rgba(0, 0, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.5;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle when life ends
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = Math.random() * 100 + 50;
          particle.opacity = Math.random() * 0.8 + 0.2;
        }

        // Create nebula glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );

        const alpha = particle.opacity * (particle.life / 100);
        gradient.addColorStop(0, particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
        gradient.addColorStop(0.5, particle.color.replace(')', `, ${alpha * 0.5})`).replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'education': return '🎓';
      case 'experience': return '💼';
      case 'achievement': return '🏆';
      default: return '✨';
    }
  };

  return (
    <div className="nebula-about" ref={scrollRef}>
      <motion.canvas
        ref={canvasRef}
        className="nebula-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: nebulaOpacity,
          scale: nebulaScale,
          zIndex: 0
        }}
      />

      <div className="about-overlay">
        {/* Navigation */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="about-navigation"
        >
          <div className="nav-sections">
            {(['story', 'timeline', 'skills'] as const).map((section) => (
              <button
                key={section}
                className={`nav-section ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          <button
            className="nav-back-button"
            onClick={() => onNavigate('navigation')}
          >
            ← Navigation
          </button>
        </motion.div>

        {/* Content Sections */}
        <div className="about-content">
          {/* Story Section */}
          {activeSection === 'story' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="story-section"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="about-title"
              >
                Journey Through the Digital Cosmos
              </motion.h1>

              <div className="story-content">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="story-text"
                >
                  <p>
                    Welcome to my digital universe! I'm Akhil Nampally, a Computer Science and Mathematics
                    student at Georgia Institute of Technology with a passion for AI/ML, data science,
                    and building innovative solutions. My journey began with curiosity about how technology
                    can solve real-world problems.
                  </p>

                  <p>
                    From developing real-time deepfake detection systems to optimizing large language models,
                    I thrive on tackling complex challenges at the intersection of AI and software engineering.
                    My experience spans research, internships, and personal projects that push the boundaries
                    of what's possible with modern technology.
                  </p>

                  <p>
                    Currently pursuing my degree while conducting research in dynamical systems and working
                    on cutting-edge ML projects. I'm passionate about using technology to create meaningful
                    impact, whether it's through research publications, hackathon wins, or innovative applications.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="story-stats"
                >
                  <div className="stat-item">
                    <span className="stat-number">8+</span>
                    <span className="stat-label">Major Projects</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Research Positions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">20+</span>
                    <span className="stat-label">Technologies</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">85%</span>
                    <span className="stat-label">Model Accuracy Maintained</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Timeline Section */}
          {activeSection === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="timeline-section"
            >
              <h2 className="section-title">Stellar Timeline</h2>

              <div className="timeline-container">
                <div className="timeline-line"></div>

                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
                    style={{ top: `${event.position}%` }}
                  >
                    <div className="event-content" style={{ borderColor: event.color }}>
                      <div className="event-icon" style={{ backgroundColor: event.color }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="event-details">
                        <h3 style={{ color: event.color }}>{event.title}</h3>
                        <span className="event-year">{event.year}</span>
                        <p>{event.description}</p>
                      </div>
                    </div>

                    <div
                      className="timeline-marker"
                      style={{ backgroundColor: event.color }}
                    >
                      <div className="marker-pulse" style={{ borderColor: event.color }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="skills-section"
            >
              <h2 className="section-title">Technical Constellation</h2>

              <div className="skills-grid">
                {Object.entries(skills).map(([category, skillList], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="skill-category"
                  >
                    <h3 className="category-title">{category}</h3>
                    <div className="skills-list">
                      {skillList.map((skill, skillIndex) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                          className="skill-badge"
                          whileHover={{ scale: 1.1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="skills-philosophy"
              >
                <h3>My Development Philosophy</h3>
                <p>
                  I believe in building technology that makes a meaningful impact. Whether it's
                  developing real-time AI systems, optimizing machine learning models, or creating
                  scalable data platforms, I focus on solutions that solve real problems.
                  Continuous learning, research excellence, and collaborative innovation drive
                  my approach to computer science and mathematics.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Floating cosmic elements */}
        <div className="cosmic-elements">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-element"
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
                opacity: [0, 0.4, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NebulaAbout;