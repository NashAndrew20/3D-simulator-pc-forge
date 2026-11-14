import { useCallback, useEffect, useRef, useState } from "react";
import fallbackFrameUrl from "../assets/frames/ezgif-frame-001.jpg?url";

const FRAME_COUNT = 50;
const ATLAS_COLUMNS = 5;
const SPRITE_SHEET_URL = "/images/pcforge-build-frames.jpg";

const chapters = [
  {
    label: "THE COMPLETE SYSTEM",
    title: "Power, in perfect balance.",
    description: "Begin with the whole picture: a thoughtfully assembled, high-performance machine.",
    frame: "001 — 008",
  },
  {
    label: "DESIGNED TO OPEN",
    title: "The parts reveal themselves.",
    description: "The case opens. Graphics, cooling, and power begin to separate from the build.",
    frame: "009 — 020",
  },
  {
    label: "BUILT FROM THE INSIDE",
    title: "Every component has a role.",
    description: "Trace the motherboard, processor cooler, and memory at the heart of the system.",
    frame: "021 — 035",
  },
  {
    label: "ENGINEERING, EXPOSED",
    title: "The details make the difference.",
    description: "A closer look at the fans, radiator, graphics card, power supply, and tempered glass.",
    frame: "036 — 050",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const fallbackRef = useRef<HTMLImageElement | null>(null);
  const [frameNumber, setFrameNumber] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * pixelRatio);
    const height = Math.round(bounds.height * pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.fillStyle = "#0b0c0c";
    context.fillRect(0, 0, bounds.width, bounds.height);

    const sprite = spriteRef.current;
    const hasSprite = !!sprite?.complete && sprite.naturalWidth > 0;
    const fallback = fallbackRef.current;
    const image = hasSprite ? sprite : fallback?.complete && fallback.naturalWidth > 0 ? fallback : null;
    if (!image) return;

    const sourceWidth = hasSprite ? image.naturalWidth / ATLAS_COLUMNS : image.naturalWidth;
    const sourceHeight = hasSprite ? image.naturalHeight / (FRAME_COUNT / ATLAS_COLUMNS) : image.naturalHeight;
    const column = hasSprite ? (frameNumber - 1) % ATLAS_COLUMNS : 0;
    const row = hasSprite ? Math.floor((frameNumber - 1) / ATLAS_COLUMNS) : 0;
    const scale = Math.min(bounds.width / sourceWidth, bounds.height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    context.drawImage(image, column * sourceWidth, row * sourceHeight, sourceWidth, sourceHeight,
      (bounds.width - drawWidth) / 2, (bounds.height - drawHeight) / 2, drawWidth, drawHeight);
  }, [frameNumber]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;
    const synchronizeToScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setFrameNumber(1);
          return;
        }
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        const progress = scrollableDistance > 0
          ? clamp((window.scrollY - section.offsetTop) / scrollableDistance, 0, 1)
          : 0;
        setFrameNumber(Math.round(progress * (FRAME_COUNT - 1)) + 1);
      });
    };

    synchronizeToScroll();
    window.addEventListener("scroll", synchronizeToScroll, { passive: true });
    window.addEventListener("resize", synchronizeToScroll);
    return () => {
      window.removeEventListener("scroll", synchronizeToScroll);
      window.removeEventListener("resize", synchronizeToScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setFrameNumber(1);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const sprite = new Image();
    spriteRef.current = sprite;
    sprite.onload = () => {
      if (!isMounted) return;
      setLoadedCount(FRAME_COUNT);
      setIsReady(true);
    };
    sprite.onerror = () => {
      if (!isMounted) return;
      setFailedCount(1);

      const fallback = new Image();
      fallbackRef.current = fallback;
      fallback.onload = () => {
        if (!isMounted) return;
        setLoadedCount(FRAME_COUNT);
        setIsReady(true);
      };
      fallback.onerror = () => {
        if (!isMounted) return;
        setFailedCount(FRAME_COUNT);
        setIsReady(true);
      };
      fallback.src = fallbackFrameUrl;
    };
    sprite.src = SPRITE_SHEET_URL;

    return () => {
      isMounted = false;
      sprite.onload = null;
      sprite.onerror = null;
      if (fallbackRef.current) {
        fallbackRef.current.onload = null;
        fallbackRef.current.onerror = null;
      }
    };
  }, []);

  useEffect(() => {
    renderFrame();
  }, [renderFrame, isReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(renderFrame);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [renderFrame]);

  const progress = (frameNumber - 1) / (FRAME_COUNT - 1);
  const activeChapter = frameNumber < 9 ? 0 : frameNumber < 21 ? 1 : frameNumber < 36 ? 2 : 3;
  const currentChapter = chapters[activeChapter];

  return (
    <section
      className={`sequence-section${reducedMotion ? " sequence-section--reduced-motion" : ""}`}
      ref={sectionRef}
      aria-label="Scroll-controlled PC build sequence"
      style={{ "--sequence-progress": progress } as React.CSSProperties}
    >
      <div className="sequence-stage">
        <div className="sequence-topline">
          <span className="sequence-brand"><span className="live-dot" />THE PCFORGE BUILD STUDY</span>
          <a href="#store">BEHIND THE BUILD <span>↗</span></a>
        </div>

        <div className="sequence-image">
          <canvas
            ref={canvasRef}
            className="sequence-canvas"
            role="img"
            aria-label={`PC build, frame ${String(frameNumber).padStart(3, "0")} of ${FRAME_COUNT}`}
          />
          {!isReady && (
            <div className="sequence-loading" role="status" aria-live="polite">
              <span className="loading-mark" aria-hidden="true" />
              <span>PREPARING THE EXPERIENCE</span>
              <span>{String(loadedCount).padStart(2, "0")} / {FRAME_COUNT}</span>
              <span className="loading-track"><span style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }} /></span>
            </div>
          )}
          {failedCount > 0 && (
            <div className="frame-warning" role="status">
              {failedCount === 1
                ? "Sprite sheet unavailable — showing the original opening frame."
                : "Sprite sheet and original opening frame are unavailable."}
            </div>
          )}
          <div className="image-coordinate" aria-hidden="true">FIG. 01 &nbsp; / &nbsp; OPEN SYSTEM</div>
          <div className="image-index" aria-hidden="true">PF — 0{String(activeChapter + 1)}</div>
        </div>

        <div className="sequence-copy" aria-live="polite" aria-atomic="true">
          <div className="sequence-copy-text" key={activeChapter}>
            <span className="eyebrow"><span className="live-dot" />{currentChapter.label}</span>
            <h2>{currentChapter.title}</h2>
            <p>{currentChapter.description}</p>
          </div>
          <div className="sequence-copy-side">
            <span>BUILD STUDY</span>
            <span>{currentChapter.frame}</span>
            <a href="#store" aria-label="Continue to the virtual store">Discover the experience <ArrowIcon /></a>
          </div>
        </div>

        <div className="sequence-bottomline">
          <div className="sequence-progress" role="progressbar" aria-label="Build sequence progress" aria-valuemin={1} aria-valuemax={FRAME_COUNT} aria-valuenow={frameNumber}>
            <span style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="sequence-hint">{reducedMotion ? "REDUCED MOTION" : "SCROLL TO DISASSEMBLE"}</span>
          <span className="sequence-frame">FRAME <strong>{String(frameNumber).padStart(3, "0")}</strong><i>/</i>050</span>
        </div>
      </div>
    </section>
  );
}
