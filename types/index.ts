export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'STABLE';

export type MetricKey = 'heartRate' | 'spo2' | 'bloodPressure';

export interface VitalPoint {
  time: string;
  heartRate: number; // bpm
  spo2: number; // %
  systolic: number; // mmHg
  diastolic: number; // mmHg
}

export interface MonitoredPatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  tags: string[];
  device: string;
  lastSynced: string;
  batteryPercent: number;
  status: SeverityLevel;
  currentVitals: {
    heartRate: number;
    spo2: number;
    systolic: number;
    diastolic: number;
  };
  history24h: VitalPoint[];
}

export interface VitalAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: SeverityLevel;
  metric: 'Heart Rate' | 'Oxygen Saturation (SpO2)' | 'Blood Pressure';
  value: string;
  threshold: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}