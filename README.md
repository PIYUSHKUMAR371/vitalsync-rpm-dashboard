
# VitalSync — Remote Patient Monitoring & Alert Dashboard

**Author:** Piyush Kumar

VitalSync is a clinical Remote Patient Monitoring (RPM) web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide React**. It monitors simulated 24-hour wearable patient telemetry—tracking **Heart Rate (bpm)**, **Oxygen Saturation (SpO2 %)**, and **Blood Pressure (mmHg)**—and surfaces abnormal readings through a color-coded alert triage feed, interactive trend charts, and a searchable patient roster.

---

## Clinical & UX Design Focus

In remote patient care, clinicians monitor multiple patients at once and cannot afford to hunt through raw logs or suffer from alert fatigue when a vital sign crosses a dangerous threshold. VitalSync is structured around rapid triage and visual hierarchy:

* **Immediate Danger Visibility:** Critical alerts and out-of-range vitals use high-contrast red/amber indicators and threshold reference lines so spikes and oxygen drops stand out at a glance.
* **24-Hour Context Over Single Snapshots:** Clicking a vital card or alert focuses the selected patient and updates the 24-hour trend chart so clinicians can see whether a reading is a sudden drop/spike or part of a multi-hour trajectory.
* **Actionable Triage Loop:** Clinicians can filter alerts by severity (`ALL`, `CRITICAL`, `WARNING`, `STABLE`), jump straight to a patient's 24-hour chart, and acknowledge handled alerts.

---

## Key Features

### 1. Command Header, Fleet KPIs & Alert Simulator (`components/VitalsSummaryBar.tsx`)
* Displays live telemetry status alongside top-level fleet metrics: **Active Wearables**, **Critical Alerts** (unacknowledged), **Watch Warnings** (unacknowledged), and **Stable Patients**.
* Includes a **Simulate Wearable Alert** button that injects a critical vital event (elevated heart rate, low SpO2, elevated blood pressure) into a patient's latest reading and 24-hour history, adds a new `CRITICAL` alert to the triage feed, and focuses that patient.

### 2. 24-Hour Interactive Vital Trend Chart (`components/VitalTrendChart.tsx`)
* Shows the selected patient's demographics, primary clinical condition, status badge, and connected wearable metadata (device model, last sync time, and battery percentage).
* Provides interactive metric selector cards for **Heart Rate (`60–100 bpm`)**, **Oxygen / SpO2 (`≥ 95%`)**, and **Blood Pressure (`120/80 mmHg`)** with danger-state highlighting.
* Renders a responsive **Recharts** visualization (`AreaChart` for Heart Rate and SpO2; dual-line `LineChart` for Systolic and Diastolic Blood Pressure) complete with clinical threshold reference lines (`ReferenceLine`) and interactive hover tooltips.

### 3. Color-Coded Alert Triage Feed (`components/AlertTriageFeed.tsx`)
* Color-codes alerts by severity:
  * **CRITICAL (Red):** Immediate clinical review required (e.g., SpO2 `< 90%` or resting HR `> 120 bpm`).
  * **WARNING (Amber):** Elevated or watch-zone metrics requiring follow-up.
  * **STABLE (Emerald):** Readings within target recovery or baseline ranges.
* Supports severity filter tabs (`ALL`, `CRITICAL`, `WARNING`, `STABLE`), clicking any card to inspect that patient's 24-hour chart, and marking alerts as **Acknowledged**.

### 4. Searchable Patient Directory (`components/PatientDirectory.tsx`)
* Real-time search across patient name, clinical condition, wearable device, and tags.
* Filter pills for status and condition tags (`ALL`, `CRITICAL`, `WARNING`, `STABLE`, `Cardiac`, `Respiratory`, `Hypertension`, `Post-Discharge`).
* Displays each patient's live vital strip, tags, sync timestamp, and active selection state.

---

## Tech Stack

* **Framework:** Next.js (App Router, React client components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Visualization:** Recharts (`ResponsiveContainer`, `AreaChart`, `LineChart`, `ReferenceLine`, `Tooltip`)
* **Icons:** Lucide React

---

## Project Structure

```text
vitalsync/
├── app/
│   ├── layout.tsx                  # Root layout and metadata
│   ├── globals.css                 # Tailwind CSS styles
│   └── page.tsx                    # Main VitalSync dashboard state & layout
├── components/
│   ├── VitalsSummaryBar.tsx        # Top command header, KPI cards & alert simulator
│   ├── AlertTriageFeed.tsx         # Color-coded Critical / Warning / Stable alert list
│   ├── VitalTrendChart.tsx         # Interactive 24h Recharts telemetry & metric cards
│   └── PatientDirectory.tsx        # Searchable patient roster & tag filters
├── data/
│   └── mockVitalsData.ts           # Initial monitored patients, 24h series & alerts
└── types/
    └── index.ts                    # TypeScript interfaces & types
