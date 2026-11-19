'use client';

import React, { useState } from 'react';
import VitalsSummaryBar from '@/components/VitalsSummaryBar';
import VitalTrendChart from '@/components/VitalTrendChart';
import AlertTriageFeed from '@/components/AlertTriageFeed';
import PatientDirectory from '@/components/PatientDirectory';
import { INITIAL_ALERTS, INITIAL_PATIENTS } from '@/data/mockVitalsData';
import { MonitoredPatient, VitalAlert } from '@/types';

export default function VitalSyncDashboardPage() {
  const [patients, setPatients] = useState<MonitoredPatient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<VitalAlert[]>(INITIAL_ALERTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleSimulateSpike = () => {
    const targetId = 'pt-104'; // Meera Krishnan (currently stable)
    setPatients((prev) =>
      prev.map((pt) => {
        if (pt.id !== targetId) return pt;
        return {
          ...pt,
          status: 'CRITICAL',
          lastSynced: 'Just now',
          currentVitals: {
            heartRate: 134,
            spo2: 88,
            systolic: 162,
            diastolic: 98,
          },
          history24h: [
            ...pt.history24h.slice(0, -1),
            {
              time: 'Now',
              heartRate: 134,
              spo2: 88,
              systolic: 162,
              diastolic: 98,
            },
          ],
        };
      })
    );

    const newAlert: VitalAlert = {
      id: `al-${Date.now()}`,
      patientId: targetId,
      patientName: 'Meera Krishnan',
      severity: 'CRITICAL',
      metric: 'Oxygen Saturation (SpO2)',
      value: '88%',
      threshold: '< 90% Critical Floor',
      message:
        'Live wearable telemetry detected acute SpO2 drop to 88% and heart rate surge to 134 bpm.',
      timestamp: 'Just now',
      acknowledged: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setSelectedPatientId(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Command Header & KPIs */}
        <VitalsSummaryBar
          patients={patients}
          alerts={alerts}
          onSimulateSpike={handleSimulateSpike}
        />

        {/* Primary Clinical Grid: 24h Trend Chart + Directory (Left) & Alert Triage Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <VitalTrendChart patient={selectedPatient} />
            <PatientDirectory
              patients={patients}
              selectedPatientId={selectedPatient.id}
              onSelectPatient={(id) => setSelectedPatientId(id)}
            />
          </div>

          <div className="lg:col-span-4">
            <AlertTriageFeed
              alerts={alerts}
              selectedPatientId={selectedPatient.id}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          </div>
        </div>
      </main>
    </div>
  );
}