import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface ProcessStep {
  step: number;
  timeRange: string;
  stageName: string;
  category: string;
  title: string;
  subtitle: string;
  whatHappens: string;
  technicalDetails: {
    label: string;
    value: string;
    color: string;
  }[];
  visualType: 'cortex' | 'sensor' | 'adc' | 'transformer' | 'dispense';
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    timeRange: '0.00s — 0.82s',
    stageName: 'STAGE 01',
    category: 'BIOLOGICAL NEUROLOGY',
    title: 'Biological Neural Firing & Intent Formation',
    subtitle: 'Prefrontal and motor cortex cellular depolarizations generate mental intent',
    whatHappens:
      'As the user approaches the NeuroATM kiosk, they silently concentrate on two thoughts: selecting their Savings Account and recalling their 4-digit PIN (8492). Pyramidal neurons in the motor cortex generate electrical action potentials (+74.6 μV) producing rhythmic oscillations.',
    technicalDetails: [
      { label: 'CORTICAL REGION', value: 'Prefrontal / Motor Axis (Brodmann Area 4 & 6)', color: '#00f3ff' },
      { label: 'PEAK VOLTAGE', value: '+74.6 μV @ 240 Hz', color: '#6ff6ff' },
      { label: 'DOMINANT BAND', value: 'Gamma (30–100 Hz) Cognitive Binding', color: '#52ffac' },
      { label: 'SIGNAL-TO-NOISE', value: '24.8 dB', color: '#52ffac' },
    ],
    visualType: 'cortex',
  },
  {
    step: 2,
    timeRange: '0.82s — 1.20s',
    stageName: 'STAGE 02',
    category: 'BCI TRANSDUCTION',
    title: '96-Channel Scalp Sensor Acquisition',
    subtitle: 'Non-invasive high-density electrode array captures microvolt potentials',
    whatHappens:
      'The multi-channel BCI array measures micro-impedance at 96 distinct cranial coordinates. Real-time biological artifact rejection filters isolate and cancel out ocular blinks (EOG) and jaw muscle clenching (EMG), yielding clean analog brainwave traces.',
    technicalDetails: [
      { label: 'ELECTRODE ARRAY', value: '96/96 Channels Phase-Locked', color: '#52ffac' },
      { label: 'AVG IMPEDANCE', value: '2.08 kΩ (Optimal contact < 2.5 kΩ)', color: '#00f3ff' },
      { label: 'ARTIFACT REJECTION', value: 'EOG Blink + EMG Jaw Clench Cancelers Active', color: '#52ffac' },
      { label: 'MAINS FILTER', value: '60 Hz AC Hum Notch Filter Active', color: '#dae3f2' },
    ],
    visualType: 'sensor',
  },
  {
    step: 3,
    timeRange: '1.20s — 1.64s',
    stageName: 'STAGE 03',
    category: 'DIGITAL QUANTIZATION',
    title: '40 kHz ADC & Binary Bitstream Encoding',
    subtitle: 'Analog brainwave voltages converted into digital bitstreams',
    whatHappens:
      'Ultra-fast analog-to-digital converters (ADC) sample the biological voltage signals at 40,000 samples per second. The continuous sinusoidal microvolt waveforms are quantized into high-frequency binary bitstreams (0s and 1s) ready for machine learning inference.',
    technicalDetails: [
      { label: 'SAMPLING RATE', value: '40,000 Samples / Second (40 kHz)', color: '#52ffac' },
      { label: 'QUANTIZER RESOLUTION', value: '24-bit Delta-Sigma ADC', color: '#00f3ff' },
      { label: 'BITSTREAM FORMAT', value: 'Continuous Synchronous Bitstream (40.0 kS/s)', color: '#6ff6ff' },
      { label: 'BITSTREAM INTEGRITY', value: '0 Frame Drops / Parity Validated', color: '#52ffac' },
    ],
    visualType: 'adc',
  },
  {
    step: 4,
    timeRange: '1.64s — 2.10s',
    stageName: 'STAGE 04',
    category: 'AI DECODER & CRYPTO',
    title: 'Deep Transformer Intent Decoding & Cryptographic Auth',
    subtitle: 'Attention mechanism extracts neuro-tokens: account and PIN 8492',
    whatHappens:
      'A deep spatio-temporal Transformer neural network processes the token stream. It classifies the user intention as TOKEN_SAVINGS_ACC and extracts the numeric PIN digits: 8, 4, 9, 2 (confidence 99.8%). The intent is signed with post-quantum SHA3-512 and wrapped in an AEAD-512 session token.',
    technicalDetails: [
      { label: 'NEURAL MODEL', value: 'Spatio-Temporal Attention Transformer (Q-Net)', color: '#00f3ff' },
      { label: 'DECODED PIN', value: '8492 (Digit Confidence: 99.8%)', color: '#52ffac' },
      { label: 'ACCOUNT MATCH', value: 'SAVINGS ACCOUNT (#****9124)', color: '#00f3ff' },
      { label: 'CRYPTOGRAPHIC HASH', value: 'SHA3-512 (0x7F41B920A4E90CD911...FE84)', color: '#6ff6ff' },
    ],
    visualType: 'transformer',
  },
  {
    step: 5,
    timeRange: '2.10s — 2.48s',
    stageName: 'STAGE 05',
    category: 'ACTUATION & PRIVACY',
    title: 'Touchless Cassette Dispense & Zero-Trace Purge',
    subtitle: 'Physical cash ejects touch-free, followed by an immediate memory wipe',
    whatHappens:
      'The verified intent triggers the ATM mechanical actuator. A 140ms pulse opens the shutter of Feeder Cassette Bay 02, sliding $500.00 (5x $100 notes) into the ejection tray. Simultaneously, all volatile neural registers and PIN buffers in RAM are purged and overwritten with cryptographic random noise.',
    technicalDetails: [
      { label: 'DISPENSED AMOUNT', value: '$500.00 (5x $100.00 Fed Notes)', color: '#52ffac' },
      { label: 'SHUTTER PULSE', value: '140ms Electronic Actuation (Bay 02)', color: '#00f3ff' },
      { label: 'VOLATILE PURGE', value: 'Instant Multi-Pass Memory Overwrite', color: '#52ffac' },
      { label: 'RESIDUAL STORAGE', value: '0 Bytes (Zero Skimming / Zero Leakage)', color: '#52ffac' },
    ],
    visualType: 'dispense',
  },
];

interface WorkingProcessScreenProps {
  onLaunchSimulation: () => void;
  onLaunchTxPipeline: () => void;
}

export const WorkingProcessScreen: React.FC<WorkingProcessScreenProps> = ({
  onLaunchSimulation,
  onLaunchTxPipeline,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [bitPulse, setBitPulse] = useState<string>('10110001010101110010100101010101');

  const currentStep = PROCESS_STEPS[activeStepIndex];

  // Bit pulse ticker
  useEffect(() => {
    const timer = setInterval(() => {
      let b = '';
      for (let i = 0; i < 32; i++) b += Math.random() > 0.5 ? '1' : '0';
      setBitPulse(b);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Auto-play loop
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % PROCESS_STEPS.length;
        if (next === 0) sound.playSpike(880);
        else if (next === 1) sound.playSpike(920);
        else if (next === 2) sound.playTokenChirp();
        else if (next === 3) sound.playTokenChirp();
        else if (next === 4) sound.playDispenseChime();
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const selectStep = (index: number) => {
    setIsAutoPlaying(false);
    setActiveStepIndex(index);
    if (index === 4) sound.playDispenseChime();
    else if (index >= 2) sound.playTokenChirp();
    else sound.playSpike(880);
  };

  const toggleAutoPlay = () => {
    const next = !isAutoPlaying;
    setIsAutoPlaying(next);
    sound.playTokenChirp();
  };

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Header Banner */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">account_tree</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              HOW NEUROATM WORKS
            </span>
          </div>
          <span className="text-[9px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            5-STAGE PIPELINE
          </span>
        </div>

        <p className="text-[10px] text-[#849495] leading-relaxed">
          From subconscious neural depolarization in the motor cortex to touchless physical bill ejection
          and instantaneous memory purge in under <strong>2.48 seconds</strong>.
        </p>

        {/* Auto-Play & Simulator Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#18202b]">
          <button
            onClick={toggleAutoPlay}
            className={`py-2 px-3 border text-[10px] font-bold font-space flex items-center justify-center gap-1.5 transition-all ${
              isAutoPlaying
                ? 'bg-[#52ffac]/20 border-[#52ffac] text-[#52ffac] shadow-[0_0_12px_rgba(82,255,172,0.3)]'
                : 'bg-[#141c27] hover:bg-[#18202b] border-[#3a494b] text-[#00f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isAutoPlaying ? 'pause' : 'smart_display'}
            </span>
            <span>{isAutoPlaying ? 'PAUSE WALKTHROUGH' : 'AUTO-PLAY PROCESS'}</span>
          </button>

          <button
            onClick={onLaunchSimulation}
            className="py-2 px-3 bg-[#00f3ff] hover:bg-[#52ffac] text-[#030a14] border border-[#00f3ff] text-[10px] font-bold font-space flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,243,255,0.3)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">play_circle</span>
            <span>OPEN 3D SUITE</span>
          </button>
        </div>
      </div>

      {/* Horizontal Step Indicator Rail */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-[#060f19] border border-[#18202b]">
        {PROCESS_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          return (
            <button
              key={step.step}
              onClick={() => selectStep(idx)}
              className={`py-1.5 flex flex-col items-center justify-center text-center border transition-all ${
                isActive
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.3)]'
                  : isPassed
                  ? 'bg-[#52ffac]/10 border-[#52ffac]/40 text-[#52ffac]'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              <span className="text-[10px] font-bold font-space">0{step.step}</span>
              <span className="text-[7px] tracking-tight truncate max-w-[50px]">
                {step.step === 1
                  ? 'FIRING'
                  : step.step === 2
                  ? 'SENSOR'
                  : step.step === 3
                  ? 'ADC'
                  : step.step === 4
                  ? 'DECODER'
                  : 'DISPENSE'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <div className="p-3 bg-[#0b141e] border-2 border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.15)] flex flex-col gap-3">
        {/* Step Badge & Timing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#00f3ff]/20 text-[#00f3ff] text-[9px] font-bold font-space">
              {currentStep.stageName}
            </span>
            <span className="text-[9px] text-[#849495] font-bold">
              // {currentStep.category}
            </span>
          </div>
          <span className="text-[10px] text-[#52ffac] font-bold font-mono">
            {currentStep.timeRange}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-[13px] font-bold text-[#e3fdff] font-space leading-tight">
            {currentStep.title}
          </h3>
          <p className="text-[10px] text-[#6ff6ff] mt-0.5 font-mono">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Dynamic Graphic Schematic for This Step */}
        <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
          {currentStep.visualType === 'cortex' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] text-[#849495]">
                <span>BIOLOGICAL ACTION POTENTIAL WAVE</span>
                <span className="text-[#00f3ff] font-bold font-mono">+74.6 μV (240Hz)</span>
              </div>
              <div className="w-full h-14 bg-[#030a14] border border-[#18202b] flex items-center justify-center p-1">
                <svg className="w-full h-full" viewBox="0 0 300 45" preserveAspectRatio="none">
                  <path
                    d="M 0 22 Q 25 22 35 20 T 60 22 T 80 24 T 95 4 T 105 40 T 115 20 T 130 22 T 180 22 T 205 3 T 215 42 T 225 22 T 300 22"
                    fill="none"
                    stroke="#00f3ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-[8px] text-[#849495] flex items-center justify-between">
                <span>INTENT: <strong className="text-[#00f3ff]">SAVINGS #****9124</strong></span>
                <span>PIN TOKEN: <strong className="text-[#52ffac]">8-4-9-2</strong></span>
              </div>
            </div>
          )}

          {currentStep.visualType === 'sensor' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] text-[#849495]">
                <span>96-ELECTRODE TRANSDUCTION GRID</span>
                <span className="text-[#52ffac] font-bold">2.08 kΩ LOCKED</span>
              </div>
              <div className="w-full h-14 bg-[#030a14] border border-[#18202b] p-2 flex items-center justify-center gap-1.5 flex-wrap">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 ${
                      i % 7 === 0 ? 'bg-[#52ffac] animate-pulse' : 'bg-[#00f3ff]'
                    }`}
                  ></span>
                ))}
              </div>
              <div className="text-[8px] text-[#849495] flex items-center justify-between">
                <span>EOG OCULAR CANCELER: <strong className="text-[#52ffac]">ACTIVE</strong></span>
                <span>EMG JAW FILTER: <strong className="text-[#52ffac]">ACTIVE</strong></span>
              </div>
            </div>
          )}

          {currentStep.visualType === 'adc' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] text-[#849495]">
                <span>40,000 SAMPLES/SEC CONTINUOUS BITSTREAM</span>
                <span className="text-[#52ffac] font-bold">24-BIT ADC</span>
              </div>
              <div className="w-full h-14 bg-[#030a14] border border-[#18202b] p-2 flex items-center justify-center font-mono text-[11px] text-[#52ffac] tracking-widest overflow-hidden whitespace-nowrap">
                {bitPulse}
              </div>
              <div className="text-[8px] text-[#849495] flex items-center justify-between">
                <span>ADC JITTER: <strong className="text-[#52ffac]">&lt; 0.12 ps</strong></span>
                <span>PARITY: <strong className="text-[#00f3ff]">VALIDATED</strong></span>
              </div>
            </div>
          )}

          {currentStep.visualType === 'transformer' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] text-[#849495]">
                <span>TRANSFORMER Q-NET ATTENTION EXTRACTION</span>
                <span className="text-[#00f3ff] font-bold">CONF: 99.8%</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {['8', '4', '9', '2'].map((digit) => (
                  <div
                    key={digit}
                    className="p-1.5 bg-[#030a14] border border-[#00f3ff]/40 text-center"
                  >
                    <span className="text-[14px] font-bold text-[#52ffac] font-mono block">
                      {digit}
                    </span>
                    <span className="text-[7px] text-[#849495]">p=0.999</span>
                  </div>
                ))}
              </div>
              <div className="text-[8px] text-[#849495] flex items-center justify-between">
                <span>HASH: <strong className="text-[#6ff6ff]">SHA3-512 SECURE</strong></span>
                <span>SESSION: <strong className="text-[#00f3ff]">Q-AEAD-512</strong></span>
              </div>
            </div>
          )}

          {currentStep.visualType === 'dispense' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] text-[#849495]">
                <span>KIOSK ACTUATION & MEMORY SANITIZATION</span>
                <span className="text-[#52ffac] font-bold">140ms PULSE</span>
              </div>
              <div className="w-full h-14 bg-[#030a14] border border-[#18202b] flex items-center justify-between px-3">
                <div>
                  <span className="text-[16px] font-bold text-[#52ffac] font-space">$500.00</span>
                  <span className="text-[8px] text-[#849495] block">5x $100 FED NOTES</span>
                </div>
                <div className="w-20 h-7 bg-[#00ffa3] text-[#003920] font-bold text-[11px] font-space flex items-center justify-center shadow-md">
                  $500
                </div>
              </div>
              <div className="text-[8px] text-[#849495] flex items-center justify-between">
                <span>VOLATILE RAM PURGE: <strong className="text-[#52ffac]">100% WIPED</strong></span>
                <span>STORAGE RESIDUE: <strong className="text-[#52ffac]">0 BYTES</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Narrative Description of How It Operates */}
        <p className="text-[10px] text-[#dae3f2] leading-relaxed bg-[#060f19] p-2.5 border border-[#18202b]">
          {currentStep.whatHappens}
        </p>

        {/* Technical Specification Chips */}
        <div className="grid grid-cols-2 gap-1.5">
          {currentStep.technicalDetails.map((td, i) => (
            <div key={i} className="p-1.5 bg-[#060f19] border border-[#18202b] flex flex-col">
              <span className="text-[7px] text-[#849495] uppercase">{td.label}</span>
              <span
                className="text-[9px] font-bold font-mono truncate"
                style={{ color: td.color }}
              >
                {td.value}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Stepper between stages */}
        <div className="flex items-center justify-between pt-1 border-t border-[#18202b]">
          <button
            onClick={() => selectStep(Math.max(0, activeStepIndex - 1))}
            disabled={activeStepIndex === 0}
            className="px-2 py-1 bg-[#141c27] text-[#dae3f2] text-[9px] border border-[#3a494b] disabled:opacity-30"
          >
            ← PREVIOUS STAGE
          </button>
          <span className="text-[9px] text-[#849495]">
            STAGE {activeStepIndex + 1} OF 5
          </span>
          <button
            onClick={() => selectStep(Math.min(PROCESS_STEPS.length - 1, activeStepIndex + 1))}
            disabled={activeStepIndex === PROCESS_STEPS.length - 1}
            className="px-2 py-1 bg-[#00f3ff]/20 text-[#00f3ff] text-[9px] border border-[#00f3ff] disabled:opacity-30 font-bold"
          >
            NEXT STAGE →
          </button>
        </div>
      </div>

      {/* Security Architecture Comparison: Conventional ATM vs NeuroATM */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#e3fdff] font-space">
          WHY NEUROATM: SECURITY COMPARISON
        </span>

        <div className="grid grid-cols-2 gap-2 text-[9px]">
          {/* Traditional ATM */}
          <div className="p-2 bg-[#0b141e] border border-[#ff3366]/40 flex flex-col gap-1">
            <span className="text-[#ffb4ab] font-bold font-space">TRADITIONAL ATM</span>
            <ul className="text-[#849495] space-y-1 list-disc list-inside">
              <li>Physical keypad pin-skimming</li>
              <li>Camera shoulder-surfing</li>
              <li>Magnetic stripe card cloning</li>
              <li>Touch surface viral/bacterial wear</li>
              <li>PIN remains in unpurged memory buffers</li>
            </ul>
          </div>

          {/* NeuroATM */}
          <div className="p-2 bg-[#0b141e] border border-[#52ffac]/40 flex flex-col gap-1">
            <span className="text-[#52ffac] font-bold font-space">NEUROATM BCI</span>
            <ul className="text-[#dae3f2] space-y-1 list-disc list-inside">
              <li>Zero physical contact or keypad</li>
              <li>Silent thought-based PIN synthesis</li>
              <li>Post-quantum SHA3-512 signing</li>
              <li>Instant 100% volatile memory purge</li>
              <li>Impossible to skim or shoulder-surf</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Quick Launch CTA */}
      <div className="p-3 bg-[#00f3ff]/10 border border-[#00f3ff] flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#00f3ff] font-space">
          READY TO EXPERIENCE IT LIVE?
        </span>
        <p className="text-[9px] text-[#dae3f2]">
          Test the interactive scrubber in the 3D Simulation Suite or trigger a custom mind-controlled
          cash withdrawal in the Tx Pipeline.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onLaunchSimulation}
            className="py-2 bg-[#00f3ff] text-[#030a14] font-bold font-space text-[10px] flex items-center justify-center gap-1 shadow-md"
          >
            <span className="material-symbols-outlined text-[15px]">motion_play</span>
            <span>3D SIMULATOR</span>
          </button>
          <button
            onClick={onLaunchTxPipeline}
            className="py-2 bg-[#52ffac] text-[#003920] font-bold font-space text-[10px] flex items-center justify-center gap-1 shadow-md"
          >
            <span className="material-symbols-outlined text-[15px]">account_tree</span>
            <span>TX PIPELINE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
