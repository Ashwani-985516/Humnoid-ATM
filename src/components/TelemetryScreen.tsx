import React, { useState, useEffect } from 'react';
import { TelemetryChannel, FrequencyBand } from '../types';
import { sound } from '../utils/audio';

const CHANNELS_DATA: TelemetryChannel[] = [
  { id: 'ch-04', name: 'Ch-04', label: 'MOTOR_CORTEX_L', impedance: 2.1, amplitude: 74.2, frequency: 240, status: 'LOCKED' },
  { id: 'ch-12', name: 'Ch-12', label: 'PREFRONTAL_INTENT', impedance: 1.8, amplitude: 68.9, frequency: 180, status: 'LOCKED' },
  { id: 'ch-28', name: 'Ch-28', label: 'PARIETAL_ARITHMETIC', impedance: 2.3, amplitude: 65.4, frequency: 160, status: 'LOCKED' },
  { id: 'ch-64', name: 'Ch-64', label: 'NUMERIC_SYNAPSE', impedance: 2.4, amplitude: 81.0, frequency: 260, status: 'SYNC' },
  { id: 'ch-88', name: 'Ch-88', label: 'OCCIPITAL_VERIFY', impedance: 1.9, amplitude: 59.3, frequency: 140, status: 'LOCKED' },
  { id: 'ch-105', name: 'Ch-105', label: 'VERIFY_COMMIT_LOCK', impedance: 2.0, amplitude: 72.4, frequency: 220, status: 'LOCKED' },
];

const FREQUENCY_BANDS: FrequencyBand[] = [
  { name: 'DELTA', range: '0.5 - 4 Hz', value: 14, power: 1.8, description: 'Baseline resting oscillation' },
  { name: 'THETA', range: '4 - 8 Hz', value: 26, power: 4.2, description: 'Subconscious hippocampus gating' },
  { name: 'ALPHA', range: '8 - 12 Hz', value: 88, power: 18.6, description: 'Prefrontal intent synchronization' },
  { name: 'BETA', range: '13 - 30 Hz', value: 72, power: 14.1, description: 'Motor planning & numeric calculation' },
  { name: 'GAMMA', range: '30 - 100 Hz', value: 95, power: 26.8, description: 'Synaptic PIN binding token (Peak)' },
];

export const TelemetryScreen: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('ch-04');
  const [noiseFilter, setNoiseFilter] = useState<boolean>(true);
  const [waveOffset, setWaveOffset] = useState<number>(0);
  const [activeChannels, setActiveChannels] = useState<TelemetryChannel[]>(CHANNELS_DATA);

  // Live wave animation tick
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveOffset((prev) => (prev + 3) % 300);
    }, 40);
    return () => clearInterval(waveInterval);
  }, []);

  const currentCh = activeChannels.find((c) => c.id === selectedChannel) || activeChannels[0];

  const handleTestChannel = (chId: string) => {
    sound.playSpike(1100);
    setActiveChannels((prev) =>
      prev.map((c) =>
        c.id === chId
          ? { ...c, amplitude: Number((Math.random() * 20 + 65).toFixed(1)) }
          : c
      )
    );
  };

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Telemetry Header Overview Card */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">vital_signs</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              CORTICAL ARRAY TELEMETRY
            </span>
          </div>
          <span className="text-[9px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            96/96 CHANNELS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#18202b] text-[9px]">
          <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
            <span className="text-[#849495] block">AVG IMPEDANCE</span>
            <span className="text-[#00f3ff] font-bold font-mono text-[11px]">2.08 kΩ</span>
          </div>
          <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
            <span className="text-[#849495] block">SAMPLING</span>
            <span className="text-[#52ffac] font-bold font-mono text-[11px]">40,000 Hz</span>
          </div>
          <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
            <span className="text-[#849495] block">SNR LEVEL</span>
            <span className="text-[#6ff6ff] font-bold font-mono text-[11px]">24.8 dB</span>
          </div>
        </div>
      </div>

      {/* Live Oscilloscope Monitor */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#00f3ff] font-space">
              LIVE ACTION POTENTIAL
            </span>
            <span className="text-[9px] text-[#849495]">({currentCh.label})</span>
          </div>
          <button
            onClick={() => {
              sound.playTokenChirp();
              setNoiseFilter(!noiseFilter);
            }}
            className={`px-2 py-0.5 text-[9px] border font-mono ${
              noiseFilter
                ? 'bg-[#52ffac]/15 border-[#52ffac] text-[#52ffac]'
                : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
            }`}
          >
            NOTCH 60Hz: {noiseFilter ? 'ENGAGED' : 'BYPASS'}
          </button>
        </div>

        {/* Oscilloscope Grid Canvas */}
        <div className="relative w-full h-32 bg-[#030a14] border border-[#18202b] overflow-hidden p-1 flex items-center">
          {/* Blueprint Cross-Grid Lines */}
          <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none"></div>

          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="scopeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#00f3ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#52ffac" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <line x1="0" y1="50" x2="400" y2="50" stroke="#18202b" strokeDasharray="3 3" />
            <line x1="100" y1="0" x2="100" y2="100" stroke="#18202b" strokeDasharray="2 2" />
            <line x1="200" y1="0" x2="200" y2="100" stroke="#18202b" strokeDasharray="2 2" />
            <line x1="300" y1="0" x2="300" y2="100" stroke="#18202b" strokeDasharray="2 2" />

            <path
              d={`M 0 50 Q 30 ${50 + Math.sin(waveOffset * 0.05) * 8} 60 50 T 120 50 T 140 18 T 150 82 T 160 50 T 220 50 T 250 12 T 260 88 T 270 50 T 340 50 T 400 50`}
              fill="none"
              stroke="url(#scopeGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* HUD Overlay in bottom right */}
          <div className="absolute bottom-1.5 right-1.5 bg-[#060f19]/90 px-1.5 py-0.5 text-[8px] font-mono text-[#6ff6ff] border border-[#18202b]">
            PEAK: +{currentCh.amplitude} μV @ {currentCh.frequency} Hz
          </div>
        </div>

        {/* Quick Channel Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {activeChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                sound.playSpike(800);
                setSelectedChannel(ch.id);
              }}
              className={`px-2 py-1 text-[9px] font-mono whitespace-nowrap border ${
                selectedChannel === ch.id
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] font-bold'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              {ch.name}
            </button>
          ))}
        </div>
      </div>

      {/* EEG Spectral Frequency Band Decomposition */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            FREQUENCY BAND SPECTRAL POWER
          </span>
          <span className="text-[9px] text-[#52ffac] font-mono">GAMMA DOMINANT</span>
        </div>

        <div className="flex flex-col gap-2">
          {FREQUENCY_BANDS.map((band) => (
            <div key={band.name} className="p-2 bg-[#0b141e] border border-[#18202b] flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#00f3ff] font-space">{band.name}</span>
                  <span className="text-[8px] text-[#849495]">({band.range})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#dae3f2] font-mono font-bold">{band.value}%</span>
                  <span className="text-[8px] text-[#849495]">{band.power} μV²/Hz</span>
                </div>
              </div>

              {/* Spectral power bar */}
              <div className="w-full h-1.5 bg-[#141c27] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    band.value > 80
                      ? 'bg-[#52ffac] shadow-[0_0_8px_#52ffac]'
                      : band.value > 50
                      ? 'bg-[#00f3ff]'
                      : 'bg-[#3a494b]'
                  }`}
                  style={{ width: `${band.value}%` }}
                ></div>
              </div>
              <p className="text-[8px] text-[#849495] leading-tight">{band.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Impedance Table */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#e3fdff] font-space">
          CRITICAL CHANNEL DIAGNOSTICS
        </span>
        <div className="flex flex-col gap-1.5">
          {activeChannels.map((ch) => (
            <div
              key={ch.id}
              className="p-2 bg-[#060f19] border border-[#18202b] flex items-center justify-between text-[10px]"
            >
              <div className="flex flex-col">
                <span className="text-[#dae3f2] font-bold font-mono">
                  {ch.name} [{ch.label}]
                </span>
                <span className="text-[8px] text-[#849495]">
                  IMPEDANCE: <strong className="text-[#00f3ff]">{ch.impedance} kΩ</strong> · SNR: 24.8 dB
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] px-1 py-0.5 bg-[#52ffac]/10 text-[#52ffac] border border-[#52ffac]/30 font-bold">
                  {ch.status}
                </span>
                <button
                  onClick={() => handleTestChannel(ch.id)}
                  className="px-2 py-1 bg-[#141c27] hover:bg-[#222b36] border border-[#3a494b] text-[9px] text-[#6ff6ff]"
                >
                  TEST
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
