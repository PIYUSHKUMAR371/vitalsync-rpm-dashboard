'use client';

import React from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Zap,
} from 'lucide-react';
import { MonitoredPatient, VitalAlert } from '@/types';

interface VitalsSummaryBarProps {
  patients: MonitoredPatient[];
  alerts: VitalAlert[];
  onSimulateSpike: () => void;
}

export default function VitalsSummaryBar({
  patients,
  alerts,
  onSimulateSpike,
}: VitalsSummaryBarProps) {
  const criticalCount = alerts.filter(
    (a) => a.severity === 'CRITICAL' && !a.acknowledged
  ).length;
  const warningCount = alerts.filter(
    (a) => a.severity === 'WARNING' && !a.acknowledged
  ).length;
  const stablePatients = patients.filter((p) => p.status === 'STABLE').length;

  return (
    <div className="space-y-4">
      {/* Top Clinical Header */}
      <header className="bg-slate-950 text-white rounded-2xl px-6 py-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight">VitalSync RPM</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                <Radio className="w-3 h-3 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Remote Patient Monitoring & Wearable Alert Command Center
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSimulateSpike}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Wearable Alert</span>
        </button>
      </header>

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Wearables</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{patients.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Streaming 24h vitals</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 flex items-center justify-between transition-colors ${
            criticalCount > 0
              ? 'bg-rose-50/70 border-rose-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-rose-700">Critical Alerts</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{criticalCount}</p>
            <p className="text-[11px] text-rose-600/80 mt-0.5">Immediate review</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Watch Warnings</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{warningCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Elevated thresholds</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Stable Patients</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stablePatients}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Within target range</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}