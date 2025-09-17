import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UniverseSection } from '../../App';

interface ContactStationProps {
  onNavigate: (section: UniverseSection) => void;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface CommunicationChannel {
  id: string;
  name: string;
  icon: string;
  description: string;
  link: string;
  color: string;
  active: boolean;
}

const ContactStation = ({ onNavigate }: ContactStationProps) => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '', email: '', subject: '', message: ''
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionComplete, setTransmissionComplete] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const communicationChannels: CommunicationChannel[] = [
    {
      id: 'email',
      name: 'Quantum Email',
      icon: '📧',
      description: 'anampally3@gatech.edu',
      link: 'mailto:anampally3@gatech.edu',
      color: '#4F46E5',
      active: true
    },
    {
      id: 'linkedin',
      name: 'Professional Network',
      icon: '💼',
      description: 'Connect through the professional cosmos',
      link: 'https://linkedin.com/in/akhilnampally',
      color: '#0077B5',
      active: true
    },
    {
      id: 'github',
      name: 'Code Repository',
      icon: '💻',
      description: 'Explore collaborative development space',
      link: 'https://github.com/akhilnam',
      color: '#333333',
      active: true
    },
    {
      id: 'website',
      name: 'Personal Portal',
      icon: '🌐',
      description: 'Visit my digital home in the cosmos',
      link: 'https://akhilnam.xyz',
      color: '#1DA1F2',
      active: true
    },
    {
      id: 'resume',
      name: 'Digital Dossier',
      icon: '📄',
      description: 'Access my comprehensive profile archive',
      link: '/Akhil_Updated.pdf',
      color: '#00C4A7',
      active: true
    }
  ];

  // Animated communication grid background
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

    // Communication signals and data streams
    const signals: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
    }> = [];

    // Initialize signals
    for (let i = 0; i < 50; i++) {
      signals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        progress: 0,
        speed: Math.random() * 0.02 + 0.005,
        color: ['#4F46E5', '#7C3AED', '#EC4899', '#10B981'][Math.floor(Math.random() * 4)],
        size: Math.random() * 3 + 1
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;

      // Create deep space communication grid
      ctx.fillStyle = 'rgba(0, 0, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animate signals
      signals.forEach(signal => {
        signal.progress += signal.speed;

        // Reset signal when it reaches target
        if (signal.progress >= 1) {
          signal.x = signal.targetX;
          signal.y = signal.targetY;
          signal.targetX = Math.random() * canvas.width;
          signal.targetY = Math.random() * canvas.height;
          signal.progress = 0;
        }

        // Interpolate position
        const currentX = signal.x + (signal.targetX - signal.x) * signal.progress;
        const currentY = signal.y + (signal.targetY - signal.y) * signal.progress;

        // Draw signal
        const alpha = Math.sin(signal.progress * Math.PI) * 0.8;
        ctx.fillStyle = signal.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(currentX, currentY, signal.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw signal trail
        const trailLength = 20;
        for (let i = 0; i < trailLength; i++) {
          const trailProgress = Math.max(0, signal.progress - (i * 0.02));
          const trailX = signal.x + (signal.targetX - signal.x) * trailProgress;
          const trailY = signal.y + (signal.targetY - signal.y) * trailProgress;
          const trailAlpha = alpha * (1 - i / trailLength) * 0.5;

          ctx.fillStyle = signal.color.replace(')', `, ${trailAlpha})`).replace('rgb', 'rgba');
          ctx.beginPath();
          ctx.arc(trailX, trailY, signal.size * (1 - i / trailLength), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);

    // Simulate transmission
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmissionComplete(true);

      // Reset form after success animation
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTransmissionComplete(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="contact-station">
      <canvas
        ref={canvasRef}
        className="communication-grid"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      <div className="station-overlay">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="station-header"
        >
          <h1 className="station-title">Contact Station</h1>
          <p className="station-subtitle">Establish communication across the digital cosmos</p>
        </motion.div>

        <div className="station-content">
          {/* Communication Channels */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="communication-channels"
          >
            <h2>Communication Channels</h2>
            <div className="channels-grid">
              {communicationChannels.map((channel, index) => (
                <motion.a
                  key={channel.id}
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`channel-card ${!channel.active ? 'inactive' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onHoverStart={() => setSelectedChannel(channel.id)}
                  onHoverEnd={() => setSelectedChannel(null)}
                  style={{ borderColor: channel.color }}
                >
                  <div className="channel-icon" style={{ color: channel.color }}>
                    {channel.icon}
                  </div>
                  <h3 style={{ color: channel.color }}>{channel.name}</h3>
                  <p>{channel.description}</p>

                  {channel.active && (
                    <div className="signal-indicator">
                      <div
                        className="signal-pulse"
                        style={{ backgroundColor: channel.color }}
                      ></div>
                      <span>Active</span>
                    </div>
                  )}

                  {selectedChannel === channel.id && (
                    <motion.div
                      className="channel-glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        boxShadow: `0 0 30px ${channel.color}50`,
                        borderColor: channel.color
                      }}
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Direct Communication Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="direct-communication"
          >
            <h2>Direct Transmission</h2>

            <AnimatePresence mode="wait">
              {!transmissionComplete ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="transmission-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="name">Sender Identification</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="email">Quantum Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@cosmos.com"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="subject">Transmission Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Purpose of communication"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="message">Message Payload</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Compose your transmission..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="transmit-button"
                    disabled={isTransmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isTransmitting ? (
                      <div className="transmitting">
                        <div className="transmission-indicator"></div>
                        Transmitting...
                      </div>
                    ) : (
                      <>
                        <span>🚀 Send Transmission</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="transmission-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="success-icon">🛸</div>
                  <h3>Transmission Successful!</h3>
                  <p>Your message has been launched into the digital cosmos.
                     Response protocols are engaged and you should receive a reply
                     within 24 Earth hours.</p>

                  <div className="success-effects">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="success-particle"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 200],
                          y: [0, (Math.random() - 0.5) * 200]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation back button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="nav-back-button"
          onClick={() => onNavigate('navigation')}
        >
          ← Return to Hub
        </motion.button>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="station-status"
        >
          <div className="status-item">
            <div className="status-light active"></div>
            <span>Communication Array: Online</span>
          </div>
          <div className="status-item">
            <div className="status-light active"></div>
            <span>Quantum Encryption: Enabled</span>
          </div>
          <div className="status-item">
            <div className="status-light active"></div>
            <span>Response Time: &lt; 24h</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactStation;