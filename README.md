# 🌋 QuakeAnn - Real-time Earthquake Announcer

QuakeAnn is a premium, real-time earthquake monitoring and announcement application. Built with a focus on speed, visibility, and accessibility, it syncs with global seismic networks to provide instant audio and visual alerts, even when running in the background.

![QuakeAnn Logo](public/quakeann.ico)

## ✨ Key Features

- **🌐 Global Monitoring**: Aggregates data from multiple seismic networks including USGS and JMA.
- **🎙️ Voice Announcements**: High-quality Text-to-Speech (TTS) announcements for every detected event.
- **📍 Google Maps Integration**: Click any earthquake item in the feed to open its exact location in Google Maps.
- **🔔 Background Alerts**: Works seamlessly when minimized to the taskbar, utilizing native desktop notifications and audio alerts.
- **🎚️ Live Filters**: Categorize and filter the live feed by magnitude and geographical region.
- **💎 Premium UI**: A modern, glassmorphism-based interface with smooth animations powered by Framer Motion.
- **📦 Versioned Builds**: Automated build system that organizes releases into version-specific folders.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kornilio0101/EarthquakeAnnouncer.git
   cd EarthquakeAnnouncer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the application in development mode with hot-reloading:
```bash
npm run dev
```

### Building the App

To generate a versioned production build:
```bash
npm run build
```
The build artifacts will be available in the `release/v<version>` directory.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Desktop**: [Electron](https://www.electronjs.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Voice**: Web Speech API (TTS)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built for real-time awareness and safety.*
