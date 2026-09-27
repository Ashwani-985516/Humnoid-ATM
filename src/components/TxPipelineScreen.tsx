import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { NeuralBiometricScan } from './NeuralBiometricScan';

interface TxPipelineScreenProps {
  onDispenseSuccess: () => void;
  onNavigateToAudit?: () => void;
}

export const TxPipelineScreen: React.FC<TxPipelineScreenProps> = ({
  onDispenseSuccess,
  onNavigateToAudit,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<'SAVINGS' | 'CHECKING'>('SAVINGS');
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [pinDigits, setPinDigits] = useState<string[]>(['8', '4', '9', '2']);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [dispenseComplete, setDispenseComplete] = useState<boolean>(false);
  const [confidenceScore, setConfidenceScore] = useState<number>(99.8);
  const [payloadSig, setPayloadSig] = useState<string>('0x7F41B920A4E90CD91184BC32FA91901C984FE84');
  const [isBiometricScanOpen, setIsBiometricScanOpen] = useState<boolean>(false);

  const handleDigitTap = (d: string) => {
    sound.playTokenChirp();
    if (pinDigits.length >= 4) {
      setPinDigits([d]);
    } else {
      setPinDigits((prev) => [...prev, d]);
    }
  };

  const handleAutoThinkPIN = () => {
    sound.playTokenChirp();
    setPinDigits([]);
    const target = ['8', '4', '9', '2'];
    target.forEach((digit, i) => {
      setTimeout(() => {
        setPinDigits((prev) => [...prev, digit]);
        sound.playSpike(800 + i * 150);
      }, (i + 1) * 250);
    });
  };

  // Triggered when user clicks "TRANSMIT MOTOR INTENT"
  const handleInitiateTransaction = () => {
    if (pinDigits.length < 4) {
      alert('Please synthesize all 4 digits of the PIN token (8492).');
      return;
    }
    // Launch High-Security Neural Biometric Scan Gate
    setIsBiometricScanOpen(true);
  };

  // Called once NeuralBiometricScan succeeds
  const handleBiometricAuthSuccess = () => {
    setIsBiometricScanOpen(false);
    setIsTransmitting(true);
    sound.playSpike(1050);

    setTimeout(() => {
      sound.playShutterClick();
      setTimeout(() => {
        sound.playDispenseChime();
        setIsTransmitting(false);
        setDispenseComplete(true);
        onDispenseSuccess();
      }, 700);
    }, 600);
  };

  const resetTx = () => {
    setDispenseComplete(false);
    setIsTransmitting(false);
    setIsBiometricScanOpen(false);
    setPinDigits(['8', '4', '9', '2']);
    sound.playTokenChirp();
  };

  return (
    <div className="flex flex-col gap-3 pb-20 select-none">
      {/* Header Info */}
      <div className="p-3 bg-[#060f19] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f3ff] text-[18px]">account_tree</span>
            <span className="text-[12px] font-bold text-[#e3fdff] font-space tracking-wider">
              MIND-CONTROLLED TX PIPELINE
            </span>
          </div>
          <span className="text-[9px] text-[#52ffac] font-bold border border-[#52ffac]/30 px-1.5 py-0.5 bg-[#52ffac]/10">
            QOS: 99.98%
          </span>
        </div>

        <p className="text-[10px] text-[#849495] leading-relaxed">
          Direct neural intent authorization. Select target account via motor cortex orientation,
          synthesize PIN token, and transmit touchless dispense command.
        </p>
      </div>

      {/* Account Intent Selection */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#e3fdff] font-space">
          1. COGNITIVE ACCOUNT MAPPING
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playTokenChirp();
              setSelectedAccount('SAVINGS');
            }}
            className={`p-2.5 text-left border transition-all ${
              selectedAccount === 'SAVINGS'
                ? 'bg-[#00f3ff]/15 border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                : 'bg-[#141c27] border-[#18202b] text-[#849495]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-space text-[#e3fdff]">SAVINGS</span>
              {selectedAccount === 'SAVINGS' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] font-mono text-[#00f3ff] mt-0.5">#****9124</div>
            <div className="text-[9px] text-[#849495] mt-1">BAL: $14,280.00</div>
          </button>

          <button
            onClick={() => {
              sound.playTokenChirp();
              setSelectedAccount('CHECKING');
            }}
            className={`p-2.5 text-left border transition-all ${
              selectedAccount === 'CHECKING'
                ? 'bg-[#00f3ff]/15 border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                : 'bg-[#141c27] border-[#18202b] text-[#849495]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-space text-[#e3fdff]">CHECKING</span>
              {selectedAccount === 'CHECKING' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] font-mono text-[#00f3ff] mt-0.5">#****4819</div>
            <div className="text-[9px] text-[#849495] mt-1">BAL: $3,450.00</div>
          </button>
        </div>
      </div>

      {/* Dispense Amount Selection */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            2. DISPENSE QUOTA INTENT
          </span>
          <span className="text-[10px] font-bold text-[#52ffac] font-mono">
            {selectedAmount / 100}x $100 FED NOTES
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[100, 200, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                sound.playTokenChirp();
                setSelectedAmount(amt);
              }}
              className={`py-2 text-center border font-bold font-space text-[12px] transition-all ${
                selectedAmount === amt
                  ? 'bg-[#52ffac]/20 border-[#52ffac] text-[#52ffac] shadow-[0_0_8px_rgba(82,255,172,0.3)]'
                  : 'bg-[#141c27] border-[#18202b] text-[#849495]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Thought-Based PIN Synthesis Section */}
      <div className="p-3 bg-[#0b141e] border border-[#18202b] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#e3fdff] font-space">
            3. THOUGHT PIN SYNTHESIS (8492)
          </span>
          <span className="text-[9px] text-[#6ff6ff] font-mono">CONF: {confidenceScore}%</span>
        </div>

        {/* PIN Token Display Cells */}
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((idx) => {
            const hasDigit = pinDigits[idx];
            return (
              <div
                key={idx}
                className={`h-12 border flex flex-col items-center justify-center transition-all ${
                  hasDigit
                    ? 'bg-[#00f3ff]/15 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.25)]'
                    : 'bg-[#060f19] border-[#18202b] text-[#3a494b]'
                }`}
              >
                <span className="text-[18px] font-bold font-mono">
                  {hasDigit ? pinDigits[idx] : '·'}
                </span>
                <span className="text-[7px] text-[#849495]">TOKEN_{idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Mental Digits Keypad & Auto-Think Trigger */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitTap(digit)}
              className="py-2 bg-[#141c27] hover:bg-[#222b36] border border-[#18202b] text-[#dae3f2] font-mono text-[12px] font-bold active:scale-95 transition-all"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => {
              sound.playTokenChirp();
              setPinDigits([]);
            }}
            className="py-2 bg-[#141c27] border border-[#18202b] text-[#ffb4ab] text-[10px]"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleDigitTap('0')}
            className="py-2 bg-[#141c27] border border-[#18202b] text-[#dae3f2] font-mono text-[12px] font-bold active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleAutoThinkPIN}
            className="py-2 bg-[#52ffac]/20 border border-[#52ffac] text-[#52ffac] font-bold text-[9px] tracking-wider"
          >
            AUTO-THINK
          </button>
        </div>
      </div>

      {/* Cryptographic Dual-Signature Preview */}
      <div className="p-2.5 bg-[#060f19] border border-[#18202b] flex flex-col gap-1 text-[9px] font-mono">
        <div className="flex items-center justify-between text-[#849495]">
          <span>CRYPTOGRAPHIC HASH:</span>
          <span className="text-[#52ffac]">SHA3-512 VALIDATED</span>
        </div>
        <div className="text-[#00f3ff] truncate">{payloadSig}</div>
      </div>

      {/* Biometric Gate Security Notice Strip */}
      <div className="p-2 bg-[#060f19] border border-[#00f3ff]/40 flex items-center justify-between text-[9px] font-mono">
        <div className="flex items-center gap-1.5 text-[#00f3ff]">
          <span className="material-symbols-outlined text-[15px] animate-pulse">visibility</span>
          <span className="font-bold">BIOMETRIC GATE ACTIVE:</span>
        </div>
        <span className="text-[#52ffac] font-bold">RETINA 850nm + P300 SYNC</span>
      </div>

      {/* Execution / Dispense Trigger or Dispensed Success Notice */}
      {!dispenseComplete ? (
        <button
          onClick={handleInitiateTransaction}
          disabled={isTransmitting}
          className={`w-full py-3 px-4 border text-[13px] font-bold font-space tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            isTransmitting
              ? 'bg-[#141c27] border-[#3a494b] text-[#849495]'
              : 'bg-[#00f3ff] hover:bg-[#52ffac] text-[#030a14] border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-[0.98]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isTransmitting ? 'sync' : 'fingerprint'}
          </span>
          <span>
            {isTransmitting
              ? 'TRANSMITTING MOTOR INTENT...'
              : `TRANSMIT MOTOR INTENT (DISPENSE $${selectedAmount}.00)`}
          </span>
        </button>
      ) : (
        <div className="p-3 bg-[#00ffa3]/15 border-2 border-[#52ffac] flex flex-col gap-2 shadow-[0_0_20px_rgba(82,255,172,0.3)]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold font-space text-[#52ffac] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              DISPENSE & PURGE SUCCESSFUL
            </span>
            <span className="text-[9px] px-1 bg-[#52ffac] text-[#003920] font-bold">
              ZERO-TRACE
            </span>
          </div>

          <p className="text-[10px] text-[#dae3f2] leading-relaxed">
            ${selectedAmount}.00 smoothly ejected from Cassette Bay 02 without physical touch.
            All prefrontal volatile registers and PIN tokens have been flushed from system memory.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={resetTx}
              className="flex-1 py-1.5 bg-[#141c27] border border-[#3a494b] text-[10px] text-[#e3fdff]"
            >
              RUN NEW TRANSACTION
            </button>
            {onNavigateToAudit && (
              <button
                onClick={onNavigateToAudit}
                className="py-1.5 px-3 bg-[#52ffac]/20 border border-[#52ffac] text-[10px] text-[#52ffac] font-bold"
              >
                VIEW AUDIT LOG
              </button>
            )}
          </div>
        </div>
      )}

      {/* High-Security Neural Biometric Scan Overlay Gate */}
      <NeuralBiometricScan
        isOpen={isBiometricScanOpen}
        amount={selectedAmount}
        accountMasked={selectedAccount === 'SAVINGS' ? 'SAVINGS #****9124' : 'CHECKING #****4819'}
        onAuthSuccess={handleBiometricAuthSuccess}
        onCancel={() => setIsBiometricScanOpen(false)}
      />
    </div>
  );
};

