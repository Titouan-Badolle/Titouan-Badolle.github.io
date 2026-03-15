import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ─────────────────────────────────────────────────────────────
   PALETTE & CONSTANTS
───────────────────────────────────────────────────────────── */
const P = {
  bg:      '#0a0a0f',
  bg2:     '#0f0f18',
  panel:   '#13131f',
  card:    '#161624',
  text:    '#e2e8f0',
  muted:   '#94a3b8',
  faint:   '#475569',
  primary: '#6366f1',
  p2:      '#818cf8',
  accent:  '#22d3ee',
  cyber:   '#f43f5e',
  green:   '#10b981',
  yellow:  '#f59e0b',
  purple:  '#a855f7',
  white:   '#ffffff',
};

const MONO = 'Fira Code, Courier New, monospace';
const SANS = 'Inter, Arial, sans-serif';

const TOTAL_FRAMES = 360;
const SCENE_CUTS   = { s1End: 175, s2Start: 160, s2End: 290, s3Start: 275 };

/* ─────────────────────────────────────────────────────────────
   LOW-LEVEL HELPERS
───────────────────────────────────────────────────────────── */

/** Ease-in opacity + translateY entrance */
const useEntrance = (delayFrames = 0, duration = 30, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delayFrames), fps, durationInFrames: duration, config: { damping } });
  return {
    opacity:   interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [44, 0])}px)`,
  };
};


/** Animated line from 0 to 100% width */
const AnimLine = ({ delay = 0, color = P.primary, height = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delay), fps, durationInFrames: 35, config: { damping: 20 } });
  return (
    <div style={{
      height, borderRadius: height,
      background: `linear-gradient(90deg, ${color}, ${color}99)`,
      width: `${interpolate(s, [0, 1], [0, 100])}%`,
      boxShadow: `0 0 10px ${color}66`,
    }} />
  );
};

/** Animated grid background */
const GridBg = ({ color = P.primary, opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 0.4) % 80;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`g${color.replace('#', '')}`} width="80" height="80"
            patternUnits="userSpaceOnUse" patternTransform={`translate(${offset},${offset})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={color} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g${color.replace('#', '')})`}/>
      </svg>
    </AbsoluteFill>
  );
};

/** Radial glow */
const Glow = ({ color = P.primary }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse 70% 50% at 80% 20%, ${color}22, transparent 60%),
                 radial-gradient(ellipse 50% 60% at 15% 80%, ${color}14, transparent 55%)`,
    pointerEvents: 'none',
  }}/>
);

/** Corner brackets */
const Corners = ({ color = P.primary, size = 100, thick = 2 }) => (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', opacity: 0.4 }}>
    {[
      { top: 50, left: 50, borderTop: `${thick}px solid ${color}`, borderLeft: `${thick}px solid ${color}`, borderRadius: '4px 0 0 0' },
      { top: 50, right: 50, borderTop: `${thick}px solid ${color}`, borderRight: `${thick}px solid ${color}`, borderRadius: '0 4px 0 0' },
      { bottom: 50, left: 50, borderBottom: `${thick}px solid ${color}`, borderLeft: `${thick}px solid ${color}`, borderRadius: '0 0 0 4px' },
      { bottom: 50, right: 50, borderBottom: `${thick}px solid ${color}`, borderRight: `${thick}px solid ${color}`, borderRadius: '0 0 4px 0' },
    ].map((s, i) => (
      <div key={i} style={{ position: 'absolute', width: size, height: size, ...s }}/>
    ))}
  </AbsoluteFill>
);

/** Chip/badge */
const Chip = ({ label, color = P.primary, style = {} }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center',
    border: `1.5px solid ${color}55`, color,
    background: `${color}18`, borderRadius: 999,
    padding: '10px 26px', fontSize: 30, fontWeight: 700,
    letterSpacing: 1, ...style,
  }}>{label}</div>
);

/** Animated bullet list item */
const Bullet = ({ text, delay, accent = P.primary, icon = '›' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delay), fps, durationInFrames: 28, config: { damping: 16 } });
  return (
    <div style={{
      display: 'flex', gap: 20, alignItems: 'flex-start',
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
    }}>
      <div style={{ color: accent, fontWeight: 900, fontSize: 42, marginTop: -4, flexShrink: 0 }}>{icon}</div>
      <div style={{ fontSize: 32, color: P.muted, lineHeight: 1.45, fontFamily: SANS }}>{text}</div>
    </div>
  );
};

/** Progress bar at bottom */
const VideoProgress = ({ totalFrames, color = P.primary }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 4,
        background: `rgba(255,255,255,0.06)`,
      }}>
        <div style={{
          height: '100%',
          width: `${(frame / totalFrames) * 100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 10px ${color}`,
          transition: 'width 0s',
        }}/>
      </div>
    </AbsoluteFill>
  );
};

/** Scene indicator (1 / 3) */
const SceneIndicator = ({ current, total, color = P.primary }) => (
  <div style={{
    position: 'absolute', bottom: 28, right: 60,
    fontFamily: MONO, fontSize: 24, color: `${color}99`,
    letterSpacing: 2,
  }}>
    {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

/** Watermark bottom-left */
const Watermark = () => (
  <div style={{
    position: 'absolute', bottom: 18, left: 60,
    fontFamily: MONO, fontSize: 24, color: `${P.primary}66`,
    letterSpacing: 1,
  }}>
    Titouan Badolle · BUT RT Cybersécurité
  </div>
);

/** Terminal block */
const Terminal = ({ lines = [], delay = 0, accent = P.green }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: Math.max(0, frame - delay), fps, durationInFrames: 30, config: { damping: 14 } });
  return (
    <div style={{
      background: '#050509',
      border: `1.5px solid ${accent}44`,
      borderRadius: 16,
      padding: '32px 36px',
      fontFamily: MONO,
      opacity: interpolate(entrance, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${accent}18`,
    }}>
      {/* Terminal header bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {['#f43f5e','#f59e0b','#10b981'].map((c, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, opacity: 0.8 }}/>
        ))}
        <div style={{ flex: 1, textAlign: 'center', fontSize: 22, color: P.faint }}>bash</div>
      </div>
      {lines.map((line, i) => {
        const lineDelay = delay + i * 12;
        const ls = spring({ frame: Math.max(0, frame - lineDelay), fps, durationInFrames: 20, config: { damping: 20 } });
        return (
          <div key={i} style={{
            display: 'flex', gap: 16, marginBottom: 12,
            opacity: interpolate(ls, [0, 1], [0, 1]),
          }}>
            {line.prompt !== false && (
              <span style={{ color: accent, fontSize: 28, fontWeight: 700, flexShrink: 0 }}>$</span>
            )}
            <span style={{
              fontSize: 28,
              color: line.output ? P.muted : P.text,
              lineHeight: 1.4,
            }}>{line.text}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Animated stat */
const AnimStat = ({ value, label, color = P.primary, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, frame - delay), fps, durationInFrames: 35, config: { damping: 14 } });
  const displayVal = Math.round(interpolate(s, [0, 1], [0, value]));
  return (
    <div style={{
      textAlign: 'center',
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 80, fontWeight: 900, color, lineHeight: 1 }}>{displayVal}</div>
      <div style={{ fontSize: 26, color: P.faint, marginTop: 8, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SCENE TRANSITION HELPERS
───────────────────────────────────────────────────────────── */
const sceneOpacity = (frame, start, end, fadeLen = 15) =>
  interpolate(frame, [start, start + fadeLen, end - fadeLen, end], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ═══════════════════════════════════════════════════════════
   1. PORTFOLIO INTRO  (360 frames / 12 s)
═══════════════════════════════════════════════════════════ */
export const PortfolioIntro = () => {
  const frame = useCurrentFrame();

  // Scene 1 (0-160): Boot / name reveal
  // Scene 2 (160-280): Projects chips
  // Scene 3 (280-360): Stats

  const s1 = sceneOpacity(frame, 0, 170);
  const s2 = sceneOpacity(frame, 155, 290);
  const s3 = sceneOpacity(frame, SCENE_CUTS.s3Start, TOTAL_FRAMES);

  const { fps } = useVideoConfig();

  const nameSpring = spring({ frame: Math.max(0, frame - 25), fps, durationInFrames: 50, config: { damping: 10 } });
  const subSpring  = spring({ frame: Math.max(0, frame - 50), fps, durationInFrames: 38 });
  const chips = [
    { label: 'SAÉ LoRaWAN',       color: P.accent   },
    { label: 'Android TCP/UDP',   color: P.green    },
    { label: 'Réseau sécurisé',   color: P.primary  },
    { label: 'Pentesting',        color: P.cyber    },
    { label: 'Fortinet / Bastion',color: P.yellow   },
  ];

  return (
    <AbsoluteFill style={{ background: P.bg, fontFamily: SANS }}>
      <GridBg color={P.primary} opacity={0.055}/>
      <Glow color={P.primary}/>
      <Corners color={P.primary}/>

      {/* ── SCENE 1 – Name reveal ── */}
      <AbsoluteFill style={{ opacity: s1, padding: '90px 100px', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Monospace greeting */}
        <div style={{
          fontFamily: MONO, fontSize: 28, color: P.p2, letterSpacing: 4,
          opacity: interpolate(nameSpring, [0,1],[0,1]),
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: P.green, boxShadow: `0 0 10px ${P.green}` }}/>
          E-Portfolio · 2024 – 2026
        </div>

        {/* Name */}
        <div style={{
          fontSize: 118, fontWeight: 900, lineHeight: 0.9,
          transform: `translateY(${interpolate(nameSpring, [0,1],[55,0])}px)`,
          opacity: interpolate(nameSpring, [0,1],[0,1]),
          background: `linear-gradient(130deg, #ffffff 30%, #818cf8 60%, ${P.accent})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Titouan Badolle
        </div>

        {/* Role */}
        <div style={{
          fontSize: 44, color: P.muted,
          transform: `translateY(${interpolate(subSpring, [0,1],[28,0])}px)`,
          opacity: interpolate(subSpring, [0,1],[0,1]),
          maxWidth: 1000,
        }}>
          BUT Réseaux &amp; Télécommunications &nbsp;·&nbsp; Parcours Cybersécurité
        </div>

        {/* Animated line */}
        <div style={{ maxWidth: 860, marginTop: 6 }}>
          <AnimLine delay={70} color={P.primary} height={3}/>
        </div>

        {/* IUT info */}
        {(() => {
          const s = spring({ frame: Math.max(0, frame - 90), fps, durationInFrames: 28, config: { damping: 18 } });
          return (
            <div style={{
              display: 'flex', gap: 30, flexWrap: 'wrap',
              opacity: interpolate(s, [0,1],[0,1]),
              transform: `translateY(${interpolate(s, [0,1],[18,0])}px)`,
            }}>
              {['🏛 IUT de Roanne', '📍 Loire (42)', '🎓 Bac STI2D – Mention Bien'].map(t => (
                <div key={t} style={{ fontFamily: MONO, fontSize: 28, color: P.faint }}>{t}</div>
              ))}
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ── SCENE 2 – SAÉ chips ── */}
      <AbsoluteFill style={{ opacity: s2, padding: '90px 100px', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 44 }}>
        <div style={{ fontFamily: MONO, fontSize: 32, color: P.p2, letterSpacing: 3 }}>// PROJETS RÉALISÉS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {chips.map(({ label, color }, i) => {
            const cs = spring({ frame: Math.max(0, frame - (155 + i * 18)), fps, durationInFrames: 30, config: { damping: 14 } });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 30,
                opacity: interpolate(cs, [0,1],[0,1]),
                transform: `translateX(${interpolate(cs, [0,1],[-50,0])}px)`,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: color, boxShadow: `0 0 12px ${color}`,
                }}/>
                <div style={{
                  background: `${color}18`, border: `1.5px solid ${color}55`,
                  borderRadius: 12, padding: '18px 36px',
                  fontSize: 38, fontWeight: 700, color,
                }}>{label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── SCENE 3 – Stats ── */}
      <AbsoluteFill style={{ opacity: s3, padding: '90px 100px', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 60 }}>
        {(() => {
          const ts = spring({ frame: Math.max(0, frame - 280), fps, durationInFrames: 28, config: { damping: 14 } });
          return (
            <div style={{ fontSize: 52, fontWeight: 800, opacity: interpolate(ts,[0,1],[0,1]), transform: `translateY(${interpolate(ts,[0,1],[24,0])}px)` }}>
              En chiffres
            </div>
          );
        })()}
        <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
          <AnimStat value={5}  label="SAÉ réalisées"      color={P.primary} delay={295}/>
          <AnimStat value={5}  label="Compétences BUT RT" color={P.accent}  delay={310}/>
          <AnimStat value={2}  label="Ans de formation"   color={P.green}   delay={325}/>
          <AnimStat value={12} label="Technologies"       color={P.yellow}  delay={340}/>
        </div>
      </AbsoluteFill>

      <VideoProgress totalFrames={TOTAL_FRAMES} color={P.p2}/>
      <Watermark/>
      <SceneIndicator current={frame < 170 ? 1 : frame < 285 ? 2 : 3} total={3} color={P.p2}/>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────────────────────
   SHOWCASE SHELL – shared outer frame for SAÉ videos
───────────────────────────────────────────────────────────── */
const ShowcaseShell = ({ color, opacity = 0.05, indicatorColor, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.bg, fontFamily: SANS }}>
      <GridBg color={color} opacity={opacity}/>
      <Glow color={color}/>
      <Corners color={color}/>
      {children}
      <VideoProgress totalFrames={TOTAL_FRAMES} color={color}/>
      <Watermark/>
      <SceneIndicator
        current={frame < SCENE_CUTS.s1End ? 1 : frame < SCENE_CUTS.s2End ? 2 : 3}
        total={3}
        color={indicatorColor ?? color}
      />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════
   2. LORAWAN SHOWCASE  (360 frames / 12 s)
═══════════════════════════════════════════════════════════ */
export const LorawanShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = sceneOpacity(frame, 0, SCENE_CUTS.s1End);
  const s2 = sceneOpacity(frame, SCENE_CUTS.s2Start, SCENE_CUTS.s2End);
  const s3 = sceneOpacity(frame, SCENE_CUTS.s3Start, TOTAL_FRAMES);

  return (
    <ShowcaseShell color={P.accent}>

      {/* ── S1 – Header ── */}
      <AbsoluteFill style={{ opacity: s1, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <Chip label="SAÉ 3.01 · Semestre 3" color={P.accent} style={{ alignSelf: 'flex-start', ...useEntrance(10, 28) }}/>
        {(() => {
          const e = useEntrance(20, 40, 10);
          return (
            <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.95, ...e,
              background: `linear-gradient(135deg, #fff 30%, ${P.accent})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Infrastructure IoT<br/>LoRaWAN
            </div>
          );
        })()}
        <div style={{ maxWidth: 800, marginTop: 4 }}><AnimLine delay={30} color={P.accent} height={3}/></div>
        {(() => {
          const e = useEntrance(40, 30);
          return (
            <div style={{ fontSize: 36, color: P.muted, maxWidth: 900, ...e }}>
              Suivi GPS temps réel en forêt · Binôme avec Abel Raquin · IUT de Roanne
            </div>
          );
        })()}

        {/* Architecture flow */}
        {(() => {
          const fs = spring({ frame: Math.max(0, frame - 55), fps, durationInFrames: 40, config: { damping: 16 } });
          const nodes = ['Capteur GPS', 'LoRaWAN', 'ChirpStack', 'Datacake'];
          const colors = [P.yellow, P.green, P.primary, P.accent];
          return (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0, marginTop: 16,
              opacity: interpolate(fs,[0,1],[0,1]),
              transform: `translateY(${interpolate(fs,[0,1],[24,0])}px)`,
            }}>
              {nodes.map((n, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    background: `${colors[i]}18`, border: `1.5px solid ${colors[i]}55`,
                    borderRadius: 12, padding: '16px 28px',
                    fontSize: 28, fontWeight: 700, color: colors[i],
                  }}>{n}</div>
                  {i < nodes.length - 1 && (
                    <div style={{ fontSize: 32, color: P.faint, padding: '0 12px' }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ── S2 – Details + image ── */}
      <AbsoluteFill style={{
        opacity: s2, padding: '80px 100px',
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 50,
        alignItems: 'stretch',
      }}>
        {/* Left: bullets + terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: P.accent, letterSpacing: 3 }}>// RÉALISATIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Bullet delay={170} accent={P.accent} text="Programmation Arduino C++ (SeeedStudio) – fix Pin 38 / Serial2"/>
            <Bullet delay={185} accent={P.accent} text="Stack ChirpStack v4 sur VPS Digital Ocean via Docker Compose"/>
            <Bullet delay={200} accent={P.accent} text="Payload decoder JS (÷ 1 000 000) → Geopoint Datacake"/>
          </div>
          <Terminal delay={215} accent={P.green} lines={[
            { text: 'docker compose up -d' },
            { text: 'Starting chirpstack ... done', output: true },
            { text: 'Starting mosquitto ... done', output: true },
            { text: '✓ Stack opérationnelle — DevEUI 8CF9572000065F6A', output: true },
          ]}/>
        </div>
        {/* Right: image */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24,
          border: `1.5px solid ${P.accent}44`, background: '#05070d',
          boxShadow: `0 24px 60px ${P.accent}28`,
          opacity: interpolate(spring({ frame: Math.max(0, frame - 180), fps, durationInFrames: 30 }), [0,1],[0,1]),
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${P.accent}14, transparent 55%)`, zIndex: 1 }}/>
          <Img src={staticFile('datacake-map.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: '20px 24px', fontFamily: MONO, fontSize: 24, color: P.accent,
          }}>Dashboard Datacake – GPS temps réel</div>
        </div>
      </AbsoluteFill>

      {/* ── S3 – Results ── */}
      <AbsoluteFill style={{ opacity: s3, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>
        {(() => { const e = useEntrance(280, 28); return <div style={{ fontSize: 52, fontWeight: 800, ...e }}>Résultats</div>; })()}
        <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
          {[
            { v: 'DR0', lbl: 'Mode Forêt', c: P.green },
            { v: '10s', lbl: 'Intervalle GPS', c: P.accent },
            { v: 'OTAA', lbl: 'Authentification', c: P.primary },
            { v: 'v4', lbl: 'ChirpStack', c: P.p2 },
          ].map(({ v, lbl, c }, i) => {
            const ss = spring({ frame: Math.max(0, frame - (295 + i * 16)), fps, durationInFrames: 28, config: { damping: 14 } });
            return (
              <div key={i} style={{
                background: `${c}14`, border: `1.5px solid ${c}44`,
                borderRadius: 16, padding: '28px 44px', textAlign: 'center',
                opacity: interpolate(ss,[0,1],[0,1]),
                transform: `scale(${interpolate(ss,[0,1],[0.85,1])})`,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 64, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 26, color: P.faint, marginTop: 8 }}>{lbl}</div>
              </div>
            );
          })}
        </div>
        {(() => {
          const e = useEntrance(330, 28);
          return (
            <div style={{ fontSize: 34, color: P.green, display: 'flex', gap: 14, alignItems: 'center', ...e }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: P.green, boxShadow: `0 0 10px ${P.green}` }}/>
              Compétences validées : CCA · CCB · AC21.04 · AC22.01 · AC23.02 · AC23.03
            </div>
          );
        })()}
      </AbsoluteFill>

    </ShowcaseShell>
  );
};

/* ═══════════════════════════════════════════════════════════
   3. ANDROID SHOWCASE  (360 frames / 12 s)
═══════════════════════════════════════════════════════════ */
export const AndroidShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = sceneOpacity(frame, 0, SCENE_CUTS.s1End);
  const s2 = sceneOpacity(frame, SCENE_CUTS.s2Start, SCENE_CUTS.s2End);
  const s3 = sceneOpacity(frame, SCENE_CUTS.s3Start, TOTAL_FRAMES);

  return (
    <ShowcaseShell color={P.green}>

      {/* ── S1 ── */}
      <AbsoluteFill style={{ opacity: s1, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <Chip label="SAÉ 3.02 · Semestre 3" color={P.green} style={{ alignSelf: 'flex-start' }}/>
        {(() => {
          const e = useEntrance(18, 42, 10);
          return (
            <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.94, ...e,
              background: `linear-gradient(135deg, #fff 30%, ${P.green})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Application Android<br/>Client / Serveur
            </div>
          );
        })()}
        <div style={{ maxWidth: 800, marginTop: 4 }}><AnimLine delay={28} color={P.green} height={3}/></div>
        {(() => {
          const e = useEntrance(38, 30);
          return <div style={{ fontSize: 36, color: P.muted, maxWidth: 1000, ...e }}>Projet individuel · Android Studio (Java) · Architecture RBAC</div>;
        })()}
        {/* Protocol badges */}
        {(() => {
          const bs = spring({ frame: Math.max(0, frame - 55), fps, durationInFrames: 36, config: { damping: 16 } });
          return (
            <div style={{
              display: 'flex', gap: 24, marginTop: 10,
              opacity: interpolate(bs,[0,1],[0,1]),
              transform: `translateY(${interpolate(bs,[0,1],[20,0])}px)`,
            }}>
              {[
                { label: 'TCP',    c: P.primary },
                { label: 'UDP',    c: P.green },
                { label: 'RBAC',   c: P.cyber },
                { label: 'Multithread', c: P.yellow },
              ].map(({ label, c }) => (
                <Chip key={label} label={label} color={c} style={{ fontSize: 26, padding: '8px 22px' }}/>
              ))}
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ── S2 ── */}
      <AbsoluteFill style={{
        opacity: s2, padding: '80px 100px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: P.green, letterSpacing: 3 }}>// ARCHITECTURE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Bullet delay={168} accent={P.green} text="LoginActivity – Authentification sécurisée, rôles Admin/Étudiant"/>
            <Bullet delay={182} accent={P.green} text="ServerActivity – Serveur hybride TCP+UDP port 8080, threads dédiés"/>
            <Bullet delay={196} accent={P.green} text="RBAC – View.GONE sur bouton Admin pour les étudiants"/>
          </div>
          <Terminal delay={212} accent={P.green} lines={[
            { text: 'ServerSocket tcpServer = new ServerSocket(8080)' },
            { text: '[SERVER] Client connecté: 192.168.1.12', output: true },
            { text: '[UDP] Etu1 → Bonjour', output: true },
            { text: '✓ Multithreading validé — 3 clients simultanés', output: true },
          ]}/>
        </div>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24,
          border: `1.5px solid ${P.green}44`, background: '#050d09',
          boxShadow: `0 24px 60px ${P.green}28`,
          opacity: interpolate(spring({ frame: Math.max(0, frame - 175), fps, durationInFrames: 30 }), [0,1],[0,1]),
        }}>
          <Img src={staticFile('Vue Admin vs Vue Étudiant.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: '18px 22px', fontFamily: MONO, fontSize: 24, color: P.green,
          }}>RBAC – Vue Admin vs Vue Étudiant</div>
        </div>
      </AbsoluteFill>

      {/* ── S3 – Problème/Solution ── */}
      <AbsoluteFill style={{ opacity: s3, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        {(() => { const e = useEntrance(280, 28); return <div style={{ fontSize: 52, fontWeight: 800, ...e }}>Problème résolu</div>; })()}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
          {(() => {
            const ps = spring({ frame: Math.max(0, frame - 292), fps, durationInFrames: 32, config: { damping: 14 } });
            return (
              <div style={{
                background: `${P.cyber}12`, border: `1.5px solid ${P.cyber}44`,
                borderRadius: 18, padding: '32px 36px',
                opacity: interpolate(ps,[0,1],[0,1]),
                transform: `translateX(${interpolate(ps,[0,1],[-30,0])}px)`,
              }}>
                <div style={{ fontSize: 26, color: P.cyber, fontWeight: 700, marginBottom: 14 }}>✗ Problème</div>
                <div style={{ fontSize: 30, color: P.muted, lineHeight: 1.5 }}>
                  NetworkOnMainThreadException — Android interdit les sockets sur le thread principal
                </div>
              </div>
            );
          })()}
          {(() => {
            const ss = spring({ frame: Math.max(0, frame - 308), fps, durationInFrames: 32, config: { damping: 14 } });
            return (
              <div style={{
                background: `${P.green}12`, border: `1.5px solid ${P.green}44`,
                borderRadius: 18, padding: '32px 36px',
                opacity: interpolate(ss,[0,1],[0,1]),
                transform: `translateX(${interpolate(ss,[0,1],[30,0])}px)`,
              }}>
                <div style={{ fontSize: 26, color: P.green, fontWeight: 700, marginBottom: 14 }}>✓ Solution</div>
                <div style={{ fontSize: 30, color: P.muted, lineHeight: 1.5 }}>
                  Opérations réseau dans des threads dédiés — new Thread() par client accepté
                </div>
              </div>
            );
          })()}
        </div>
        {(() => {
          const e = useEntrance(330, 28);
          return <div style={{ fontSize: 32, color: P.green, display: 'flex', gap: 14, alignItems: 'center', ...e }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: P.green }}/>
            Compétences validées : CCC · AC23.02 · AC23.03 · AC24.01Cyber · AC24.03Cyber
          </div>;
        })()}
      </AbsoluteFill>

    </ShowcaseShell>
  );
};

/* ═══════════════════════════════════════════════════════════
   4. CYBER.03 SHOWCASE  (360 frames / 12 s)
═══════════════════════════════════════════════════════════ */
export const Cyber03Showcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = sceneOpacity(frame, 0, SCENE_CUTS.s1End);
  const s2 = sceneOpacity(frame, SCENE_CUTS.s2Start, SCENE_CUTS.s2End);
  const s3 = sceneOpacity(frame, SCENE_CUTS.s3Start, TOTAL_FRAMES);

  return (
    <ShowcaseShell color={P.primary} opacity={0.055} indicatorColor={P.p2}>
      {/* ── S1 ── */}
      <AbsoluteFill style={{ opacity: s1, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
        <Chip label="SAÉ Cyber.03 · Semestre 3" color={P.primary} style={{ alignSelf: 'flex-start' }}/>
        {(() => {
          const e = useEntrance(18, 42, 10);
          return (
            <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 0.94, ...e,
              background: `linear-gradient(135deg, #fff 30%, ${P.p2} 60%, ${P.accent})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Infrastructure Réseau<br/>Sécurisée Multi-Services
            </div>
          );
        })()}
        <div style={{ maxWidth: 800, marginTop: 4 }}><AnimLine delay={28} color={P.primary} height={3}/></div>
        {(() => {
          const e = useEntrance(38, 30);
          return <div style={{ fontSize: 34, color: P.muted, maxWidth: 1000, ...e }}>Projet individuel (Etu7) · Domaine etu7.sae · LAN 172.32.68.0/24 – VLAN 8</div>;
        })()}
        {(() => {
          const bs = spring({ frame: Math.max(0, frame - 55), fps, durationInFrames: 36, config: { damping: 16 } });
          return (
            <div style={{
              display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 10,
              opacity: interpolate(bs,[0,1],[0,1]),
              transform: `translateY(${interpolate(bs,[0,1],[20,0])}px)`,
            }}>
              {['AD-DS', 'OSPFv2', 'RADIUS 802.1X', 'WPA2-Enterprise', 'RemoteApp', 'vCenter'].map(l => (
                <Chip key={l} label={l} color={P.p2} style={{ fontSize: 24, padding: '7px 18px' }}/>
              ))}
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ── S2 ── */}
      <AbsoluteFill style={{
        opacity: s2, padding: '80px 100px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: P.p2, letterSpacing: 3 }}>// DÉPLOIEMENTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Bullet delay={168} accent={P.p2} text="Windows Server 2019 sur vCenter · AD-DS, DNS, OU pour etu7.sae"/>
            <Bullet delay={182} accent={P.p2} text="OSPFv2 sur Cisco R0 & R1 physiques · DHCP sécurisé VLAN 8"/>
            <Bullet delay={196} accent={P.p2} text="SSID WPA2-Enterprise + Visiteur isolé 2 Mbps via Unifi / NPS"/>
          </div>
          <Terminal delay={212} accent={P.p2} lines={[
            { text: 'nslookup etu7.sae' },
            { text: 'Address: 172.32.68.10', output: true },
            { text: 'R0# show ip ospf neighbor' },
            { text: 'FULL/DR — 172.32.128.2 (R1)', output: true },
          ]}/>
        </div>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24,
          border: `1.5px solid ${P.primary}44`, background: '#060611',
          boxShadow: `0 24px 60px ${P.primary}28`,
          opacity: interpolate(spring({ frame: Math.max(0, frame - 175), fps, durationInFrames: 30 }), [0,1],[0,1]),
        }}>
          <Img src={staticFile('Utilisateurs et OU.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: '18px 22px', fontFamily: MONO, fontSize: 24, color: P.p2,
          }}>Active Directory – Utilisateurs et OU</div>
        </div>
      </AbsoluteFill>

      {/* ── S3 ── */}
      <AbsoluteFill style={{ opacity: s3, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
        {(() => { const e = useEntrance(280, 28); return <div style={{ fontSize: 52, fontWeight: 800, ...e }}>Services validés</div>; })()}
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
          {[
            { icon: '🖥', label: 'RemoteApp RDS', c: P.primary },
            { icon: '📶', label: 'WPA2-Enterprise', c: P.accent },
            { icon: '🔒', label: 'ACL Cisco', c: P.cyber },
            { icon: '📊', label: 'Grafana/Prometheus', c: P.green },
          ].map(({ icon, label, c }, i) => {
            const ss = spring({ frame: Math.max(0, frame - (292 + i * 15)), fps, durationInFrames: 28, config: { damping: 14 } });
            return (
              <div key={i} style={{
                background: `${c}14`, border: `1.5px solid ${c}44`,
                borderRadius: 16, padding: '26px 36px', textAlign: 'center',
                opacity: interpolate(ss,[0,1],[0,1]),
                transform: `scale(${interpolate(ss,[0,1],[0.85,1])})`,
              }}>
                <div style={{ fontSize: 48 }}>{icon}</div>
                <div style={{ fontSize: 28, color: c, marginTop: 10, fontWeight: 600 }}>{label}</div>
              </div>
            );
          })}
        </div>
        {(() => {
          const e = useEntrance(332, 28);
          return <div style={{ fontSize: 30, color: P.p2, display: 'flex', gap: 14, alignItems: 'center', ...e }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: P.green }}/>
            CyberA · CCA · CCB · AC21.01 · AC21.02 · AC21.04 · AC22.02 · AC24.02Cyber · AC24.03Cyber
          </div>;
        })()}
      </AbsoluteFill>

    </ShowcaseShell>
  );
};

/* ═══════════════════════════════════════════════════════════
   5. CYBER.04 SHOWCASE  (360 frames / 12 s)
═══════════════════════════════════════════════════════════ */
export const CyberShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = sceneOpacity(frame, 0, SCENE_CUTS.s1End);
  const s2 = sceneOpacity(frame, SCENE_CUTS.s2Start, SCENE_CUTS.s2End);
  const s3 = sceneOpacity(frame, SCENE_CUTS.s3Start, TOTAL_FRAMES);

  return (
    <ShowcaseShell color={P.cyber}>

      {/* ── S1 ── */}
      <AbsoluteFill style={{ opacity: s1, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
        <Chip label="SAÉ Cyber.04 · Pentesting" color={P.cyber} style={{ alignSelf: 'flex-start' }}/>
        {(() => {
          const e = useEntrance(18, 42, 10);
          return (
            <div style={{ fontSize: 90, fontWeight: 900, lineHeight: 0.93, ...e,
              background: `linear-gradient(135deg, #fff 30%, ${P.cyber})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Tests d'Intrusion<br/>Éthiques
            </div>
          );
        })()}
        <div style={{ maxWidth: 800, marginTop: 4 }}><AnimLine delay={28} color={P.cyber} height={3}/></div>
        {(() => {
          const e = useEntrance(38, 30);
          return <div style={{ fontSize: 34, color: P.muted, maxWidth: 1000, ...e }}>
            Lab isolé Host-Only · Kali Linux 192.168.195.3 · Cibles VulnHub
          </div>;
        })()}
        {(() => {
          const bs = spring({ frame: Math.max(0, frame - 55), fps, durationInFrames: 36, config: { damping: 16 } });
          return (
            <div style={{
              display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 10,
              opacity: interpolate(bs,[0,1],[0,1]),
              transform: `translateY(${interpolate(bs,[0,1],[20,0])}px)`,
            }}>
              {['Kioptrix L1', 'SickOs 1.2', 'Nmap', 'Metasploit', 'Gobuster', 'netcat'].map(l => (
                <Chip key={l} label={l} color={P.cyber} style={{ fontSize: 24, padding: '7px 18px' }}/>
              ))}
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ── S2 – Attack chain ── */}
      <AbsoluteFill style={{
        opacity: s2, padding: '80px 100px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: P.cyber, letterSpacing: 3 }}>// KILL CHAIN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Bullet delay={168} accent={P.cyber} text="Nmap -sV -sC → Samba 2.2.1a + lighttpd 1.4.28 identifiés"/>
            <Bullet delay={182} accent={P.yellow} text="Metasploit trans2open (CVE-2003-0201) → Shell root Kioptrix"/>
            <Bullet delay={196} accent={P.yellow} text="HTTP PUT reverse shell PHP port 443 → chkrootkit → SUID → root"/>
          </div>
          <Terminal delay={212} accent={P.cyber} lines={[
            { text: 'nmap -sV -p- 192.168.195.5' },
            { text: '445/tcp  open  netbios-ssn Samba 2.2.1a', output: true },
            { text: 'msf6> use exploit/linux/samba/trans2open' },
            { text: '# whoami → root ✓', output: true },
          ]}/>
        </div>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24,
          border: `1.5px solid ${P.cyber}44`, background: '#0d0509',
          boxShadow: `0 24px 60px ${P.cyber}28`,
          opacity: interpolate(spring({ frame: Math.max(0, frame - 175), fps, durationInFrames: 30 }), [0,1],[0,1]),
        }}>
          <Img src={staticFile('Nmap scan.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: '18px 22px', fontFamily: MONO, fontSize: 24, color: P.cyber,
          }}>Nmap scan – Découverte des services</div>
        </div>
      </AbsoluteFill>

      {/* ── S3 – CVE + méthodo ── */}
      <AbsoluteFill style={{ opacity: s3, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
        {(() => { const e = useEntrance(280, 28); return <div style={{ fontSize: 52, fontWeight: 800, ...e }}>Vulnérabilités exploitées</div>; })()}
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
          {[
            { v: 'CVE-2003-0201', lbl: 'Samba trans2open', c: P.cyber },
            { v: 'CVE-2017-0238', lbl: 'chkrootkit 0.49', c: P.yellow },
            { v: 'HTTP PUT', lbl: 'Reverse shell PHP', c: P.purple },
            { v: 'SUID', lbl: 'Priv. Escalation', c: P.cyber },
          ].map(({ v, lbl, c }, i) => {
            const ss = spring({ frame: Math.max(0, frame - (292 + i * 14)), fps, durationInFrames: 28, config: { damping: 14 } });
            return (
              <div key={i} style={{
                background: `${c}12`, border: `1.5px solid ${c}44`,
                borderRadius: 16, padding: '24px 32px', textAlign: 'center',
                opacity: interpolate(ss,[0,1],[0,1]),
                transform: `scale(${interpolate(ss,[0,1],[0.85,1])})`,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 26, color: P.faint, marginTop: 8 }}>{lbl}</div>
              </div>
            );
          })}
        </div>
        {(() => {
          const e = useEntrance(330, 28);
          return <div style={{ fontSize: 30, color: P.green, display: 'flex', gap: 14, alignItems: 'center', ...e }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: P.green }}/>
            CyberB · AC24.05Cyber · AC25.02Cyber · Éthique pro · Rapport de pentest complet
          </div>;
        })()}
      </AbsoluteFill>

    </ShowcaseShell>
  );
};
