import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const GIRLFRIEND_NAME = "Jahnavi";

const NO_STEPS = [
  "No 😶",
  "Are you sure? 🥺",
  "Really sure?? 😳",
  "Think again… 🙈",
  "Last chance 😭",
  "Okay okay… but I’ll be sad 💔",
];

// Special quotes only after YES
const YES_QUOTES = [
  {
    button: "Hold my heart, Jaanu 💞",
    quote:
      "Jaanu… you’re the kind of love I used to pray for — soft, safe, and forever.",
  },
  {
    button: "Come closer, Chinni 🥺",
    quote:
      "Chinni, when life gets heavy, your smile is the one thing that makes it feel light again.",
  },
  {
    button: "My Ammulu, listen ❤️",
    quote:
      "Ammulu… I don’t just like you — I want a life with you. Every morning. Every night. Every ‘always’.",
  },
  {
    button: "Jaanvi, you’re my home 🏡",
    quote:
      "Jaanvi… in a world that changes so fast, you’re the one thing I never want to lose.",
  },
  {
    button: "Jahnavi, my forever 💍",
    quote:
      "Jahnavi… I want to be the reason you feel loved, chosen, respected, and protected — every single day.",
  },
  {
    button: "One last thing… 🥹",
    quote:
      "I badly want to live my whole life with you — not just as my Valentine, but as my forever. Always you.",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** Continuous falling emojis on YES */
function HeartRain({ active }) {
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const emojis = ["💖", "💘", "💝", "💗", "💓", "💕", "😍", "😘"];
    const interval = setInterval(() => {
      const id = ++idRef.current;

      const left = Math.random() * 100;
      const size = 18 + Math.random() * 26;
      const duration = 3.5 + Math.random() * 3.5;
      const drift = (Math.random() * 2 - 1) * 30;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const glow = 0.6 + Math.random() * 1.2;

      setHearts((prev) => [
        ...prev,
        { id, left, size, duration, drift, emoji, glow },
      ]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, (duration + 0.2) * 1000);
    }, 120);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="heart-rain" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}vw`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            transform: `translateX(${h.drift}px)`,
            filter: `drop-shadow(0 0 ${10 * h.glow}px rgba(255, 80, 150, 0.95))`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

/** Confetti burst on triggers */
function HeartConfettiBurst({ trigger }) {
  const [pieces, setPieces] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;

    const emojis = ["💖", "💘", "💕", "💝", "😍", "😘"];
    const count = 44;

    const newPieces = Array.from({ length: count }).map(() => {
      const id = ++idRef.current;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      const startX = 50 + (Math.random() * 2 - 1) * 8; // vw
      const startY = 55 + (Math.random() * 2 - 1) * 6; // vh

      const angle = Math.random() * Math.PI * 2;
      const power = 140 + Math.random() * 220;
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power - (120 + Math.random() * 140);

      const rot = (Math.random() * 2 - 1) * 360;
      const duration = 0.9 + Math.random() * 0.8;
      const size = 18 + Math.random() * 22;

      return { id, emoji, startX, startY, vx, vy, rot, duration, size };
    });

    setPieces(newPieces);

    const t = setTimeout(() => setPieces([]), 1800);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              position: "absolute",
              left: `${p.startX}vw`,
              top: `${p.startY}vh`,
              opacity: 0,
              scale: 0.7,
              x: 0,
              y: 0,
              rotate: 0,
              filter: "drop-shadow(0 0 10px rgba(255,80,150,0.8))",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.7, 1.15, 1.05, 0.9],
              x: [0, p.vx],
              y: [0, p.vy],
              rotate: [0, p.rot],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            style={{ fontSize: `${p.size}px`, willChange: "transform, opacity" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Small teddy pop with wave after each YES / quote click */
function TeddyPop({ trigger }) {
  if (!trigger) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={trigger}
        initial={{ opacity: 0, scale: 0.4, y: 20 }}
        animate={{
          opacity: 1,
          scale: [0.4, 1.15, 1],
          y: [20, -6, 0],
          rotate: [0, -15, 15, -10, 10, 0], // wave
        }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "absolute",
          left: "50%",
          top: "12px",
          transform: "translateX(-50%)",
          zIndex: 4,
          fontSize: "36px",
          filter: "drop-shadow(0 0 18px rgba(255,160,210,0.6))",
          pointerEvents: "none",
        }}
      >
        🧸💖
      </motion.div>
    </AnimatePresence>
  );
}

/** Big waving teddy for the final LOVE screen */
function BigTeddy() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{
        opacity: 1,
        scale: [0.7, 1.1, 1],
        y: [20, -10, 0],
        rotate: [0, -10, 10, -10, 10, 0], // slow wave
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        marginTop: 18,
        fontSize: "clamp(70px, 9vw, 120px)",
        textShadow: "0 0 32px rgba(255,120,170,0.6)",
        filter: "drop-shadow(0 0 22px rgba(255,160,210,0.45))",
      }}
    >
      🧸💕
    </motion.div>
  );
}

export default function App() {
  const [stage, setStage] = useState("ASK"); // ASK | YES
  const [noIndex, setNoIndex] = useState(0);

  const [yesBoost, setYesBoost] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noWiggle, setNoWiggle] = useState(0);

  const [burstKey, setBurstKey] = useState(0);

  // Quotes state
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBigLove, setShowBigLove] = useState(false);

  // Teddy trigger (increments to re-trigger animation)
  const [teddyKey, setTeddyKey] = useState(0);

  const maxNoIndex = NO_STEPS.length - 1;
  const noText = useMemo(
    () => NO_STEPS[clamp(noIndex, 0, maxNoIndex)],
    [noIndex, maxNoIndex]
  );
  const noDisabled = noIndex >= maxNoIndex;

  const yesScale = clamp(1 + yesBoost * 0.08, 1, 1.6);

  const startYesFlow = () => {
    setStage("YES");
    setBurstKey((k) => k + 1);
    setTeddyKey((k) => k + 1); // teddy on first YES
    setQuoteIndex(0);
    setShowBigLove(false);
  };

  const noClicked = () => {
    if (noDisabled) return;

    setNoIndex((i) => clamp(i + 1, 0, maxNoIndex));
    setYesBoost((b) => clamp(b + 1, 0, 10));

    const x = (Math.random() * 2 - 1) * 110;
    const y = (Math.random() * 2 - 1) * 70;
    setNoOffset({ x, y });
    setNoWiggle((w) => w + 1);
  };

  const resetAll = () => {
    setStage("ASK");
    setNoIndex(0);
    setYesBoost(0);
    setNoOffset({ x: 0, y: 0 });
    setNoWiggle(0);
    setQuoteIndex(0);
    setShowBigLove(false);
    setTeddyKey(0);
  };

  const nextQuote = () => {
    // teddy + confetti after every quote click
    setBurstKey((k) => k + 1);
    setTeddyKey((k) => k + 1);

    if (quoteIndex >= YES_QUOTES.length - 1) {
      setShowBigLove(true);
      return;
    }
    setQuoteIndex((i) => i + 1);
  };

  const current = YES_QUOTES[quoteIndex];

  return (
    <div className="page">
      <div className="bg-glow" />
      <HeartConfettiBurst trigger={burstKey} />
      <HeartRain active={stage === "YES"} />

      <div className="card" style={{ position: "relative" }}>
        {/* Small teddy pop on YES + each quote click */}
        {stage === "YES" && <TeddyPop trigger={teddyKey} />}

        <AnimatePresence mode="wait">
          {stage === "ASK" ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <motion.h1
                className="title"
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.95, 1.03, 1] }}
                transition={{ duration: 0.55 }}
              >
                Jahnavi, will you be my Valentine? 💘
              </motion.h1>

              <p className="subtitle">
                Hey <span className="name">{GIRLFRIEND_NAME}</span>… I made this
                just for you 🥰
              </p>

              <div className="buttons">
                <motion.button
                  className="btn yes"
                  style={{ transform: `scale(${yesScale})` }}
                  whileHover={{ scale: yesScale * 1.03 }}
                  whileTap={{ scale: yesScale * 0.98 }}
                  onClick={startYesFlow}
                >
                  Yes 💖
                </motion.button>

                <motion.button
                  className="btn no"
                  key={`no-${noWiggle}`}
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: noOffset.x, y: noOffset.y }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  whileHover={{ scale: noDisabled ? 1 : 0.98 }}
                  whileTap={{ scale: noDisabled ? 1 : 0.95 }}
                  onClick={noClicked}
                  disabled={noDisabled}
                  style={{
                    opacity: noDisabled ? 0.45 : 1,
                    cursor: noDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {noDisabled ? "No (disabled 😌)" : noText}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="yes"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="yesWrap"
            >
              <motion.div
                className="badge"
                initial={{ scale: 0.8, rotate: -8 }}
                animate={{ scale: [0.9, 1.06, 1], rotate: [0, 2, 0] }}
                transition={{ duration: 0.7 }}
              >
                💍💖
              </motion.div>

              <motion.h1
  initial={{ opacity: 0, y: 10, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: [0.95, 1.05, 1] }}
  transition={{ duration: 0.6 }}
  style={{
    marginTop: 6,
    fontSize: "clamp(28px, 4.5vw, 42px)",
    textAlign: "center",
    textShadow: "0 0 18px rgba(255,120,170,0.6)",
  }}
>
  YAYYY!! 🥹💘
</motion.h1>

              {/* Only quotes, then big LOVE message + big waving teddy */}
              <AnimatePresence mode="wait">
                {!showBigLove ? (
                  <motion.p
                    key={`q-${quoteIndex}`}
                    className="loveText"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    style={{ marginTop: 8 }}
                  >
                    “{current.quote}”
                  </motion.p>
                ) : (
                  <motion.div
                    key="big-love"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 160, damping: 12 }}
                    style={{ marginTop: 8 }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(42px, 6vw, 70px)",
                        fontWeight: 900,
                        lineHeight: 1.02,
                        letterSpacing: "-0.03em",
                        textShadow: "0 0 28px rgba(255,80,150,0.45)",
                      }}
                    >
                      I LOVE YOU
                    </div>
                    <div style={{ marginTop: 10, fontSize: "18px", opacity: 0.9 }}>
                      {GIRLFRIEND_NAME} ❤️
                    </div>

                    <BigTeddy />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="glowRow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: 16 }}
              >
                <span className="glow">💖</span>
                <span className="glow">💘</span>
                <span className="glow">💝</span>
                <span className="glow">💕</span>
                <span className="glow">😍</span>
              </motion.div>

              <div className="buttons" style={{ marginTop: 18 }}>
                {!showBigLove ? (
                  <motion.button
                    className="btn yes"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuote}
                  >
                    {current.button}
                  </motion.button>
                ) : (
                  <motion.button
                    className="btn yes"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetAll}
                  >
                    Start again, my love 💞
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}