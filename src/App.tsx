import { useState } from "react";
import heroFrameUrl from "./assets/frames/ezgif-frame-001.jpg?url";
import ScrollSequence from "./components/ScrollSequence";

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandMark() {
  return (
    <a className="brand" href="#home" aria-label="PCFORGE home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 19V5l8 9 8-9v14" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" />
          <path d="M8 19v-5m8 5v-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </span>
      <span>PC<span className="brand-light">FORGE</span></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <BrandMark />
      <button
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "CLOSE" : "MENU"}
        <span className="menu-toggle-icon" aria-hidden="true">{menuOpen ? "−" : "+"}</span>
      </button>
      <nav id="primary-navigation" className={`main-nav${menuOpen ? " is-open" : ""}`}>
        <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
        <a href="#store" onClick={() => setMenuOpen(false)}>Virtual store</a>
        <a href="#builder" onClick={() => setMenuOpen(false)}>PC builder</a>
        <a className="nav-cta" href="#enter" onClick={() => setMenuOpen(false)}>
          Enter PCFORGE <ArrowIcon diagonal />
        </a>
      </nav>
    </header>
  );
}

const featureCards = [
  {
    number: "01",
    eyebrow: "THE VIRTUAL STORE",
    title: "Closer to the build.",
    description: "Explore a considered world of premium hardware, where every part has a place and every choice feels intentional.",
    mark: "01 / 03",
    motif: "orbit",
  },
  {
    number: "02",
    eyebrow: "YOUR PERSONAL BUILD",
    title: "Make every part yours.",
    description: "Shape your setup around the way you play and create. Find your balance of performance, precision, and personality.",
    mark: "02 / 03",
    motif: "grid",
  },
  {
    number: "03",
    eyebrow: "COMPONENT INSPECTION",
    title: "Details, in full view.",
    description: "See how the pieces come together. From the cooling array to the graphics card, the inner workings are part of the experience.",
    mark: "03 / 03",
    motif: "detail",
  },
];

function FeatureCard({ card }: { card: (typeof featureCards)[number] }) {
  return (
    <article className={`feature-card feature-card--${card.motif}`}>
      <span className="feature-number">{card.number}</span>
      <span className="feature-card-mark">{card.mark}</span>
      <div className="feature-motif" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="feature-card-copy">
        <span className="eyebrow"><span className="live-dot" />{card.eyebrow}</span>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <a href="#enter" className="text-link">Explore the experience <ArrowIcon diagonal /></a>
      </div>
    </article>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" />A NEW PERSPECTIVE ON PERFORMANCE</p>
            <p className="hero-overline">THE FUTURE OF PC BUILDING</p>
            <h1>Build Beyond<br /><span>Limits.</span></h1>
            <p className="hero-description">
              Explore premium computer hardware, discover every component, and create your perfect PC through an entirely new shopping experience.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#experience">
                Explore PCFORGE <ArrowIcon />
              </a>
              <a className="button button--quiet" href="#experience">
                Discover the Experience <span className="play-icon" aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="hero-note-line" />
              <span>BUILT TO BE SEEN DIFFERENTLY</span>
            </div>
          </div>
          <div className="hero-product" aria-hidden="true">
            <div className="product-aura" />
            <img className="hero-frame-image" src={heroFrameUrl} alt="" fetchPriority="high" />
            <span className="hero-product-index">PCFORGE<span>®</span> &nbsp; / &nbsp; SYSTEM 001</span>
            <span className="hero-product-caption"><span className="live-dot" /> A SYSTEM IN BALANCE</span>
          </div>
          <div className="hero-vertical-label" aria-hidden="true">ENGINEERED FOR THE EXTRAORDINARY</div>
        </section>

        <section className="sequence-intro" id="experience">
          <div>
            <span className="eyebrow"><span className="live-dot" />BUILT FROM EVERY ANGLE</span>
            <h2>Every detail.<br /><span>In its place.</span></h2>
          </div>
          <p>One system. Fifty frames. Scroll to step inside the build — from the first assembled view to the engineering behind every component.</p>
          <span className="intro-scroll"><span>SCROLL TO EXPLORE</span><span className="scroll-arrow">↓</span></span>
        </section>

        <ScrollSequence />

        <section className="manifesto" aria-label="PCFORGE point of view">
          <span className="eyebrow"><span className="live-dot" />A NEW WAY TO BUILD</span>
          <p>Great hardware is more than a list of parts.<br /><span>It’s a system worth discovering.</span></p>
          <span className="manifesto-index">PCFORGE / POV. 001</span>
        </section>

        <section className="features" id="store">
          <div className="section-heading">
            <div>
              <span className="eyebrow"><span className="live-dot" />THE EXPERIENCE</span>
              <h2>From first look<br />to final <span>build.</span></h2>
            </div>
            <p>A considered space to discover, understand, and choose your next system.</p>
          </div>
          <div className="feature-grid" id="builder">
            {featureCards.map((card) => <FeatureCard card={card} key={card.number} />)}
          </div>
        </section>

        <section className="closing" id="enter">
          <div className="closing-orbit closing-orbit--one" aria-hidden="true" />
          <div className="closing-orbit closing-orbit--two" aria-hidden="true" />
          <span className="eyebrow"><span className="live-dot" />YOUR NEXT BUILD STARTS HERE</span>
          <h2>Enter a world<br />built <span>around you.</span></h2>
          <a className="button button--primary button--large" href="#store">
            Enter PCFORGE <ArrowIcon diagonal />
          </a>
          <p className="closing-note">HARDWARE, REIMAGINED.</p>
        </section>
      </main>
      <footer className="site-footer">
        <BrandMark />
        <span>BUILT BEYOND LIMITS.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <span>© 2026 PCFORGE</span>
      </footer>
    </>
  );
}

export default App;
