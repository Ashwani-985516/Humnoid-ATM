import React from 'react';
import { SubsystemTab } from '../types';
import { sound } from '../utils/audio';

interface SubsystemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SubsystemTab;
  onSelectTab: (tab: SubsystemTab) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onEmergencyAbort: () => void;
}

export const SubsystemDrawer: React.FC<SubsystemDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  audioEnabled,
  onToggleAudio,
  isDeviceFrame,
  onToggleDeviceFrame,
  onEmergencyAbort,
}) => {
  if (!isOpen) return null;

  const menuItems: { id: SubsystemTab; label: string; icon: string; desc: string }[] = [
    {
      id: 'player',
      label: 'Process Player',
      icon: 'motion_play',
      desc: 'Tri-phase neural-flow simulation engine & scrubber',
    },
    {
      id: 'process',
      label: 'Working Process',
      icon: 'schema',
      desc: '5-stage end-to-end biological to touchless architecture',
    },
    {
      id: 'telemetry',
      label: 'Neural Telemetry',
      icon: 'vital_signs',
      desc: '96-ch cortical array, μV waves & frequency bands',
    },
    {
      id: 'calibration',
      label: 'BCI Calibration',
      icon: 'tune',
      desc: 'Electrode impedance map, baseline sync & filters',
    },
    {
      id: 'pipeline',
      label: 'Tx Pipeline',
      icon: 'account_tree',
      desc: 'Mind-controlled transaction flow & PIN synthesis',
    },
    {
      id: 'audit',
      label: 'Session Audit',
      icon: 'terminal',
      desc: 'SHA3-512 cryptographic verification & registers',
    },
    {
      id: 'vault',
      label: 'Vault Controls',
      icon: 'lock',
      desc: 'Mechanical shutter actuator & cassette monitoring',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-[#0b141e] border-r border-[#18202b] flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#18202b] flex items-center justify-between bg-[#060f19]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52ffac] animate-pulse"></span>
            <div>
              <span className="text-[12px] font-bold text-[#00f3ff] tracking-widest font-space">
                SUBSYSTEM MATRIX
              </span>
              <p className="text-[9px] text-[#849495]">NODE: BCI-ATM-994 // ONLINE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#849495] hover:text-[#e3fdff] bg-[#141c27] border border-[#3a494b]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 flex-1 flex flex-col gap-1.5">
          <div className="text-[9px] text-[#849495] uppercase tracking-wider px-2 py-1 font-bold">
            CH_ACTIVE NAVIGATION
          </div>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playTokenChirp();
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full text-left p-2.5 flex items-start gap-2.5 border transition-all ${
                  isActive
                    ? 'bg-[#00f3ff]/15 border-[#00f3ff] text-[#e3fdff]'
                    : 'bg-[#141c27]/60 hover:bg-[#141c27] border-[#18202b] text-[#b9cacb]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 ${
                    isActive ? 'text-[#00f3ff]' : 'text-[#849495]'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="text-[12px] font-bold font-space flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="text-[9px] text-[#52ffac] px-1 bg-[#52ffac]/10">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#849495] leading-tight mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}

          {/* Prototype View Controls */}
          <div className="mt-4 pt-3 border-t border-[#18202b] flex flex-col gap-2">
            <span className="text-[9px] text-[#849495] uppercase tracking-wider px-1 font-bold">
              PROTOTYPE PREVIEW CONTROLS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onToggleDeviceFrame}
                className={`p-2 border text-[10px] flex items-center justify-center gap-1.5 font-bold ${
                  isDeviceFrame
                    ? 'bg-[#00f3ff]/15 border-[#00f3ff] text-[#00f3ff]'
                    : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isDeviceFrame ? 'smartphone' : 'fit_screen'}
                </span>
                <span>{isDeviceFrame ? 'PHONE FRAME' : 'EDGE-TO-EDGE'}</span>
              </button>

              <button
                onClick={onToggleAudio}
                className={`p-2 border text-[10px] flex items-center justify-center gap-1.5 font-bold ${
                  audioEnabled
                    ? 'bg-[#52ffac]/15 border-[#52ffac] text-[#52ffac]'
                    : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {audioEnabled ? 'volume_up' : 'volume_off'}
                </span>
                <span>{audioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Realtime Synaptic Metrics Box */}
        <div className="p-3 bg-[#060f19] border-t border-[#18202b] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#849495]">SYNAPTIC LOAD</span>
            <span className="text-[#00f3ff] font-bold">41.8%</span>
          </div>
          <div className="w-full h-1.5 bg-[#18202b] overflow-hidden">
            <div className="w-5/12 h-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"></div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#849495]">COGNITIVE BIOMARKER</span>
            <span className="text-[#52ffac] font-bold">● STABLE</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onEmergencyAbort();
            }}
            className="mt-2 w-full py-2 bg-[#ff3366]/20 hover:bg-[#ff3366]/30 border border-[#ff3366] text-[#ffb4ab] text-[11px] font-bold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ff3366]">dangerous</span>
            <span>EMERGENCY NEURO-ABORT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
