'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { HeartPulse, Wind, Activity, Watch, BatteryCharging } from 'lucide-react';
import { MetricKey, MonitoredPatient } from '@/types';

interface VitalTrendChartProps {
  patient: MonitoredPatient;
}

export default function VitalTrendChart({ patient }: VitalTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('heartRate');

  const hrDanger = patient.currentVitals.heartRate > 115 || patient.currentVitals.heartRate < 50;
  const spo2Danger = patient.currentVitals.spo2 < 92;
  const bpDanger = patient.currentVitals.systolic > 145 || patient.currentVitals.diastolic > 92;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
      {/* Patient Telemetry Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                patient.status === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-700'
                  : patient.status === 'WARNING'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {patient.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {patient.age} yrs • {patient.gender} •{' '}
            <span className="font-medium text-slate-700">{patient.condition}</span>
          </p>
        </div>

        {/* Connected Wearable Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
          <Watch className="w-4 h-4 text-cyan-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800">{patient.device}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Synced {patient.lastSynced}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium">
                <BatteryCharging className="w-3 h-3" />
                {patient.batteryPercent}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Live Metric Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setSelectedMetric('heartRate')}
          className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
            selectedMetric === 'heartRate'
              ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500'
              : hrDanger
              ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              Heart Rate
            </span>
            <span className="text-[11px] font-semibold text-slate-400">60–100 bpm</span>
          </div>
          <p
            className={`text-2xl font-bold mt-1.5 ${
              hrDanger ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {patient.currentVitals.heartRate}{' '}
            <span className="text-xs font-medium text-slate-500">bpm</span>
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('spo2')}
          className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
            selectedMetric === 'spo2'
              ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-600'
              : spo2Danger
              ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-600" />
              Oxygen (SpO2)
            </span>
            <span className="text-[11px] font-semibold text-slate-400">&ge; 95%</span>
          </div>
          <p
            className={`text-2xl font-bold mt-1.5 ${
              spo2Danger ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {patient.currentVitals.spo2}
            <span className="text-xs font-medium text-slate-500">%</span>
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('bloodPressure')}
          className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
            selectedMetric === 'bloodPressure'
              ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
              : bpDanger
              ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Blood Pressure
            </span>
            <span className="text-[11px] font-semibold text-slate-400">120/80 mmHg</span>
          </div>
          <p
            className={`text-2xl font-bold mt-1.5 ${
              bpDanger ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            {patient.currentVitals.systolic}/{patient.currentVitals.diastolic}{' '}
            <span className="text-xs font-medium text-slate-500">mmHg</span>
          </p>
        </button>
      </div>

      {/* 24-Hour Interactive Recharts Graph */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            24-Hour Telemetry Trend —{' '}
            {selectedMetric === 'heartRate'
              ? 'Heart Rate (BPM)'
              : selectedMetric === 'spo2'
              ? 'Oxygen Saturation (%)'
              : 'Systolic & Diastolic BP (mmHg)'}
          </h3>
          <span className="text-[11px] text-slate-400">
            Dashed line indicates clinical alert threshold
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'bloodPressure' ? (
              <LineChart data={patient.history24h} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[50, 190]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={140}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'High Systolic (140)', position: 'insideTopLeft', fontSize: 10, fill: '#d97706' }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic (mmHg)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic (mmHg)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3.5 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={patient.history24h} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={selectedMetric === 'heartRate' ? '#e11d48' : '#0891b2'}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={selectedMetric === 'heartRate' ? '#e11d48' : '#0891b2'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  domain={selectedMetric === 'heartRate' ? [45, 160] : [84, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={selectedMetric === 'heartRate' ? 120 : 90}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  label={{
                    value: selectedMetric === 'heartRate' ? 'Critical HR (120 bpm)' : 'Critical SpO2 (90%)',
                    position: 'insideTopLeft',
                    fontSize: 10,
                    fill: '#e11d48',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  name={selectedMetric === 'heartRate' ? 'Heart Rate (bpm)' : 'SpO2 (%)'}
                  stroke={selectedMetric === 'heartRate' ? '#e11d48' : '#0891b2'}
                  strokeWidth={2.5}
                  fill="url(#vitalGradient)"
                  dot={{ r: 3.5 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}