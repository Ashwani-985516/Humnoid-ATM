import React, { useState } from 'react';
import { AuditLogItem } from '../types';
import { sound } from '../utils/audio';

const INITIAL_LOGS: AuditLogItem[] = [
  { id: '1', timeMs: 40, timestamp: '11:42:08.904', category: 'AUTH', message: 'Intent vector initialized: motor_axis_engaged', verified: true },
  { id: '2', timeMs: 420, timestamp: '11:42:09.324', category: 'AUTH', message: 'Spatial cluster candidate: TOKEN_SAVINGS_ACC', verified: true },
  { id: '3', timeMs: 880, timestamp: '11:42:09.784', category: 'QUANT', message: 'Numeric digit extracted: "8" (p=0.9991)', verified: true },
  { id: '4', timeMs: 1120, timestamp: '11:42:10.024', category: 'QUANT', message: 'Numeric digit extracted: "4" (p=0.9984)', verified: true },
  { id: '5', timeMs: 1350, timestamp: '11:42:10.254', category: 'QUANT', message: 'Numeric digit extracted: "9" (p=0.9979)', verified: true },
  { id: '6', timeMs: 1580, timestamp: '11:42:10.484', category: 'QUANT', message: 'Numeric digit extracted: "2" (p=0.9994)', verified: true },
  { id: '7', timeMs: 1640, timestamp: '11:42:10.544', category: 'AUTH', message: 'Final PIN authentication lock: 8492 VERIFIED', signature: '0x7F41B920A4E90CD911...FE84', verified: true },
  { id: '8', timeMs: 2100, timestamp: '11:42:11.004', category: 'ACTUATOR', message: 'Mechanical Shutter trigger: 140ms pulse to Bay 02', verified: true },
  { id: '9', timeMs: 2480, timestamp: '11:42:11.384', category: 'PURGE', message: 'Session volatile registers wiped with pseudorandom entropy (Zero-Trace)', verified: true },
];

interface AuditVaultScreenProps {
  onEmergencyAbort: () => void;
}

export const AuditVaultScreen: React.FC<AuditVaultScreenProps> = ({ onEmergencyAbort }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>(INITIAL_LOGS);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'AUTH' | 'QUANT' | 'ACTUATOR' | 'PURGE'>('ALL');
  const [shutterOpen, setShutterOpen] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string>('VERIFIED PURGED (0 LEAKS)');

  const filteredLogs = filterCategory === 'ALL' ? logs : logs.filter((l) => l.category === filterCategory);

  const cycleShutterManually = () => {
    sound.playShutterClick();
    setShutterOpen(true);
    setTimeout(() => {
      sound.playDispenseChime();
      setTimeout(() => {
        setShutterOpen(false);
        sound.playShutterClick();
      }, 600);
    }, 400);
  };

  const triggerPurgeVerification = () => {
    sound.playTokenChirp();
    setPurgeStatus('RUNNING 256-BIT RAM MEMORY AUDIT...');
    setTimeout(() => {
      setPurgeStatus('CONFIRMED 100% PURGED (ENTROPY 0.9998)');
      sound.playSpike(1100);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Header Card */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">security</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              SESSION AUDIT & VAULT KIOSK
            </span>
          </div>
          <span className="text-[9px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            SESSION #SIM-8994-CORTEX
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#18202b] text-[9px] font-mono">
          <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
            <span className="text-[#849495] block">ENCRYPTION:</span>
            <span className="text-[#00f3ff] font-bold">Q-AEAD-512 / SHA3</span>
          </div>
          <div className="p-1.5 bg-[#0b141e] border border-[#18202b]">
            <span className="text-[#849495] block">MEMORY PURGE:</span>
            <span className="text-[#52ffac] font-bold">AUTO-FLUSH ZERO-TRACE</span>
          </div>
        </div>
      </div>

      {/* Kiosk Physical Actuator Controls */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            PHYSICAL KIOSK ACTUATOR
          </span>
          <span className="text-[9px] text-[#52ffac] font-mono">ARMED // READY</span>
        </div>

        {/* Shutter Status Box */}
        <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#849495]">MECHANICAL SHUTTER:</span>
            <span className={`text-[12px] font-bold font-mono ${shutterOpen ? 'text-[#00f3ff]' : 'text-[#dae3f2]'}`}>
              {shutterOpen ? 'OPEN (140ms PULSE)' : 'CLOSED & DEADLOCKED'}
            </span>
          </div>
          <button
            onClick={cycleShutterManually}
            className="py-1.5 px-2.5 bg-[#52ffac]/20 hover:bg-[#52ffac]/30 border border-[#52ffac] text-[#52ffac] text-[10px] font-bold flex items-center gap-1 font-space active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">eject</span>
            <span>CYCLE SHUTTER</span>
          </button>
        </div>

        {/* Cassette Bay Details */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          <div className="p-2 bg-[#060f19] border border-[#18202b]">
            <span className="text-[#849495] block">CASSETTE BAY 02:</span>
            <span className="text-[#dae3f2] font-bold">100 USD (995 NOTES)</span>
          </div>
          <div className="p-2 bg-[#060f19] border border-[#18202b]">
            <span className="text-[#849495] block">OPTICAL SENSORS:</span>
            <span className="text-[#52ffac] font-bold">CALIBRATED (0 ERR)</span>
          </div>
        </div>

        {/* Emergency Abort Bar */}
        <button
          onClick={() => {
            sound.playAbort();
            onEmergencyAbort();
          }}
          className="w-full py-2 bg-[#ff3366]/20 hover:bg-[#ff3366]/30 border border-[#ff3366] text-[#ffb4ab] text-[11px] font-bold font-space flex items-center justify-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ff3366]">dangerous</span>
          <span>ABORT PIPELINE & SEAL VAULT</span>
        </button>
      </div>

      {/* Cryptographic Session Terminal Stream */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            CRYPTOGRAPHIC AUDIT LOGS
          </span>
          <button
            onClick={triggerPurgeVerification}
            className="text-[9px] text-[#6ff6ff] hover:text-[#00f3ff] underline"
          >
            AUDIT PURGE
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px]">
          {(['ALL', 'AUTH', 'QUANT', 'ACTUATOR', 'PURGE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 border ${
                filterCategory === cat
                  ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] font-bold'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Log Stream Box */}
        <div className="bg-[#030a14] border border-[#18202b] p-2 max-h-60 overflow-y-auto flex flex-col gap-1.5 font-mono text-[9px]">
          {filteredLogs.map((item) => (
            <div
              key={item.id}
              className="p-1.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between text-[#849495] text-[8px]">
                <div className="flex items-center gap-1">
                  <span className="text-[#00f3ff] font-bold">[{item.category}]</span>
                  <span>{item.timestamp}</span>
                </div>
                <span className="text-[#52ffac]">VERIFIED ✓</span>
              </div>
              <div className="text-[#dae3f2]">{item.message}</div>
              {item.signature && (
                <div className="text-[#6ff6ff] text-[8px] truncate pt-0.5">
                  SIG: {item.signature}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Memory Purge Status Banner */}
        <div className="p-2 bg-[#0b141e] border border-[#52ffac]/40 flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#849495]">PURGE AUDIT:</span>
          <span className="text-[#52ffac] font-bold">{purgeStatus}</span>
        </div>
      </div>
    </div>
  );
};
