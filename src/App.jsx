import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // Audio refs for controlling playback
  const datamapAudioRef = useRef(null);
  const finbotixAudioRef = useRef(null);
  const smartSearchAudioRef = useRef(null);

  // State to track which audio is playing
  const [playingAudio, setPlayingAudio] = useState(null);

  // Audio control functions
  const playAudio = (audioRef, name) => {
    // Pause all other audio first
    [datamapAudioRef, finbotixAudioRef, smartSearchAudioRef].forEach(ref => {
      if (ref.current && ref !== audioRef) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    audioRef.current?.play();
    setPlayingAudio(name);
  };

  const pauseAudio = (audioRef) => {
    audioRef.current?.pause();
    setPlayingAudio(null);
  };

  const stopAudio = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingAudio(null);
    }
  };

  // Expose audio controls globally so you can play them from anywhere
  useEffect(() => {
    window.playDatamapAudio = () => playAudio(datamapAudioRef, 'datamap');
    window.playFinbotixAudio = () => playAudio(finbotixAudioRef, 'finbotix');
    window.playSmartSearchAudio = () => playAudio(smartSearchAudioRef, 'smartsearch');

    return () => {
      delete window.playDatamapAudio;
      delete window.playFinbotixAudio;
      delete window.playSmartSearchAudio;
    };
  }, []);

  // Listen for audio ended events
  useEffect(() => {
    const handleEnded = () => setPlayingAudio(null);

    datamapAudioRef.current?.addEventListener('ended', handleEnded);
    finbotixAudioRef.current?.addEventListener('ended', handleEnded);
    smartSearchAudioRef.current?.addEventListener('ended', handleEnded);

    return () => {
      datamapAudioRef.current?.removeEventListener('ended', handleEnded);
      finbotixAudioRef.current?.removeEventListener('ended', handleEnded);
      smartSearchAudioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);
  useEffect(() => {
    // Hide ElevenLabs branding after widget loads
    const hideBranding = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget && widget.shadowRoot) {
        const style = document.createElement('style');
        style.textContent = `
          [class*="branding"],
          [class*="powered"],
          [class*="footer"],
          div[style*="text-align: center"],
          div:has(a[href*="elevenlabs"]) {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        `;
        widget.shadowRoot.appendChild(style);
      }

      // Also check for any iframes or shadow DOMs
      document.querySelectorAll('elevenlabs-convai, iframe').forEach(el => {
        try {
          if (el.shadowRoot) {
            const brandingElements = el.shadowRoot.querySelectorAll('[class*="branding"], [class*="powered"], a[href*="elevenlabs"]');
            brandingElements.forEach(elem => {
              elem.style.display = 'none';
              elem.style.visibility = 'hidden';
            });
          }
        } catch (e) { }
      });
    };

    // Try multiple times as widget may load asynchronously
    const timeouts = [1000, 2000, 3000].map(delay =>
      setTimeout(hideBranding, delay)
    );

    // Also observe DOM changes
    const observer = new MutationObserver(hideBranding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <div className="pulse">
        <svg className="ai-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle glow */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

          {/* Brain/Neural network design */}
          <circle cx="50" cy="50" r="38" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2" />

          {/* Neural nodes */}
          <circle cx="35" cy="35" r="4" fill="white" />
          <circle cx="65" cy="35" r="4" fill="white" />
          <circle cx="50" cy="50" r="5" fill="white" />
          <circle cx="30" cy="60" r="4" fill="white" />
          <circle cx="70" cy="60" r="4" fill="white" />
          <circle cx="50" cy="75" r="4" fill="white" />

          {/* Neural connections */}
          <line x1="35" y1="35" x2="50" y2="50" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="65" y1="35" x2="50" y2="50" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="50" y1="50" x2="30" y2="60" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="50" y1="50" x2="70" y2="60" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="50" y1="50" x2="50" y2="75" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="30" y1="60" x2="50" y2="75" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="70" y1="60" x2="50" y2="75" stroke="white" strokeWidth="1.5" opacity="0.6" />

          {/* AI Sparkle effect */}
          <path d="M50 20 L52 25 L57 27 L52 29 L50 34 L48 29 L43 27 L48 25 Z" fill="white" opacity="0.8" />
          <path d="M75 45 L76 48 L79 49 L76 50 L75 53 L74 50 L71 49 L74 48 Z" fill="white" opacity="0.7" />
          <path d="M25 48 L26 51 L29 52 L26 53 L25 56 L24 53 L21 52 L24 51 Z" fill="white" opacity="0.7" />
        </svg>
      </div>

      <h1 className="logo">NOVA</h1>
      <p className="tagline">Your Intelligent AI Voice Assistant</p>

      <div className="wave-container">
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>

      <p className="cta-text">Ask me anything!</p>

      {/* Audio Control Buttons */}
      <div className="audio-controls">
        <div className="audio-track">
          <span className="audio-label">Datamap Copilot</span>
          <div className="audio-buttons">
            <button onClick={() => playAudio(datamapAudioRef, 'datamap')} disabled={playingAudio === 'datamap'}>
              Play
            </button>
            <button onClick={() => pauseAudio(datamapAudioRef)} disabled={playingAudio !== 'datamap'}>
              Pause
            </button>
            <button onClick={() => stopAudio(datamapAudioRef)} disabled={playingAudio !== 'datamap'}>
              Stop
            </button>
          </div>
        </div>

        <div className="audio-track">
          <span className="audio-label">Finbotix</span>
          <div className="audio-buttons">
            <button onClick={() => playAudio(finbotixAudioRef, 'finbotix')} disabled={playingAudio === 'finbotix'}>
              Play
            </button>
            <button onClick={() => pauseAudio(finbotixAudioRef)} disabled={playingAudio !== 'finbotix'}>
              Pause
            </button>
            <button onClick={() => stopAudio(finbotixAudioRef)} disabled={playingAudio !== 'finbotix'}>
              Stop
            </button>
          </div>
        </div>

        <div className="audio-track">
          <span className="audio-label">Smart Search</span>
          <div className="audio-buttons">
            <button onClick={() => playAudio(smartSearchAudioRef, 'smartsearch')} disabled={playingAudio === 'smartsearch'}>
              Play
            </button>
            <button onClick={() => pauseAudio(smartSearchAudioRef)} disabled={playingAudio !== 'smartsearch'}>
              Pause
            </button>
            <button onClick={() => stopAudio(smartSearchAudioRef)} disabled={playingAudio !== 'smartsearch'}>
              Stop
            </button>
          </div>
        </div>
      </div>

      <elevenlabs-convai agent-id="agent_3101k72kq67be1s959q6kp3b4fex"></elevenlabs-convai>
      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>

      {/* Hidden audio elements - play using window.playDatamapAudio(), window.playFinbotixAudio(), window.playSmartSearchAudio() */}
      <audio ref={datamapAudioRef} src="/scripts/datamap_copilot.mp3" preload="auto" style={{ display: 'none' }} />
      <audio ref={finbotixAudioRef} src="/scripts/finbotix.mp3" preload="auto" style={{ display: 'none' }} />
      <audio ref={smartSearchAudioRef} src="/scripts/smart_search.mp3" preload="auto" style={{ display: 'none' }} />
    </div>
  )
}

export default App
