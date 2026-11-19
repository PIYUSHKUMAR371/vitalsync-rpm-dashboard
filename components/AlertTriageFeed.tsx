'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Check,
  ArrowUpRight,
  Bell,
} from 'lucide-react';
import { SeverityLevel, VitalAlert } from '@/types';

interface AlertTriageFeedProps {
  alerts: VitalAlert[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

const SEVERITY_STYLES: Record<
  SeverityLevel,
  {
    card: string;
    badge: string;
    iconBg: string;
    Icon: React.ElementType;
  }
> = {
  CRITICAL: {
    card: 'bg-rose-50/90 border-rose-300 shadow-xs',
    badge: 'bg-rose-600 text-white',
    iconBg: 'bg-rose-100 text-rose-700',
    Icon: AlertOctagon,
  },
  WARNING: {
    card: 'bg-amber-50/80 border-amber-300',
    badge: 'bg-amber-500 text-slate-950',
    iconBg: 'bg-amber-100 text-amber-700',
    Icon: AlertTriangle,
  },
  STABLE: {
    card: 'bg-emerald-50/60 border-emerald-200',
    badge: 'bg-emerald-600 text-white',
    iconBg: 'bg-emerald-100 text-emerald-700',
    Icon: CheckCircle2,
  },
};

export default function AlertTriageFeed({
  alerts,
  selectedPatientId,
  onSelectPatient,
  onAcknowledgeAlert,
}: AlertTriageFeedProps) {
  const [filter, setFilter] = useState<'ALL' | SeverityLevel>('ALL');

  const visibleAlerts = alerts.filter((alert) =>
    filter === 'ALL' ? true : alert.severity === filter
  );

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col h-full">
      {/* Header & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900">Alert Triage Feed</h2>
        </div>

        <div className="flex items-center gap-1">
          {(['ALL', 'CRITICAL', 'WARNING', 'STABLE'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilter(level)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filter === level
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Alert Cards */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[540px] pr-1">
        {visibleAlerts.map((alert) => {
          const style = SEVERITY_STYLES[alert.severity];
          const IconComponent = style.Icon;
          const isSelected = alert.patientId === selectedPatientId;

          return (
            <div
              key={alert.id}
              onClick={() => onSelectPatient(alert.patientId)}
              className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                style.card
              } ${isSelected ? 'ring-2 ring-slate-900/80' : ''} ${
                alert.acknowledged ? 'opacity-65' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {alert.patientName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{alert.timestamp}</p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-slate-900 bg-white/80 px-2 py-1 rounded-md border border-slate-200/80">
                  {alert.value}
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-xs font-semibold text-slate-800">
                  {alert.metric}{' '}
                  <span className="font-normal text-slate-500">({alert.threshold})</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {alert.message}
                </p>
              </div>

              {/* Card Actions */}
              <div
                className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onSelectPatient(alert.patientId)}
                  className="text-[11px] font-semibold text-slate-800 hover:text-cyan-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect 24h Chart</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {alert.acknowledged ? (
                  <span className="text-[11px] font-medium text-slate-500 inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}