import React from 'react';

interface ExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSelectPhase: (phase: 1 | 2 | 3) => void;
}

export const ExplainerModal: React.FC<ExplainerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSelectPhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030a14]/90 backdrop-blur-md flex items-center justify-center p-3">
      <div className="relative w-full max-w-2xl bg-[#0b141e] border-2 border-[#00f3ff]/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-3 py-2.5 bg-[#060f19] border-b border-[#18202b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">biotech</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              SCIENTIFIC EXPLAINER DEEP-ZOOM
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-[#141c27] text-[#849495] hover:text-[#e3fdff] border border-[#3a494b]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Image Viewport */}
        <div className="relative flex-1 bg-[#060f19] overflow-auto flex items-center justify-center p-2 min-h-[220px]">
          <div className="relative max-w-full">
            <img
              src={imageUrl}
              alt="NeuroATM Tri-Phase Architecture"
              className="w-full h-auto object-contain max-h-[55vh] select-none"
              referrerPolicy="no-referrer"
            />
            {/* Phase Hotspot 1 */}
            <button
              onClick={() => {
                onSelectPhase(1);
                onClose();
              }}
              className="absolute top-[28%] left-[12%] transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#060f19]/90 border-2 border-[#00f3ff] text-[#00f3ff] font-bold text-xs flex items-center justify-center shadow-[0_0_12px_#00f3ff] animate-pulse">
                1
              </div>
              <span className="hidden sm:block text-[9px] bg-[#060f19]/90 text-[#00f3ff] px-1 py-0.5 mt-1 border border-[#00f3ff]/40 whitespace-nowrap">
                PREFRONTAL
              </span>
            </button>

            {/* Phase Hotspot 2 */}
            <button
              onClick={() => {
                onSelectPhase(2);
                onClose();
              }}
              className="absolute top-[38%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#060f19]/90 border-2 border-[#52ffac] text-[#52ffac] font-bold text-xs flex items-center justify-center shadow-[0_0_12px_#52ffac] animate-pulse">
                2
              </div>
              <span className="hidden sm:block text-[9px] bg-[#060f19]/90 text-[#52ffac] px-1 py-0.5 mt-1 border border-[#52ffac]/40 whitespace-nowrap">
                ADC & ML
              </span>
            </button>

            {/* Phase Hotspot 3 */}
            <button
              onClick={() => {
                onSelectPhase(3);
                onClose();
              }}
              className="absolute top-[30%] left-[82%] transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#060f19]/90 border-2 border-[#00f3ff] text-[#00f3ff] font-bold text-xs flex items-center justify-center shadow-[0_0_12px_#00f3ff] animate-pulse">
                3
              </div>
              <span className="hidden sm:block text-[9px] bg-[#060f19]/90 text-[#00f3ff] px-1 py-0.5 mt-1 border border-[#00f3ff]/40 whitespace-nowrap">
                DISPENSE
              </span>
            </button>
          </div>
        </div>

        {/* Modal Explainer Details */}
        <div className="p-3 bg-[#0b141e] border-t border-[#18202b] text-[10px] space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onSelectPhase(1);
                onClose();
              }}
              className="p-1.5 bg-[#141c27] hover:bg-[#18202b] border border-[#00f3ff]/40 text-left"
            >
              <span className="text-[#00f3ff] font-bold block">PHASE 01: CORTEX</span>
              <span className="text-[#849495] text-[9px] line-clamp-2">Biological neural spikes, prefrontal intent</span>
            </button>

            <button
              onClick={() => {
                onSelectPhase(2);
                onClose();
              }}
              className="p-1.5 bg-[#141c27] hover:bg-[#18202b] border border-[#52ffac]/40 text-left"
            >
              <span className="text-[#52ffac] font-bold block">PHASE 02: QUANT</span>
              <span className="text-[#849495] text-[9px] line-clamp-2">40kHz ADC, ML binary stream decoding</span>
            </button>

            <button
              onClick={() => {
                onSelectPhase(3);
                onClose();
              }}
              className="p-1.5 bg-[#141c27] hover:bg-[#18202b] border border-[#00f3ff]/40 text-left"
            >
              <span className="text-[#00f3ff] font-bold block">PHASE 03: DISPENSE</span>
              <span className="text-[#849495] text-[9px] line-clamp-2">Touchless cassette eject, memory purge</span>
            </button>
          </div>
          <div className="text-[9px] text-[#849495] flex items-center justify-between pt-1 border-t border-[#18202b]">
            <span>OCTANE RENDER 2400x1340 DUAL SCANNER</span>
            <span className="text-[#52ffac]">TAP ANY PHASE TO JUMP TIMELINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
