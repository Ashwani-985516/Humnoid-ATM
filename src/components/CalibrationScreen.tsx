import React, { useState } from 'react';
import { ElectrodePoint } from '../types';
import { sound } from '../utils/audio';

// Generate 96 electrodes
const generateElectrodes = (): ElectrodePoint[] => {
  const list: ElectrodePoint[] = [];
  const regions: ElectrodePoint['region'][] = ['PREFRONTAL', 'MOTOR', 'PARIETAL', 'TEMPORAL', 'OCCIPITAL'];
  for (let i = 1; i <= 96; i++) {
    const row = Math.floor((i - 1) / 12);
    const col = (i - 1) % 12;
    const region = regions[Math.floor((i - 1) / 20)] || 'PREFRONTAL';
    const impedance = Number((1.7 + Math.random() * 0.9).toFixed(2));
    const status: ElectrodePoint['status'] =
      impedance < 2.3 ? 'optimal' : impedance < 2.8 ? 'acceptable' : 'high_impedance';

    list.push({
      id: i,
      row,
      col,
      impedance,
      signalUv: Number((60 + Math.random() * 25).toFixed(1)),
      snr: Number((22 + Math.random() * 5).toFixed(1)),
      region,
      status,
    });
  }
  return list;
};

export const CalibrationScreen: React.FC = () => {
  const [electrodes, setElectrodes] = useState<ElectrodePoint[]>(generateElectrodes());
  const [selectedElectrode, setSelectedElectrode] = useState<ElectrodePoint>(electrodes[3]); // Default Ch-04
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibProgress, setCalibProgress] = useState<number>(100);
  const [calibLabel, setCalibLabel] = useState<string>('SYNAPSE_ARRAY_CALIBRATED');

  // Filters state
  const [eogFilter, setEogFilter] = useState(true);
  const [emgFilter, setEmgFilter] = useState(true);
  const [powerFilter, setPowerFilter] = useState(true);

  const startFullCalibration = () => {
    setIsCalibrating(true);
    setCalibProgress(0);
    setCalibLabel('LOCKING PREFRONTAL BASELINE...');
    sound.playTokenChirp();

    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setCalibProgress(step);
      sound.playSpike(600 + step * 6);

      if (step === 40) {
        setCalibLabel('EXTRACTING MOTOR INTENT PROFILE...');
      } else if (step === 70) {
        setCalibLabel('SYNCHRONIZING PIN-8492 COGNITIVE ANCHOR...');
      } else if (step >= 100) {
        clearInterval(interval);
        setIsCalibrating(false);
        setCalibLabel('ALL 96 CHANNELS PHASE-LOCKED');
        sound.playDispenseChime();
        // Lower impedances slightly
        setElectrodes((prev) =>
          prev.map((e) => ({
            ...e,
            impedance: Number((1.8 + Math.random() * 0.4).toFixed(2)),
            status: 'optimal',
          }))
        );
      }
    }, 200);
  };

  const handleSelectElectrode = (e: ElectrodePoint) => {
    sound.playSpike(900);
    setSelectedElectrode(e);
  };

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Header and Quick Calibrate Action */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">tune</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              BCI CALIBRATION & ARRAYS
            </span>
          </div>
          <span className="text-[9px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            {calibLabel}
          </span>
        </div>

        {/* Calibration Progress Bar */}
        <div className="w-full h-1.5 bg-[#18202b] overflow-hidden">
          <div
            className="h-full bg-[#00f3ff] transition-all duration-200 shadow-[0_0_8px_#00f3ff]"
            style={{ width: `${calibProgress}%` }}
          ></div>
        </div>

        <button
          onClick={startFullCalibration}
          disabled={isCalibrating}
          className={`w-full py-2 px-3 border text-[11px] font-bold font-space flex items-center justify-center gap-2 transition-all ${
            isCalibrating
              ? 'bg-[#141c27] border-[#3a494b] text-[#849495]'
              : 'bg-[#52ffac]/20 hover:bg-[#52ffac]/30 border-[#52ffac] text-[#52ffac]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isCalibrating ? 'sync' : 'auto_fix_high'}
          </span>
          <span>{isCalibrating ? 'CALIBRATING ARRAYS (WAIT)...' : 'RUN COMPLETE AUTO-CALIBRATION'}</span>
        </button>
      </div>

      {/* 96-Electrode Scalp Grid Visualizer */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            96-CHANNEL ELECTRODE ARRAY MAP
          </span>
          <span className="text-[9px] text-[#849495]">TAP TO INSPECT</span>
        </div>

        {/* Matrix Grid */}
        <div className="p-2 bg-[#030a14] border border-[#18202b] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[8px] text-[#849495] font-mono">
            <span>[ANTERIOR / FRONTAL]</span>
            <span>[POSTERIOR / OCCIPITAL]</span>
          </div>

          <div className="grid grid-cols-12 gap-1 place-items-center py-2">
            {electrodes.map((el) => {
              const isSelected = selectedElectrode.id === el.id;
              const colorClass =
                el.status === 'optimal'
                  ? 'bg-[#52ffac]'
                  : el.status === 'acceptable'
                  ? 'bg-[#00f3ff]'
                  : 'bg-[#ffb703]';

              return (
                <button
                  key={el.id}
                  onClick={() => handleSelectElectrode(el)}
                  className={`w-4 h-4 rounded-none flex items-center justify-center transition-all ${
                    isSelected
                      ? 'scale-125 ring-2 ring-[#e3fdff] z-10'
                      : 'hover:scale-110 opacity-90'
                  }`}
                  title={`Ch-${el.id} (${el.region}): ${el.impedance} kΩ`}
                >
                  <span className={`w-3 h-3 ${colorClass} block`}></span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[8px] text-[#849495] pt-1 border-t border-[#18202b]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#52ffac]"></span>
              <span>&lt;2.3 kΩ (Optimal)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#00f3ff]"></span>
              <span>&lt;2.8 kΩ (Good)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#ffb703]"></span>
              <span>&gt;2.8 kΩ (Drift)</span>
            </div>
          </div>
        </div>

        {/* Selected Electrode Detail Inspector */}
        <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00f3ff] font-space">
              Ch-{selectedElectrode.id} [{selectedElectrode.region}]
            </span>
            <span className="text-[9px] px-1 py-0.5 bg-[#52ffac]/15 text-[#52ffac] font-bold border border-[#52ffac]/30">
              {selectedElectrode.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
            <div className="p-1 bg-[#0b141e] border border-[#18202b]">
              <span className="text-[#849495] block text-[8px]">IMPEDANCE</span>
              <span className="text-[#e3fdff] font-bold">{selectedElectrode.impedance} kΩ</span>
            </div>
            <div className="p-1 bg-[#0b141e] border border-[#18202b]">
              <span className="text-[#849495] block text-[8px]">SIGNAL</span>
              <span className="text-[#52ffac] font-bold">+{selectedElectrode.signalUv} μV</span>
            </div>
            <div className="p-1 bg-[#0b141e] border border-[#18202b]">
              <span className="text-[#849495] block text-[8px]">SNR</span>
              <span className="text-[#00f3ff] font-bold">{selectedElectrode.snr} dB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Artifact Filter Management */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#e3fdff] font-space">
          REALTIME BIOLOGICAL ARTIFACT FILTERS
        </span>

        <div className="flex flex-col gap-1.5 text-[10px]">
          <div className="p-2 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#dae3f2]">EOG OCULAR BLINK CANCELLATION</span>
              <p className="text-[8px] text-[#849495]">Suppresses involuntary saccades & blink spikes</p>
            </div>
            <button
              onClick={() => {
                sound.playTokenChirp();
                setEogFilter(!eogFilter);
              }}
              className={`px-2 py-1 text-[9px] border font-bold ${
                eogFilter
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
                  : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
              }`}
            >
              {eogFilter ? 'ACTIVE' : 'BYPASS'}
            </button>
          </div>

          <div className="p-2 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#dae3f2]">EMG TEMPORAL JAW CLENCH FILTER</span>
              <p className="text-[8px] text-[#849495]">Removes high-frequency cranial muscle tension</p>
            </div>
            <button
              onClick={() => {
                sound.playTokenChirp();
                setEmgFilter(!emgFilter);
              }}
              className={`px-2 py-1 text-[9px] border font-bold ${
                emgFilter
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
                  : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
              }`}
            >
              {emgFilter ? 'ACTIVE' : 'BYPASS'}
            </button>
          </div>

          <div className="p-2 bg-[#0b141e] border border-[#18202b] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#dae3f2]">60Hz NOTCH POWERLINE HUM FILTER</span>
              <p className="text-[8px] text-[#849495]">Eliminates AC kiosk grid electromagnetic coupling</p>
            </div>
            <button
              onClick={() => {
                sound.playTokenChirp();
                setPowerFilter(!powerFilter);
              }}
              className={`px-2 py-1 text-[9px] border font-bold ${
                powerFilter
                  ? 'bg-[#52ffac]/20 border-[#52ffac] text-[#52ffac]'
                  : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
              }`}
            >
              {powerFilter ? 'ACTIVE' : 'BYPASS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
