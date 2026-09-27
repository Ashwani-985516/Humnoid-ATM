import React, { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  isDeviceFrame: boolean;
  onToggleFrame: () => void;
  activeScreenTitle: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isDeviceFrame,
  onToggleFrame,
  activeScreenTitle,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#030a14] bg-blueprint-grid text-[#dae3f2] flex flex-col items-center justify-start sm:py-6 sm:px-4">
      {/* Top Prototype Control Bar (visible on desktop) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-2 py-1.5 bg-[#060f19] border border-[#18202b] text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#52ffac] animate-pulse"></span>
          <span className="text-[#00f3ff] font-bold font-space">MOBILE PROTOTYPE PREVIEW</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFrame}
            className={`px-2 py-0.5 border text-[9px] font-bold flex items-center gap-1 transition-all ${
              isDeviceFrame
                ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]'
                : 'bg-[#141c27] border-[#3a494b] text-[#849495]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {isDeviceFrame ? 'smartphone' : 'fit_screen'}
            </span>
            <span>{isDeviceFrame ? 'PHONE FRAME' : 'EDGE-TO-EDGE'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Either Framed or Edge-to-Edge */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrame
            ? 'sm:max-w-[412px] sm:h-[890px] sm:max-h-[92vh] sm:rounded-[42px] sm:border-[8px] sm:border-[#18202b] sm:shadow-[0_0_50px_rgba(0,243,255,0.15)] sm:ring-1 sm:ring-[#00f3ff]/30 sm:overflow-hidden relative flex flex-col bg-[#0b141e]'
            : 'max-w-md min-h-screen bg-[#0b141e] border-x border-[#18202b] flex flex-col'
        }`}
      >
        {/* Mobile Device Speaker / Dynamic Island on Phone Frame */}
        {isDeviceFrame && (
          <div className="hidden sm:flex absolute top-2 inset-x-0 justify-center z-50 pointer-events-none">
            <div className="w-28 h-4 bg-[#030a14] rounded-full flex items-center justify-center border border-[#18202b]">
              <div className="w-10 h-1 bg-[#18202b] rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-[#0e223f] ml-2"></div>
            </div>
          </div>
        )}

        {/* Scrollable Screen Content Container */}
        <div className="flex-1 w-full overflow-y-auto relative flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator Bar on Phone Frame */}
        {isDeviceFrame && (
          <div className="hidden sm:flex justify-center items-center h-4 bg-[#060f19] z-50 pointer-events-none">
            <div className="w-32 h-1 bg-[#3a494b] rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
