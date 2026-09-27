import React, { useState, useEffect } from 'react';
import { SubsystemTab } from '../types';
import { sound } from '../utils/audio';

interface TopStatusBarProps {
  currentTab: SubsystemTab;
  onOpenDrawer: () => void;
  onEmergencyAbort: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  isSimulating: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  currentTab,
  onOpenDrawer,
  onEmergencyAbort,
  audioEnabled,
  onToggleAudio,
  isSimulating,
}) => {
  const [timeStr, setTimeStr] = useState('11:42:08.902');
  const [latency] = useState('1.84ms');
  const [qos] = useState('99.98%');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const sec = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(Math.random() * 900 + 100)).padStart(3, '0');
      setTimeStr(`${hrs}:${min}:${sec}.${ms}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = (tab: SubsystemTab) => {
    switch (tab) {
      case 'player':
        return 'PROCESS PLAYER';
      case 'process':
        return 'WORKING PROCESS';
      case 'telemetry':
        return 'NEURAL TELEMETRY';
      case 'calibration':
        return 'BCI CALIBRATION';
      case 'pipeline':
        return 'TX PIPELINE';
      case 'audit':
        return 'SESSION AUDIT';
      case 'vault':
        return 'VAULT CONTROLS';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060f19]/95 backdrop-blur-md border-b border-[#18202b] select-none">
      {/* Mobile OS Top Info Ribbon */}
      <div className="h-6 px-3 flex items-center justify-between text-[10px] text-[#849495] font-mono border-b border-[#18202b]/60">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#52ffac] animate-pulse"></span>
          <span className="text-[#e3fdff] font-bold">NEURO_ATM</span>
          <span className="text-[#3a494b]">|</span>
          <span className="text-[#6ff6ff]">LAT: {latency}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>QoS: <strong className="text-[#52ffac]">{qos}</strong></span>
          <span className="text-[#3a494b]">|</span>
          <span className="text-[#b9cacb] font-bold">{timeStr.slice(0, 8)}</span>
          <span className="text-[#52ffac] text-[9px] px-1 py-0.2 bg-[#52ffac]/10 border border-[#52ffac]/30">
            5G_BCI
          </span>
        </div>
      </div>

      {/* Primary Mobile App Bar */}
      <div className="h-12 px-3 flex items-center justify-between gap-2">
        {/* Left: Drawer Menu & Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTokenChirp();
              onOpenDrawer();
            }}
            className="w-8 h-8 flex items-center justify-center bg-[#141c27] active:bg-[#222b36] border border-[#3a494b] text-[#00f3ff] transition-colors"
            title="Open Subsystem Matrix"
          >
            <span className="material-symbols-outlined text-[19px]">menu</span>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-[#e3fdff] tracking-wider font-space">
                {getTabTitle(currentTab)}
              </span>
              {isSimulating && (
                <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping"></span>
              )}
            </div>
            <div className="text-[9px] text-[#849495] flex items-center gap-1">
              <span>SYS_ID: #BCI-ATM-994</span>
              <span>·</span>
              <span className="text-[#52ffac]">Q-AEAD-512</span>
            </div>
          </div>
        </div>

        {/* Right: Audio toggle, Step pill, Abort */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleAudio}
            className={`w-7 h-7 flex items-center justify-center border text-[14px] transition-colors ${
              audioEnabled
                ? 'bg-[#00f3ff]/15 border-[#00f3ff] text-[#00f3ff]'
                : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
            }`}
            title={audioEnabled ? 'Mute Bio-Synthesizer FX' : 'Enable Bio-Synthesizer FX'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {audioEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playAbort();
              onEmergencyAbort();
            }}
            className="px-2 h-7 bg-[#ff3366]/15 hover:bg-[#ff3366]/25 active:bg-[#ff3366]/40 border border-[#ff3366]/60 text-[#ffb4ab] text-[10px] font-bold flex items-center gap-1 transition-all"
            title="Emergency Abort All Registers"
          >
            <span className="material-symbols-outlined text-[13px] text-[#ff3366]">dangerous</span>
            <span>ABORT</span>
          </button>
        </div>
      </div>

      {/* Subsystem Pipeline Step Progress Bar */}
      <div className="px-3 py-1 bg-[#0b141e] border-t border-[#18202b] flex items-center justify-between text-[9px] text-[#849495]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#849495]">STEP 03/05:</span>
          <span className="text-[#52ffac] font-bold tracking-wider">SYNAPSE_AUTH_LOCK</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-1 bg-[#52ffac]"></div>
          <div className="w-5 h-1 bg-[#52ffac]"></div>
          <div className="w-5 h-1 bg-[#00f3ff] animate-pulse"></div>
          <div className="w-5 h-1 bg-[#2d3541]"></div>
          <div className="w-5 h-1 bg-[#2d3541]"></div>
        </div>
      </div>
    </header>
  );
};
