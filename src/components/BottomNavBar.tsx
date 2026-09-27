import React from 'react';
import { SubsystemTab } from '../types';
import { sound } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: SubsystemTab;
  onSelectTab: (tab: SubsystemTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: SubsystemTab; label: string; icon: string }[] = [
    { id: 'player', label: 'PLAYER', icon: 'motion_play' },
    { id: 'process', label: 'PROCESS', icon: 'schema' },
    { id: 'telemetry', label: 'TELEMETRY', icon: 'vital_signs' },
    { id: 'pipeline', label: 'TX FLOW', icon: 'account_tree' },
    { id: 'vault', label: 'VAULT', icon: 'lock' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060f19]/95 backdrop-blur-md border-t border-[#18202b] select-none">
      <div className="max-w-md mx-auto grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTokenChirp();
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center min-h-[44px] transition-all ${
                isActive
                  ? 'bg-[#00f3ff]/10 text-[#00f3ff]'
                  : 'text-[#849495] hover:text-[#dae3f2] active:bg-[#141c27]'
              }`}
            >
              {/* Active top indicator line */}
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"></div>
              )}
              <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[9px] font-bold tracking-tight mt-0.5 font-space truncate max-w-[56px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
