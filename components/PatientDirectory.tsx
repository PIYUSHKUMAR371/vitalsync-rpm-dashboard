'use client';

import React, { useMemo, useState } from 'react';
import { Search, Users, Watch, HeartPulse, Wind, Activity } from 'lucide-react';
import { MonitoredPatient, SeverityLevel } from '@/types';

interface PatientDirectoryProps {
  patients: MonitoredPatient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
}

const FILTER_TAGS = [
  'ALL',
  'CRITICAL',
  'WARNING',
  'STABLE',
  'Cardiac',
  'Respiratory',
  'Hypertension',
  'Post-Discharge',
];

const STATUS_BADGE: Record<SeverityLevel, string> = {
  CRITICAL: 'bg-rose-100 text-rose-700 border-rose-200',
  WARNING: 'bg-amber-100 text-amber-800 border-amber-200',
  STABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function PatientDirectory({
  patients,
  selectedPatientId,
  onSelectPatient,
}: PatientDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('ALL');

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.condition.toLowerCase().includes(q) ||
        patient.device.toLowerCase().includes(q) ||
        patient.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTag =
        activeTag === 'ALL' ||
        patient.status === activeTag ||
        patient.tags.includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [patients, searchQuery, activeTag]);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-600" />
          <h2 className="text-sm font-bold text-slate-900">Monitored Patient Directory</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredPatients.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, condition, or wearable..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              activeTag === tag
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Patient Cards Grid */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-xs font-semibold text-slate-700">No patients match this filter</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Reset the filter tag or clear your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPatients.map((patient) => {
            const isSelected = patient.id === selectedPatientId;

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-600 bg-cyan-50/30 ring-1 ring-cyan-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
                    <p className="text-xs text-slate-500">
                      {patient.age}y • {patient.condition}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      STATUS_BADGE[patient.status]
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                {/* Live Vitals Mini Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {patient.currentVitals.heartRate}
                    </span>
                    <span className="text-[11px] text-slate-400">bpm</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {patient.currentVitals.spo2}%
                    </span>
                    <span className="text-[11px] text-slate-400">SpO2</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {patient.currentVitals.systolic}/{patient.currentVitals.diastolic}
                    </span>
                  </div>
                </div>

                {/* Tags & Device Footer */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {patient.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                    <Watch className="w-3 h-3" />
                    {patient.lastSynced}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}