/**
 * Types and data models for the NeuroATM Mobile Prototype
 */

export type SubsystemTab = 'player' | 'process' | 'telemetry' | 'calibration' | 'pipeline' | 'audit' | 'vault';

export type SimulationStage = 1 | 2 | 3;

export interface TelemetryChannel {
  id: string;
  name: string;
  label: string;
  impedance: number; // in kΩ
  amplitude: number; // in μV
  frequency: number; // in Hz
  status: 'LOCKED' | 'SYNC' | 'DRIFT' | 'CALIBRATING';
}

export interface FrequencyBand {
  name: string;
  range: string;
  value: number; // percentage 0 - 100
  power: number; // in μV²/Hz
  description: string;
}

export interface ElectrodePoint {
  id: number;
  row: number;
  col: number;
  impedance: number; // in kΩ
  signalUv: number;
  snr: number;
  region: 'PREFRONTAL' | 'MOTOR' | 'PARIETAL' | 'OCCIPITAL' | 'TEMPORAL';
  status: 'optimal' | 'acceptable' | 'high_impedance' | 'calibrating';
}

export interface AuditLogItem {
  id: string;
  timeMs: number;
  timestamp: string;
  category: 'AUTH' | 'QUANT' | 'ACTUATOR' | 'SECURITY' | 'PURGE';
  message: string;
  signature?: string;
  verified: boolean;
}

export interface TransactionIntent {
  account: 'SAVINGS' | 'CHECKING';
  accountMasked: string;
  amount: number;
  denominationCount: number;
  targetPin: string;
  enteredPin: string;
  confidence: number;
  qNetToken: string;
  shutterState: 'CLOSED' | 'ARMED' | 'PULSING' | 'PURGED';
  isDispensed: boolean;
  isPurged: boolean;
}
