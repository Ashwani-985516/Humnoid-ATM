import React, { useState, useEffect, useRef } from 'react';
import { SimulationStage } from '../types';
import { sound } from '../utils/audio';
import { ExplainerModal } from './ExplainerModal';

interface ProcessPlayerScreenProps {
  onTriggerDispense?: () => void;
  onEmergencyAbort: () => void;
  onNavigateToTab?: (tab: any) => void;
}

const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDAvQ3al7MAkHnXRwqir5Ux40Lpowcshszj_3RTKoMTVId4dcrkykhABlPLet0boymG2nUnGA583IyDbqodhtYyrQK_u3Ar4DaKw1RDZH8rELNwUysW6-vWfhFALXc6A-HZEXAdpYIrUvkXrgF1serxp0-hB-n5xmoT6jzsX5CflZLqDTorZPf2voh3-rI2BkYExki0Rv8u9mn5A6FAXGby87VIjXjRn-TTX3EACTUUJllWGVrhFA8';

export const ProcessPlayerScreen: React.FC<ProcessPlayerScreenProps> = ({
  onEmergencyAbort,
  onNavigateToTab,
}) => {
  const [currentTimeMs, setCurrentTimeMs] = useState(300); // 0 to 2480 ms
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [binaryStream, setBinaryStream] = useState('10110001010101110010100101010101110100101010');
  const [ejectedOffset, setEjectedOffset] = useState(45);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'cortical' | 'decoder' | 'actuator'>('cortical');

  const maxTimeMs = 2480;
  const animRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Determine stage based on time
  const currentStage: SimulationStage =
    currentTimeMs < 820 ? 1 : currentTimeMs < 1640 ? 2 : 3;

  // Sound triggering when crossing phase boundaries
  const prevStageRef = useRef<SimulationStage>(currentStage);

  // Binary stream flutter
  useEffect(() => {
    const bitInterval = setInterval(() => {
      let bits = '';
      for (let i = 0; i < 44; i++) {
        bits += Math.random() > 0.5 ? '1' : '0';
      }
      setBinaryStream(bits);
    }, 150);
    return () => clearInterval(bitInterval);
  }, []);

  // Main simulation timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setCurrentTimeMs((prev) => {
        const next = prev + delta * playbackSpeed;
        if (next >= maxTimeMs) {
          setIsPlaying(false);
          sound.playDispenseChime();
          return maxTimeMs;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Stage transition audio feedback
  useEffect(() => {
    if (prevStageRef.current !== currentStage) {
      if (currentStage === 1) sound.playSpike(880);
      if (currentStage === 2) sound.playTokenChirp();
      if (currentStage === 3) sound.playDispenseChime();
      prevStageRef.current = currentStage;
    }

    if (currentStage === 3) {
      setEjectedOffset(0); // Bills eject forward
    } else {
      setEjectedOffset(45); // Retracted inside cassette
    }
  }, [currentStage]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTimeMs >= maxTimeMs) {
        setCurrentTimeMs(0);
      }
      sound.playSpike(920);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
    sound.playTokenChirp();
  };

  const handleStep = () => {
    setIsPlaying(false);
    setCurrentTimeMs((prev) => Math.min(maxTimeMs, prev + 100));
    sound.playSpike(700 + Math.random() * 200);
  };

  const jumpToPhase = (phase: SimulationStage) => {
    setIsPlaying(false);
    if (phase === 1) setCurrentTimeMs(300);
    if (phase === 2) setCurrentTimeMs(1200);
    if (phase === 3) setCurrentTimeMs(2100);
    sound.playTokenChirp();
  };

  const formatSeconds = (ms: number) => {
    return `T +${(ms / 1000).toFixed(2)}s`;
  };

  const laserPercent = Math.max(2, Math.min(98, (currentTimeMs / maxTimeMs) * 100));

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Top Coordinate & Master Action Bar */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00f3ff] animate-pulse"></span>
            <span className="text-[12px] font-bold text-[#e3fdff] tracking-wider font-space">
              TRANSACTION SIMULATION SUITE
            </span>
          </div>
          <span className="text-[10px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            {isPlaying ? 'ACTIVE PIPELINE' : 'STANDBY / READY'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#849495] pt-0.5 border-t border-[#18202b]">
          <span className="truncate">ARCH: SYNAPSE-ADC-DISPENSE v4.2</span>
          <span className="text-[#6ff6ff] font-mono">#SIM-8994-CORTEX</span>
        </div>

        {/* Master Action Trigger Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playSpike(1040);
              handleReset();
              setTimeout(() => {
                setIsPlaying(true);
              }, 100);
            }}
            className="py-2.5 px-2 bg-[#00f3ff] hover:bg-[#52ffac] text-[#030a14] font-bold text-[11px] font-space tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.4)] active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>SIMULATE</span>
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => {
                sound.playTokenChirp();
                onNavigateToTab('process');
              }}
              className="py-2.5 px-2 bg-[#141c27] hover:bg-[#18202b] text-[#52ffac] border border-[#52ffac]/60 font-bold text-[11px] font-space tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">schema</span>
              <span>HOW IT WORKS</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Visual Banner & 3D Scientific Explainer Graphic */}
      <div className="relative bg-[#060f19] border border-[#18202b] overflow-hidden">
        {/* Reticle HUD Strip */}
        <div className="px-2.5 py-1.5 bg-[#0b141e] border-b border-[#18202b] flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-[#00f3ff] font-bold font-space truncate">
            <span>FIG 14.3</span>
            <span className="text-[#3a494b]">·</span>
            <span className="text-[#849495] truncate">TRI-PHASE BCI PIPELINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#52ffac] font-bold uppercase text-[9px]">
              {currentStage === 1
                ? 'PHASE 1: BIOLOGICAL'
                : currentStage === 2
                ? 'PHASE 2: ADC / ML'
                : 'PHASE 3: DISPENSE'}
            </span>
            <button
              onClick={() => {
                sound.playTokenChirp();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-0.5 text-[#e3fdff] hover:text-[#00f3ff] text-[9px] px-1 py-0.5 bg-[#141c27] border border-[#3a494b]"
            >
              <span className="material-symbols-outlined text-[13px]">fullscreen</span>
              <span>ZOOM</span>
            </button>
          </div>
        </div>

        {/* The Graphic Canvas with Dynamic Overlays */}
        <div className="relative w-full h-52 sm:h-64 bg-[#030a14] flex items-center justify-center overflow-hidden">
          <img
            src={HERO_IMAGE_URL}
            alt="NeuroATM Tri-Phase Architecture"
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Interactive Hotspot 1: Neural Cortex */}
          <button
            onClick={() => jumpToPhase(1)}
            className="absolute top-[26%] left-[13%] transform -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center">
              {currentStage === 1 && (
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#00f3ff] opacity-40"></span>
              )}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg transition-all ${
                  currentStage === 1
                    ? 'bg-[#00f3ff] text-[#030a14] shadow-[0_0_12px_#00f3ff]'
                    : 'bg-[#060f19]/90 border border-[#00f3ff] text-[#00f3ff]'
                }`}
              >
                1
              </div>
            </div>
            <div className="mt-1 bg-[#060f19]/90 px-1 py-0.5 text-[8px] text-[#00f3ff] border border-[#00f3ff]/40 whitespace-nowrap shadow-md">
              MOTOR AXIS
            </div>
          </button>

          {/* Interactive Hotspot 2: ADC Quantizer */}
          <button
            onClick={() => jumpToPhase(2)}
            className="absolute top-[36%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center">
              {currentStage === 2 && (
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#52ffac] opacity-40"></span>
              )}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg transition-all ${
                  currentStage === 2
                    ? 'bg-[#52ffac] text-[#030a14] shadow-[0_0_12px_#52ffac]'
                    : 'bg-[#060f19]/90 border border-[#52ffac] text-[#52ffac]'
                }`}
              >
                2
              </div>
            </div>
            <div className="mt-1 bg-[#060f19]/90 px-1 py-0.5 text-[8px] text-[#52ffac] border border-[#52ffac]/40 whitespace-nowrap shadow-md">
              40kHz ADC
            </div>
          </button>

          {/* Interactive Hotspot 3: ATM Cash Dispense */}
          <button
            onClick={() => jumpToPhase(3)}
            className="absolute top-[28%] left-[82%] transform -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center">
              {currentStage === 3 && (
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#00f3ff] opacity-40"></span>
              )}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg transition-all ${
                  currentStage === 3
                    ? 'bg-[#00f3ff] text-[#030a14] shadow-[0_0_12px_#00f3ff]'
                    : 'bg-[#060f19]/90 border border-[#00f3ff] text-[#00f3ff]'
                }`}
              >
                3
              </div>
            </div>
            <div className="mt-1 bg-[#060f19]/90 px-1 py-0.5 text-[8px] text-[#00f3ff] border border-[#00f3ff]/40 whitespace-nowrap shadow-md">
              DISPENSE
            </div>
          </button>

          {/* Realtime Scanning Laser Vertical Bar */}
          <div
            className="pointer-events-none absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-[#00f3ff] to-transparent opacity-80 shadow-[0_0_15px_#00f3ff] z-10 transition-all duration-75"
            style={{ left: `${laserPercent}%` }}
          ></div>

          {/* Bottom Banner Telemetry Tag */}
          <div className="absolute bottom-2 left-2 right-2 bg-[#060f19]/90 backdrop-blur-sm px-2 py-1 flex items-center justify-between text-[9px] border border-[#18202b]">
            <div className="flex items-center gap-1 text-[#6ff6ff]">
              <span className="material-symbols-outlined text-[13px] animate-spin">cyclone</span>
              <span>TELEMETRY V3</span>
            </div>
            <span className="text-[#dae3f2] font-mono">TARGET: $500.00 (5x$100)</span>
          </div>
        </div>

        {/* Timeline Scrubber & Player Controls Bar */}
        <div className="p-3 bg-[#0b141e] border-t border-[#18202b] flex flex-col gap-2.5">
          {/* Milestone Labels */}
          <div className="flex items-center justify-between text-[8px] text-[#849495] font-mono">
            <span>0.0s [REST]</span>
            <span>0.8s [INTENT]</span>
            <span>1.6s [PIN]</span>
            <span>2.5s [CASH]</span>
          </div>

          {/* Interactive Range Slider */}
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="2480"
              step="10"
              value={currentTimeMs}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentTimeMs(Number(e.target.value));
              }}
              className="w-full h-2 bg-[#18202b] accent-[#00f3ff] cursor-pointer rounded-none focus:outline-none"
            />
            {/* Stage demarcation ticks */}
            <div className="absolute top-0 left-[33%] w-0.5 h-2 bg-[#52ffac]/60 pointer-events-none"></div>
            <div className="absolute top-0 left-[66%] w-0.5 h-2 bg-[#00f3ff]/60 pointer-events-none"></div>
          </div>

          {/* Control Buttons & Speed */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlay}
                className="px-2.5 py-1.5 bg-[#00f3ff] text-[#030a14] font-bold text-[10px] font-space flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-2 py-1.5 bg-[#141c27] hover:bg-[#18202b] text-[#b9cacb] text-[10px] flex items-center gap-0.5 border border-[#3a494b]"
                title="Reset simulation"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>RESET</span>
              </button>

              <button
                onClick={handleStep}
                className="px-2 py-1.5 bg-[#141c27] hover:bg-[#18202b] text-[#b9cacb] text-[10px] flex items-center gap-0.5 border border-[#3a494b]"
                title="Advance 100ms"
              >
                <span className="material-symbols-outlined text-[14px]">skip_next</span>
                <span>+100ms</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[11px] font-bold text-[#00f3ff] font-mono">
                {formatSeconds(currentTimeMs)}
              </div>
              <div className="flex items-center bg-[#141c27] border border-[#3a494b] text-[9px]">
                <button
                  onClick={() => setPlaybackSpeed(0.5)}
                  className={`px-1.5 py-0.5 ${playbackSpeed === 0.5 ? 'bg-[#00f3ff] text-[#030a14] font-bold' : 'text-[#849495]'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(1.0)}
                  className={`px-1.5 py-0.5 ${playbackSpeed === 1.0 ? 'bg-[#00f3ff] text-[#030a14] font-bold' : 'text-[#849495]'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(2.0)}
                  className={`px-1.5 py-0.5 ${playbackSpeed === 2.0 ? 'bg-[#00f3ff] text-[#030a14] font-bold' : 'text-[#849495]'}`}
                >
                  2x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Phase Interactive Cards (Sequential Mobile Cards) */}
      <div className="flex flex-col gap-2.5">
        {/* PHASE 1: Biological Neural Firing */}
        <div
          onClick={() => jumpToPhase(1)}
          className={`p-3 bg-[#0b141e] border-2 transition-all cursor-pointer ${
            currentStage === 1
              ? 'border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]'
              : 'border-[#18202b] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-space text-[#00f3ff] tracking-wider">
              PHASE 01 // CORTEX
            </span>
            <span
              className={`text-[9px] flex items-center gap-1 font-bold ${
                currentStage === 1 ? 'text-[#52ffac]' : 'text-[#849495]'
              }`}
            >
              {currentStage === 1 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52ffac] animate-ping"></span>
                  ACTIVE EMISSION
                </>
              ) : (
                'STANDBY'
              )}
            </span>
          </div>

          <h3 className="text-[13px] font-bold text-[#e3fdff] font-space mt-1">
            Neural Intent Formation
          </h3>
          <p className="text-[10px] text-[#849495] mt-0.5 leading-relaxed">
            Prefrontal & motor cortex cellular firing. Synaptic action potential generates mental intent:
            selecting <strong className="text-[#00f3ff]">'Savings Account'</strong> and synthesizing 4-digit PIN mental token.
          </p>

          {/* Realtime Action Potential Waveform SVG Canvas */}
          <div className="mt-2 p-2 bg-[#060f19] border border-[#18202b]">
            <div className="flex items-center justify-between text-[9px] text-[#849495]">
              <span>ELECTRODE Ch-44 [μV]</span>
              <span className="text-[#6ff6ff] font-bold font-mono">
                {currentStage === 1 ? '+74.6 μV (240Hz)' : '+12.1 μV (14Hz)'}
              </span>
            </div>
            <div className="w-full h-12 relative overflow-hidden bg-[#030a14] mt-1 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 300 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#00f3ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#52ffac" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="25" x2="300" y2="25" stroke="#18202b" strokeDasharray="3 3" />
                <path
                  d={
                    currentStage === 1
                      ? 'M 0 25 Q 25 25 35 24 T 60 25 T 80 27 T 95 6 T 105 44 T 115 24 T 130 25 T 180 25 T 205 5 T 215 46 T 225 25 T 300 25'
                      : 'M 0 25 Q 30 24 60 25 T 120 26 T 180 24 T 240 25 T 300 25'
                  }
                  fill="none"
                  stroke="url(#waveGradMobile)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[8px] text-[#849495] pt-1">
              <span>INTENT: <strong className="text-[#00f3ff]">SAVINGS #****9124</strong></span>
              <span>SNR: <strong className="text-[#52ffac]">24.8 dB</strong></span>
            </div>
          </div>
        </div>

        {/* PHASE 2: ADC Conversion & AI Decoding */}
        <div
          onClick={() => jumpToPhase(2)}
          className={`p-3 bg-[#0b141e] border-2 transition-all cursor-pointer ${
            currentStage === 2
              ? 'border-[#52ffac] shadow-[0_0_15px_rgba(82,255,172,0.2)]'
              : 'border-[#18202b] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-space text-[#52ffac] tracking-wider">
              PHASE 02 // QUANTIZATION
            </span>
            <span
              className={`text-[9px] flex items-center gap-1 font-bold ${
                currentStage === 2 ? 'text-[#52ffac]' : 'text-[#849495]'
              }`}
            >
              {currentStage === 2 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52ffac] animate-pulse"></span>
                  DECODING PIN: 8492
                </>
              ) : (
                'STANDBY'
              )}
            </span>
          </div>

          <h3 className="text-[13px] font-bold text-[#e3fdff] font-space mt-1">
            40 kHz ADC & ML Classifier
          </h3>
          <p className="text-[10px] text-[#849495] mt-0.5 leading-relaxed">
            Analog brainwaves quantized into glowing binary bitstreams. Deep Transformer model extracts
            neuro-spatiotemporal tokens to classify intent and verify user PIN <strong className="text-[#52ffac]">'8492'</strong>.
          </p>

          {/* Dynamic Bitstream Box */}
          <div className="mt-2 p-2 bg-[#060f19] border border-[#18202b]">
            <div className="flex items-center justify-between text-[9px] text-[#849495]">
              <span>BITSTREAM QUANTIZER [40.0 kS/s]</span>
              <span className="text-[#52ffac] font-bold">CONF: 99.8%</span>
            </div>
            <div className="bg-[#030a14] p-1.5 text-[10px] font-mono text-[#52ffac] tracking-widest overflow-hidden whitespace-nowrap mt-1 border border-[#18202b]">
              {binaryStream}
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[9px]">
              <div className="p-1 bg-[#141c27] flex items-center justify-between border border-[#18202b]">
                <span className="text-[#849495]">DECODED PIN:</span>
                <span className="text-[#00f3ff] font-bold font-mono">8492</span>
              </div>
              <div className="p-1 bg-[#141c27] flex items-center justify-between border border-[#18202b]">
                <span className="text-[#849495]">ACCOUNT:</span>
                <span className="text-[#52ffac] font-bold font-mono">SAVINGS</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 3: Touchless Dispense Execution */}
        <div
          onClick={() => jumpToPhase(3)}
          className={`p-3 bg-[#0b141e] border-2 transition-all cursor-pointer ${
            currentStage === 3
              ? 'border-[#00f3ff] shadow-[0_0_18px_rgba(0,243,255,0.25)]'
              : 'border-[#18202b] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-space text-[#00f3ff] tracking-wider">
              PHASE 03 // DISPENSE
            </span>
            <span
              className={`text-[9px] flex items-center gap-1 font-bold ${
                currentStage === 3 ? 'text-[#00f3ff]' : 'text-[#849495]'
              }`}
            >
              {currentStage === 3 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-ping"></span>
                  DISPENSING CASH
                </>
              ) : (
                'STANDBY'
              )}
            </span>
          </div>

          <h3 className="text-[13px] font-bold text-[#e3fdff] font-space mt-1">
            Dispense & Memory Purge
          </h3>
          <p className="text-[10px] text-[#849495] mt-0.5 leading-relaxed">
            Decoded motor intent commands secure ATM cassette feeder. Cash slides into ejection tray
            without physical touch, followed by immediate volatile memory purge.
          </p>

          {/* Cash Dispenser Graphic */}
          <div className="mt-2 p-2 bg-[#060f19] border border-[#18202b]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-[#849495]">FEEDER CASSETTE BAY 02</span>
              <span className="text-[#00f3ff] font-bold">
                {currentStage === 3 ? 'EJECTED / PURGED' : 'READY TO EJECT'}
              </span>
            </div>

            <div className="relative w-full h-14 bg-[#030a14] border border-[#18202b] mt-1.5 flex items-center justify-between px-3 overflow-hidden">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#52ffac] font-space">$500.00</span>
                <span className="text-[8px] text-[#849495]">5x $100.00 NOTES</span>
              </div>

              {/* Bill Ejection Animation */}
              <div className="relative w-24 h-9 bg-[#18202b] border border-[#3a494b] flex items-center justify-center overflow-hidden">
                <div
                  className="w-20 h-6 bg-[#00e290] text-[#003920] font-bold text-[11px] font-space flex items-center justify-center tracking-wider shadow-md transition-transform duration-500"
                  style={{ transform: `translateX(${ejectedOffset}px)` }}
                >
                  $500
                </div>
                <div className="absolute inset-y-0 right-0 w-1.5 bg-[#00f3ff]"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[8px] text-[#849495] pt-1">
              <span>SHUTTER: <strong className="text-[#e3fdff]">140ms PULSE</strong></span>
              <span className="text-[#52ffac] font-bold">ZERO-TRACE WIPED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Panel Telemetry Tabs (Cortical Array / Transformer / Actuator) */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-[#18202b] pb-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTelemetryTab('cortical')}
              className={`px-2 py-1 text-[10px] font-bold font-space border transition-all ${
                activeTelemetryTab === 'cortical'
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              CORTICAL
            </button>
            <button
              onClick={() => setActiveTelemetryTab('decoder')}
              className={`px-2 py-1 text-[10px] font-bold font-space border transition-all ${
                activeTelemetryTab === 'decoder'
                  ? 'bg-[#52ffac]/20 border-[#52ffac] text-[#52ffac]'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              DECODER
            </button>
            <button
              onClick={() => setActiveTelemetryTab('actuator')}
              className={`px-2 py-1 text-[10px] font-bold font-space border transition-all ${
                activeTelemetryTab === 'actuator'
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              ACTUATOR
            </button>
          </div>
          <span className="text-[9px] text-[#52ffac] font-mono">96/96 CHANNELS</span>
        </div>

        {/* Tab 1: Cortical Array */}
        {activeTelemetryTab === 'cortical' && (
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-1.5 text-[9px]">
              <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
                <div className="text-[#849495]">Ch-04 [MOTOR_CORTEX]</div>
                <div className="text-[#00f3ff] font-bold font-mono">2.1 kΩ | 74.2 μV</div>
                <span className="text-[#52ffac] text-[8px] font-bold">LOCKED</span>
              </div>
              <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
                <div className="text-[#849495]">Ch-12 [PREFRONTAL]</div>
                <div className="text-[#00f3ff] font-bold font-mono">1.8 kΩ | 68.9 μV</div>
                <span className="text-[#52ffac] text-[8px] font-bold">LOCKED</span>
              </div>
              <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
                <div className="text-[#849495]">Ch-64 [NUMERIC_SYN]</div>
                <div className="text-[#00f3ff] font-bold font-mono">2.4 kΩ | 81.0 μV</div>
                <span className="text-[#52ffac] text-[8px] font-bold">SYNC</span>
              </div>
              <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
                <div className="text-[#849495]">Ch-105 [VERIFY_COMMIT]</div>
                <div className="text-[#00f3ff] font-bold font-mono">2.0 kΩ | 72.4 μV</div>
                <span className="text-[#52ffac] text-[8px] font-bold">LOCKED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9px]">
              <div className="p-1 bg-[#141c27] border border-[#18202b] flex items-center justify-between">
                <span className="text-[#849495]">AVG IMPEDANCE:</span>
                <span className="text-[#00f3ff] font-bold font-mono">2.08 kΩ</span>
              </div>
              <div className="p-1 bg-[#141c27] border border-[#18202b] flex items-center justify-between">
                <span className="text-[#849495]">SAMPLING:</span>
                <span className="text-[#52ffac] font-bold font-mono">40,000 Hz</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transformer Decoder */}
        {activeTelemetryTab === 'decoder' && (
          <div className="flex flex-col gap-1.5">
            <div className="bg-[#030a14] border border-[#18202b] p-2 text-[10px] font-mono flex flex-col gap-1">
              <div className="text-[#00f3ff]">[T+0.04s] Intent vector initialized: motor_axis_engaged</div>
              <div className="text-[#b9cacb]">[T+0.42s] Spatial cluster candidate: TOKEN_SAVINGS_ACC</div>
              <div className="text-[#52ffac]">[T+0.88s] Numeric digit extracted: '8' (p=0.9991)</div>
              <div className="text-[#52ffac]">[T+1.12s] Numeric digit extracted: '4' (p=0.9984)</div>
              <div className="text-[#52ffac]">[T+1.35s] Numeric digit extracted: '9' (p=0.9979)</div>
              <div className="text-[#52ffac]">[T+1.58s] Numeric digit extracted: '2' (p=0.9994)</div>
              <div className="text-[#00f3ff] font-bold">[T+1.64s] Final PIN authentication lock: 8492 VERIFIED</div>
            </div>
            <div className="p-1.5 bg-[#0b141e] border border-[#18202b] text-[9px] flex items-center justify-between">
              <span className="text-[#849495]">PAYLOAD SIGNATURE:</span>
              <span className="text-[#6ff6ff] font-mono truncate max-w-[170px]">
                0x7F41B920A4E90CD911...FE84
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Actuator Status */}
        {activeTelemetryTab === 'actuator' && (
          <div className="flex flex-col gap-1.5 text-[10px]">
            <div className="p-1.5 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
              <span className="text-[#849495]">MECHANICAL SHUTTER:</span>
              <span className="text-[#00f3ff] font-bold">
                {currentStage === 3 ? 'OPEN [140ms PULSE]' : 'CLOSED / LOCKED'}
              </span>
            </div>
            <div className="p-1.5 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
              <span className="text-[#849495]">CASSETTE DENOMINATION:</span>
              <span className="text-[#dae3f2]">100 USD (5 NOTES)</span>
            </div>
            <div className="p-1.5 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
              <span className="text-[#849495]">OPTICAL BILL SENSOR:</span>
              <span className="text-[#52ffac]">CALIBRATED (0 ERR)</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  sound.playAbort();
                  onEmergencyAbort();
                }}
                className="py-1.5 px-2 bg-[#ff3366]/20 text-[#ffb4ab] border border-[#ff3366] text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">dangerous</span>
                <span>ABORT</span>
              </button>
              <button
                onClick={() => {
                  sound.playShutterClick();
                  jumpToPhase(3);
                }}
                className="py-1.5 px-2 bg-[#52ffac]/20 text-[#52ffac] border border-[#52ffac] text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">eject</span>
                <span>CYCLE SHUTTER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deep-Zoom Explainer Modal */}
      <ExplainerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={HERO_IMAGE_URL}
        onSelectPhase={(phase) => jumpToPhase(phase)}
      />
    </div>
  );
};
