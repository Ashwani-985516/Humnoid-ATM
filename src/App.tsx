/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SubsystemTab } from './types';
import { sound } from './utils/audio';
import { MobileFrame } from './components/MobileFrame';
import { TopStatusBar } from './components/TopStatusBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SubsystemDrawer } from './components/SubsystemDrawer';
import { ProcessPlayerScreen } from './components/ProcessPlayerScreen';
import { WorkingProcessScreen } from './components/WorkingProcessScreen';
import { TelemetryScreen } from './components/TelemetryScreen';
import { CalibrationScreen } from './components/CalibrationScreen';
import { TxPipelineScreen } from './components/TxPipelineScreen';
import { AuditVaultScreen } from './components/AuditVaultScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<SubsystemTab>('player');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sound.enabled = next;
    if (next) {
      sound.playSpike(880);
      showToast('AUDIO SYNTHESIZER: ACTIVE');
    } else {
      showToast('AUDIO SYNTHESIZER: MUTED');
    }
  };

  const handleEmergencyAbort = () => {
    sound.playAbort();
    showToast('EMERGENCY ABORT: SHUTTER SEALED & VOLATILE REGISTERS PURGED');
  };

  const handleDispenseSuccess = () => {
    showToast('DISPENSE SUCCESSFUL: $500.00 EJECTED WITHOUT TOUCH');
  };

  return (
    <MobileFrame
      isDeviceFrame={isDeviceFrame}
      onToggleFrame={() => setIsDeviceFrame(!isDeviceFrame)}
      activeScreenTitle={activeTab.toUpperCase()}
    >
      {/* Top Mobile Status & Navigation Bar */}
      <TopStatusBar
        currentTab={activeTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onEmergencyAbort={handleEmergencyAbort}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        isSimulating={false}
      />

      {/* Main Screen Body Viewport */}
      <main className="flex-1 w-full px-3 py-3 overflow-y-auto bg-[#0b141e]">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-4 right-4 max-w-sm mx-auto z-50 p-2.5 bg-[#060f19]/95 border-2 border-[#00f3ff] text-[#e3fdff] text-[10px] font-mono shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping"></span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#849495] hover:text-[#dae3f2] ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Subsystem Screen Rendering */}
        {activeTab === 'player' && (
          <ProcessPlayerScreen
            onEmergencyAbort={handleEmergencyAbort}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'process' && (
          <WorkingProcessScreen
            onLaunchSimulation={() => setActiveTab('player')}
            onLaunchTxPipeline={() => setActiveTab('pipeline')}
          />
        )}

        {activeTab === 'telemetry' && <TelemetryScreen />}

        {activeTab === 'calibration' && <CalibrationScreen />}

        {activeTab === 'pipeline' && (
          <TxPipelineScreen
            onDispenseSuccess={handleDispenseSuccess}
            onNavigateToAudit={() => setActiveTab('vault')}
          />
        )}

        {(activeTab === 'vault' || activeTab === 'audit') && (
          <AuditVaultScreen onEmergencyAbort={handleEmergencyAbort} />
        )}
      </main>

      {/* Fixed Mobile Bottom Nav Bar */}
      <BottomNavBar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Side Slide-Over Subsystem Matrix Drawer */}
      <SubsystemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        onEmergencyAbort={handleEmergencyAbort}
      />
    </MobileFrame>
  );
}
