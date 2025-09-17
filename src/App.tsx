import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicLanding from './components/universe/CosmicLanding';
import UniverseNavigation from './components/universe/UniverseNavigation';
import GalaxyPortfolio from './components/universe/GalaxyPortfolio';
import NebulaAbout from './components/universe/NebulaAbout';
import ContactStation from './components/universe/ContactStation';
import CosmicCursor from './components/universe/CosmicCursor';
import './styles/universe.css';

export type UniverseSection = 'landing' | 'navigation' | 'portfolio' | 'about' | 'contact';

function App() {
  const [currentSection, setCurrentSection] = useState<UniverseSection>('landing');
  const [isLoaded, setIsLoaded] = useState(false);
  const [cosmicData, setCosmicData] = useState({
    starsExplored: 0,
    planetsVisited: 0,
    missionsCompleted: 0
  });

  // Initialize universe experience
  useEffect(() => {
    const initUniverse = () => {
      // Preload critical assets
      const criticalAssets = [
        '/textures/2k_sun.jpg',
        '/textures/2k_mars.jpg',
        '/textures/2k_jupiter.jpg',
        '/textures/star_4k.png'
      ];

      Promise.all(
        criticalAssets.map(src => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Continue even if some assets fail
            img.src = src;
          });
        })
      ).then(() => {
        setIsLoaded(true);
      });
    };

    initUniverse();
  }, []);

  // Navigate through universe
  const navigateToSection = (section: UniverseSection) => {
    console.log('Navigating to section:', section);
    setCurrentSection(section);

    // Update cosmic exploration data
    setCosmicData(prev => ({
      ...prev,
      starsExplored: prev.starsExplored + 1,
      planetsVisited: section === 'portfolio' ? prev.planetsVisited + 1 : prev.planetsVisited,
      missionsCompleted: section === 'contact' ? prev.missionsCompleted + 1 : prev.missionsCompleted
    }));
  };

  if (!isLoaded) {
    return (
      <div className="cosmic-loading">
        <div className="cosmic-loader">
          <div className="cosmic-ring"></div>
          <div className="cosmic-ring"></div>
          <div className="cosmic-ring"></div>
          <span className="loading-text">Launching Universe...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="universe-app">
      {/* Cosmic Cursor */}
      <CosmicCursor />

      {/* Background Cosmic Field */}
      <div className="cosmic-background">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        <div className="cosmic-dust"></div>
      </div>

      {/* Main Universe Content */}
      <AnimatePresence mode="wait">
        {currentSection === 'landing' && (
          <CosmicLanding
            key="landing"
            onEnterUniverse={() => navigateToSection('navigation')}
          />
        )}

        {currentSection === 'navigation' && (
          <UniverseNavigation
            key="navigation"
            onNavigate={navigateToSection}
            cosmicData={cosmicData}
          />
        )}

        {currentSection === 'portfolio' && (
          <GalaxyPortfolio
            key="portfolio"
            onNavigate={navigateToSection}
          />
        )}

        {currentSection === 'about' && (
          <NebulaAbout
            key="about"
            onNavigate={navigateToSection}
          />
        )}

        {currentSection === 'contact' && (
          <ContactStation
            key="contact"
            onNavigate={navigateToSection}
          />
        )}
      </AnimatePresence>

      {/* Cosmic HUD */}
      {currentSection !== 'landing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-hud"
        >
          <div className="hud-stats">
            <div className="stat">
              <span className="stat-value">{cosmicData.starsExplored}</span>
              <span className="stat-label">Stars Explored</span>
            </div>
            <div className="stat">
              <span className="stat-value">{cosmicData.planetsVisited}</span>
              <span className="stat-label">Planets Visited</span>
            </div>
            <div className="stat">
              <span className="stat-value">{cosmicData.missionsCompleted}</span>
              <span className="stat-label">Missions Complete</span>
            </div>
          </div>

          <button
            className="home-beacon"
            onClick={() => navigateToSection('navigation')}
            title="Return to Navigation"
          >
            <div className="beacon-pulse"></div>
            ⭐
          </button>
        </motion.div>
      )}

      {/* Universe Audio */}
      <audio
        loop
        autoPlay
        className="cosmic-ambience"
      >
        <source src="/audio/cosmic-ambience.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;