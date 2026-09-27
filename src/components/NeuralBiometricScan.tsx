import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

interface NeuralBiometricScanProps {
  isOpen: boolean;
  amount: number;
  accountMasked: string;
  onAuthSuccess: () => void;
  onCancel: () => void;
}

export const NeuralBiometricScan: React.FC<NeuralBiometricScanProps> = ({
  isOpen,
  amount,
  accountMasked,
  onAuthSuccess,
  onCancel,
}) => {
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeMode, setActiveMode] = useState<'fusion' | 'retina' | 'brainwave'>('fusion');
  const [scanAngle, setScanAngle] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pupilSize, setPupilSize] = useState<number>(36);
  const [reticleCoords, setReticleCoords] = useState<{ x: number; y: number }>({ x: 144, y: 110 });

  const progressRef = useRef<number>(0);

  // Scan progress and animation loop
  useEffect(() => {
    if (!isOpen) {
      setScanProgress(0);
      progressRef.current = 0;
      setIsLocked(false);
      return;
    }

    sound.playTokenChirp();
    progressRef.current = 0;
    setScanProgress(0);
    setIsLocked(false);

    // Rotation and coordinates jitter loop
    const jitterInterval = setInterval(() => {
      setScanAngle((prev) => (prev + 3) % 360);
      setReticleCoords({
        x: Math.round(140 + (Math.random() - 0.5) * 8),
        y: Math.round(105 + (Math.random() - 0.5) * 6),
      });
      setPupilSize((prev) => 32 + Math.sin(Date.now() * 0.004) * 5);
    }, 40);

    // Audio sweep every 500ms
    const soundInterval = setInterval(() => {
      if (progressRef.current < 90) {
        sound.playBiometricLaser();
      }
    }, 600);

    // Progressive step sequence
    const stepInterval = setInterval(() => {
      progressRef.current += 3;
      setScanProgress(Math.min(100, progressRef.current));

      if (progressRef.current >= 100) {
        clearInterval(stepInterval);
        clearInterval(soundInterval);
        setIsLocked(true);
        sound.playBiometricLockGranted();

        // Automatically complete authentication and execute transaction
        setTimeout(() => {
          onAuthSuccess();
        }, 800);
      }
    }, 80);

    return () => {
      clearInterval(jitterInterval);
      clearInterval(soundInterval);
      clearInterval(stepInterval);
    };
  }, [isOpen, onAuthSuccess]);

  if (!isOpen) return null;

  // Determine current verification phase message
  const getPhaseStatus = (pct: number) => {
    if (pct < 25) {
      return {
        stage: 'GATE 01/03',
        label: 'ALIGNING RETINAL OPTICS & CRANIAL AXIS',
        color: '#00f3ff',
      };
    } else if (pct < 65) {
      return {
        stage: 'GATE 02/03',
        label: 'ACQUIRING 850nm NIR RETINAL VASCULAR PRINT',
        color: '#6ff6ff',
      };
    } else if (pct < 98) {
      return {
        stage: 'GATE 03/03',
        label: 'CORTICAL P300 BRAIN-WAVE COHERENCE PHASE-LOCK',
        color: '#52ffac',
      };
    } else {
      return {
        stage: 'GATE VERIFIED',
        label: 'BIOMETRIC LOCK CONFIRMED // ACCESS GRANTED',
        color: '#00ffa3',
      };
    }
  };

  const status = getPhaseStatus(scanProgress);

  const handleFastAuthorize = () => {
    setScanProgress(100);
    setIsLocked(true);
    sound.playBiometricLockGranted();
    setTimeout(() => {
      onAuthSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030a14]/95 backdrop-blur-md flex flex-col justify-between p-3 select-none animate-fade-in border-2 border-[#00f3ff]/40 shadow-2xl">
      {/* Top Biometric Header & Authorization Specs */}
      <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00f3ff] animate-ping"></span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              NEURAL BIOMETRIC GATE
            </span>
          </div>
          <span className="text-[9px] text-[#ffb703] font-bold border border-[#ffb703]/30 px-1.5 py-0.5 bg-[#ffb703]/10">
            LEVEL 5 TITANIUM CLEARANCE
          </span>
        </div>

        <div className="flex items-center justify-between text-[9px] text-[#849495] pt-0.5 border-t border-[#18202b]">
          <span>
            TARGET: <strong className="text-[#52ffac]">${amount}.00</strong> FROM{' '}
            <strong className="text-[#00f3ff]">{accountMasked}</strong>
          </span>
          <span className="text-[#6ff6ff] font-mono">BCI-ID: #USR-8492</span>
        </div>
      </div>

      {/* Mode Selector Tabs (Fusion vs Retina vs Brainwave) */}
      <div className="grid grid-cols-3 gap-1 bg-[#060f19] p-1 border border-[#18202b]">
        <button
          onClick={() => {
            sound.playTokenChirp();
            setActiveMode('fusion');
          }}
          className={`py-1 text-[9px] font-bold font-space border transition-all ${
            activeMode === 'fusion'
              ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
              : 'bg-[#141c27] border-[#18202b] text-[#849495]'
          }`}
        >
          DUAL FUSION
        </button>
        <button
          onClick={() => {
            sound.playTokenChirp();
            setActiveMode('retina');
          }}
          className={`py-1 text-[9px] font-bold font-space border transition-all ${
            activeMode === 'retina'
              ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
              : 'bg-[#141c27] border-[#18202b] text-[#849495]'
          }`}
        >
          RETINAL NIR
        </button>
        <button
          onClick={() => {
            sound.playTokenChirp();
            setActiveMode('brainwave');
          }}
          className={`py-1 text-[9px] font-bold font-space border transition-all ${
            activeMode === 'brainwave'
              ? 'bg-[#52ffac]/20 border-[#52ffac] text-[#52ffac]'
              : 'bg-[#141c27] border-[#18202b] text-[#849495]'
          }`}
        >
          CORTICAL P300
        </button>
      </div>

      {/* Central Holographic Retina & Brainwave Scanner Reticle */}
      <div className="relative flex-1 bg-[#030a14] border border-[#18202b] my-1 flex flex-col items-center justify-center overflow-hidden p-2">
        {/* Subtle Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none"></div>

        {/* Dynamic Sweeping Vertical Laser Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_15px_#00f3ff] animate-pulse pointer-events-none z-20"></div>

        {/* Reticle Graphics */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Outer Rotating Degree Dial Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#00f3ff]/30 transition-transform duration-75"
            style={{ transform: `rotate(${scanAngle}deg)` }}
          ></div>

          {/* Secondary Counter-Rotating Ring */}
          <div
            className="absolute inset-3 rounded-full border border-[#52ffac]/40 transition-transform duration-75"
            style={{ transform: `rotate(-${scanAngle * 1.5}deg)` }}
          ></div>

          {/* Crosshair Horizontal & Vertical Lines */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#00f3ff]/30 pointer-events-none"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#00f3ff]/30 pointer-events-none"></div>

          {/* Target Reticle Brackets */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]"></div>

          {/* Center Dynamic Visual: Retina vs Brainwave */}
          {activeMode !== 'brainwave' ? (
            /* RETINA VISUAL */
            <div className="relative flex items-center justify-center">
              {/* Sclera & Iris Outer Ring */}
              <div className="w-36 h-36 rounded-full border-2 border-[#00f3ff]/60 bg-[#060f19]/80 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                {/* Iris Fiber Radial Lines (SVG) */}
                <svg className="w-full h-full absolute inset-0 p-2" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#00f3ff" strokeWidth="0.8" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="#52ffac" strokeWidth="0.8" />
                  {/* Capillary Blood Vessel Branches */}
                  <path d="M 50 50 Q 62 40 78 35 M 50 50 Q 38 60 22 68 M 50 50 Q 58 64 74 72 M 50 50 Q 36 38 24 28" fill="none" stroke="#ff3366" strokeWidth="0.9" opacity="0.6" />
                  <path d="M 50 50 Q 52 30 55 12 M 50 50 Q 48 70 45 88" fill="none" stroke="#00f3ff" strokeWidth="0.6" opacity="0.7" />
                </svg>

                {/* Pupil Center with Dynamic Dilation */}
                <div
                  className="rounded-full bg-[#030a14] border-2 border-[#00f3ff] flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_#00f3ff]"
                  style={{ width: `${pupilSize}px`, height: `${pupilSize}px` }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#52ffac] animate-ping"></span>
                </div>
              </div>
            </div>
          ) : (
            /* BRAINWAVE VISUAL */
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full border-2 border-[#52ffac]/60 bg-[#060f19]/80 flex flex-col items-center justify-center p-3 shadow-[0_0_20px_rgba(82,255,172,0.25)]">
                <span className="material-symbols-outlined text-[#00f3ff] text-[32px] animate-pulse">
                  psychology
                </span>
                <span className="text-[8px] font-mono text-[#52ffac] font-bold mt-1">
                  P300 COHERENCE
                </span>
                {/* Wave sparkline */}
                <div className="w-full h-8 mt-1">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d="M 0 15 Q 15 15 25 14 T 40 15 T 50 2 T 60 28 T 75 15 T 100 15"
                      fill="none"
                      stroke="#52ffac"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Active Locking Status Badge */}
          {isLocked && (
            <div className="absolute inset-0 bg-[#00ffa3]/20 rounded-full flex items-center justify-center border-2 border-[#00ffa3] shadow-[0_0_25px_#00ffa3] animate-pulse">
              <span className="text-[12px] font-bold font-space text-[#003920] bg-[#00ffa3] px-2 py-0.5 tracking-wider">
                LOCKED ✓
              </span>
            </div>
          )}
        </div>

        {/* Real-time Tracking HUD Coordinates */}
        <div className="w-full flex items-center justify-between text-[8px] font-mono text-[#849495] mt-1 pt-1 border-t border-[#18202b]">
          <div>
            RETICLE: <span className="text-[#00f3ff]">X:{reticleCoords.x} Y:{reticleCoords.y}</span>
          </div>
          <div>
            ROTATION: <span className="text-[#52ffac]">{scanAngle}°</span>
          </div>
          <div>
            LIVENESS: <span className="text-[#52ffac] font-bold">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Biometric Verification Metrics Breakdown */}
      <div className="grid grid-cols-2 gap-1.5 my-1 text-[9px] font-mono">
        <div className="p-2 bg-[#060f19] border border-[#18202b] flex flex-col">
          <span className="text-[#849495] text-[7px] uppercase">RETINAL VASCULAR HASH</span>
          <span className="text-[#00f3ff] font-bold truncate">0x9E21A4BC8F...8A01</span>
          <span className="text-[#52ffac] text-[8px] font-bold mt-0.5">
            {scanProgress >= 65 ? '● MATCHED (99.94%)' : '● SCANNING NIR...'}
          </span>
        </div>

        <div className="p-2 bg-[#060f19] border border-[#18202b] flex flex-col">
          <span className="text-[#849495] text-[7px] uppercase">CORTICAL P300 SYNC</span>
          <span className="text-[#52ffac] font-bold">+18.4 μV @ 310ms</span>
          <span className="text-[#00f3ff] text-[8px] font-bold mt-0.5">
            {scanProgress >= 90 ? '● PHASE-LOCKED (100%)' : '● ACQUIRING...'}
          </span>
        </div>
      </div>

      {/* Scan Progress Bar & Phase Placard */}
      <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold font-space" style={{ color: status.color }}>
            {status.stage}
          </span>
          <span className="text-[#e3fdff] font-mono font-bold">{scanProgress}%</span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 bg-[#18202b] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00f3ff] via-[#52ffac] to-[#00ffa3] transition-all duration-100 shadow-[0_0_10px_#00f3ff]"
            style={{ width: `${scanProgress}%` }}
          ></div>
        </div>

        <div className="text-[9px] text-[#dae3f2] font-mono truncate">
          {status.label}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => {
            sound.playAbort();
            onCancel();
          }}
          className="py-2.5 px-3 bg-[#141c27] hover:bg-[#18202b] border border-[#ff3366]/60 text-[#ffb4ab] font-bold text-[10px] font-space flex items-center justify-center gap-1 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[15px] text-[#ff3366]">close</span>
          <span>CANCEL / ABORT</span>
        </button>

        <button
          onClick={handleFastAuthorize}
          disabled={isLocked}
          className="py-2.5 px-3 bg-[#00f3ff] hover:bg-[#52ffac] text-[#030a14] border border-[#00f3ff] font-bold text-[10px] font-space flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(0,243,255,0.4)] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">fingerprint</span>
          <span>{isLocked ? 'AUTHORIZED' : 'FAST AUTHENTICATE'}</span>
        </button>
      </div>
    </div>
  );
};
