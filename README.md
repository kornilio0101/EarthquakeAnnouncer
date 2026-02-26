# 🌋 QuakeAnn

**Real-time Earthquake Monitoring & Audio Announcement System**

QuakeAnn is a high-performance desktop application designed for real-time seismic awareness. By aggregating data from global seismic networks, QuakeAnn provides instantaneous audio announcements and visual alerts, keeping you informed of geological activity across the globe or in your specific region.

---

## 📖 Table of Contents
- [Core Mission](#-core-mission)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Usage Guide](#-usage-guide)
- [App Attributes](#-app-attributes)
- [Technical Specifications](#-technical-specifications)
- [Installation & Build](#-installation--build)

---

## 🎯 Core Mission
The primary goal of QuakeAnn is to minimize the time between a seismic event detection and user awareness. Unlike traditional websites, QuakeAnn uses active Text-to-Speech (TTS) and background execution to ensure you never miss an event, even while working on other tasks.

---

## ✨ Key Features

### 🎙️ Intelligent Announcements
- **Dynamic TTS**: Announces events in a clear, natural format: *"Attention - Magnitude - Location - Time ago"*.
- **Audio Cues**: Chime alerts proceed every voice announcement to grab attention.
- **Deduplication**: Proprietary logic prevents redundant alerts from multiple seismic sources for the same event.

### 📍 Geographical Intelligence
- **Google Maps Integration**: Every entry is a live portal. Clicking an earthquake or the announcement banner opens the exact epicenter in Google Maps.
- **Regional Filtering**: Focus on specific continents or monitor the entire world.

### 🔔 Reliable Background Operation
- **Minimized Awareness**: Explicitly configured to bypass Electron's background throttling. The app remains alive and active in the taskbar.
- **Native Notifications**: System-level toasts provide visual confirmation alongside audio alerts.

### 🎨 Premium Interface
- **Glassmorphism Design**: A sleek, modern UI built with semi-transparent layers and vibrant accents.
- **Motion Engine**: Smooth transitions and pulsing indicators powered by Framer Motion.

---

## 🛠️ How It Works

1.  **Ingestion**: Every 10 seconds, the app polls a distributed network of seismic providers.
2.  **Normalization**: Diverse data formats (GeoJSON, JMA list, etc.) are standardized into a unified internal model.
3.  **Deduplication**: Events are cross-referenced by location (within 100km) and time (within 90s) to ensure uniqueness.
4.  **Action**: If an event passes your magnitude and region filters, the announcement engine is triggered.

---

## 🎮 Usage Guide

### 1. Setting Filters
Use the **Sidebar Controls** to tune your feed:
- **Min Magnitude**: Slide from 0.0 to 9.0. Only events above this threshold will be shown and announced.
- **Region Select**: Choose "Worldwide" for global monitoring or select a specific continent like "Europe" or "Asia".

### 2. Interacting with the Feed
- **Live List**: Most recent earthquakes appear at the top.
- **Mapping**: Click any card in the feed to see the precise location on Google Maps.
- **Announcement Banner**: When a new quake is detected, a red "Activity Detected" banner appears. Click it to navigate to the source.

---

## 📋 App Attributes

### 🌍 Monitored Regions
- **Worldwide** (Default)
- **North America**
- **South America**
- **Europe**
- **Asia**
- **Africa**
- **Australia / Oceania**

### 📡 Data Sources
QuakeAnn integrates with the following premier seismic networks:
- **USGS** (United States Geological Survey)
- **EMSC** (European-Mediterranean Seismological Centre)
- **IRIS** (Incorporated Research Institutions for Seismology)
- **GFZ** (German Research Centre for Geosciences)
- **INGV** (National Institute of Geophysics and Volcanology, Italy)
- **GeoNet** (New Zealand Geological Monitoring)
- **GA** (Geoscience Australia)
- **NRCan** (Natural Resources Canada)
- **JMA** (Japan Meteorological Agency)

---

## 💻 Technical Specifications

| Attribute | Specification |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Runtime** | Electron (Cross-platform Desktop) |
| **Styling** | Vanilla CSS (Custom Design System) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Voice Engine** | Web Speech API (System-native voices) |
| **Build Tool** | Custom `build.js` for versioned releases |

---

## � Installation & Build

### Development
1. Clone and install:
   ```bash
   npm install
   ```
2. Start Dev Mode:
   ```bash
   npm run dev
   ```

### Production Build
Execute the automated build script:
```bash
npm run build
```
The system will create a versioned output in:
`release/v<package.json-version>/`

---
*Stay safe. Stay informed.*
