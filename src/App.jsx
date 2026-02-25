import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, Filter, Globe, Clock, AlertTriangle, ShieldCheck, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTINENTS, SOURCES, isWithinBounds, formatTime, getMagnitudeColorClass, getDistance } from './utils';

const App = () => {
    const [quakes, setQuakes] = useState([]);
    const [minMag, setMinMag] = useState(2.0);
    const [selectedContinent, setSelectedContinent] = useState('WORLDWIDE');
    const [loading, setLoading] = useState(true);
    const announcedIds = useRef(new Set()); // Persistent set of IDs already announced
    const [announcedQuake, setAnnouncedQuake] = useState(null);
    const [voices, setVoices] = useState([]);
    const isFirstFetch = useRef(true);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            console.log('Voices loaded:', availableVoices.length);
            setVoices(availableVoices);
        };
        loadVoices();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const triggerAnnouncement = useCallback((quake) => {
        setAnnouncedQuake(quake);

        // Sound alert
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.4;
        audio.play().catch(e => console.error('Audio play failed:', e));

        // Text-to-Speech (v2.0.0 Format)
        if ('speechSynthesis' in window) {
            const minutesAgo = Math.floor((Date.now() - quake.time) / 60000);
            const timeStr = minutesAgo <= 0 ? "just now" : `${minutesAgo} minutes`;

            // Extract "Country" or final region part (e.g., "Texas" from "Stanton, Texas")
            const placeParts = quake.place.split(',');
            const country = placeParts[placeParts.length - 1].trim();

            const messageText = `Attention. Magnitude ${quake.mag.toFixed(1)}. ${country}. ${timeStr} before.`;

            const message = new SpeechSynthesisUtterance(messageText);

            const voice = voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('en')) ||
                voices.find(v => v.lang.startsWith('en')) ||
                voices[0];

            if (voice) message.voice = voice;
            message.rate = 0.9;
            window.speechSynthesis.speak(message);
        }

        setTimeout(() => setAnnouncedQuake(null), 8000);
    }, [voices]);

    const fetchQuakes = useCallback(async () => {
        try {
            const results = await Promise.allSettled(
                Object.entries(SOURCES).map(async ([key, source]) => {
                    const response = await fetch(source.url);
                    const data = await response.json();

                    if (source.type === 'geojson') {
                        return data.features.map(f => {
                            const p = f.properties;
                            return {
                                id: f.id || p.unid || p.ids || Math.random(),
                                mag: p.mag,
                                place: p.place || p.flynn_region || 'Unknown Location',
                                time: new Date(p.time).getTime(),
                                lat: f.geometry.coordinates[1],
                                lon: f.geometry.coordinates[0],
                                sources: [key]
                            };
                        });
                    } else if (source.type === 'jma') {
                        return data.slice(0, 50).map(item => {
                            const mag = parseFloat(item.mag) || 0;
                            // Conversion from JMA coordinate string roughly if needed,
                            // but JMA usually provides it. For this sample we map known props.
                            return {
                                id: item.ctt + item.at,
                                mag: mag,
                                place: item.en_ttl || item.ttl,
                                time: new Date(item.at).getTime(),
                                lat: 36.0, // JMA feed is complex, simplified for demo
                                lon: 138.0,
                                sources: [key]
                            };
                        });
                    }
                    return [];
                })
            );

            let allEvents = [];
            results.forEach(res => {
                if (res.status === 'fulfilled') {
                    allEvents = [...allEvents, ...res.value];
                }
            });

            // Deduplication Logic
            const uniqueEvents = [];
            allEvents.sort((a, b) => b.mag - a.mag).forEach(event => {
                const duplicate = uniqueEvents.find(target => {
                    const timeDiff = Math.abs(event.time - target.time) / 1000;
                    const dist = getDistance(event.lat, event.lon, target.lat, target.lon);
                    return timeDiff < 90 && dist < 100;
                });

                if (duplicate) {
                    if (!duplicate.sources.includes(event.sources[0])) {
                        duplicate.sources.push(event.sources[0]);
                    }
                } else {
                    uniqueEvents.push(event);
                }
            });

            const finalEvents = uniqueEvents.sort((a, b) => b.time - a.time);
            setQuakes(finalEvents);
            setLoading(false);

            // Announcement logic: Announce ONLY new earthquakes
            const bounds = CONTINENTS[selectedContinent].bounds;
            const now = Date.now();
            const MAX_AGE = 15 * 60 * 1000; // 15 minutes

            const newQuakesToAnnounce = finalEvents.filter(q => {
                // 1. Must meet filters
                const meetsFilters = q.mag >= minMag && isWithinBounds(q.lat, q.lon, bounds);
                if (!meetsFilters) return false;

                // 2. Must be recent (prevent "800 minutes ago" announcements)
                if (now - q.time > MAX_AGE) return false;

                // 3. Must not have been announced (Spatial-Temporal Check)
                // We use a "Spatial Key" to handle cases where IDs change but it's the same quake
                // Rounded to 0.5 degrees and 2-minute windows
                const spatialKey = `${Math.round(q.lat * 2)}|${Math.round(q.lon * 2)}|${Math.floor(q.time / 120000)}|${q.mag.toFixed(1)}`;

                if (announcedIds.current.has(q.id) || announcedIds.current.has(spatialKey)) return false;

                q._spatialKey = spatialKey; // Temporary store for marking below
                return true;
            });

            if (isFirstFetch.current) {
                // On first load, mark all current quakes as "seen" to avoid announcing history
                newQuakesToAnnounce.forEach(q => {
                    announcedIds.current.add(q.id);
                    if (q._spatialKey) announcedIds.current.add(q._spatialKey);
                });
                isFirstFetch.current = false;
                return;
            }

            newQuakesToAnnounce.reverse().forEach((q, index) => {
                announcedIds.current.add(q.id);
                if (q._spatialKey) announcedIds.current.add(q._spatialKey);
                setTimeout(() => triggerAnnouncement(q), index * 4000);
            });

        } catch (error) {
            console.error('Error fetching quakes:', error);
        }
    }, [minMag, selectedContinent, triggerAnnouncement]);

    useEffect(() => {
        fetchQuakes();
        const interval = setInterval(fetchQuakes, 45000); // Poll every 45 seconds due to more sources
        return () => clearInterval(interval);
    }, [fetchQuakes]);

    const filteredQuakes = quakes.filter(q => {
        const bounds = CONTINENTS[selectedContinent].bounds;
        return q.mag >= minMag && isWithinBounds(q.lat, q.lon, bounds);
    });

    return (
        <div className="layout glass">
            <div className="sidebar">
                <div className="logo-area">
                    <div className="logo-icon">
                        <Activity color="white" size={24} />
                    </div>
                    <h1>QUAKE<span className="accent-text">ANN</span></h1>
                </div>

                <div className="control-group">
                    <div className="status-badge">
                        <div className="status-dot pulsing" />
                        LIVE: {Object.keys(SOURCES).length} NETWORKS
                    </div>
                </div>

                <div className="control-group">
                    <div className="control-label">
                        <Filter size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Min Magnitude: {minMag.toFixed(1)}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="9"
                        step="0.1"
                        value={minMag}
                        onChange={(e) => setMinMag(parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <div className="control-label">
                        <Globe size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Region
                    </div>
                    <select
                        value={selectedContinent}
                        onChange={(e) => setSelectedContinent(e.target.value)}
                    >
                        {Object.entries(CONTINENTS).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>
                </div>

                <div className="sidebar-footer">
                    <div className="glass-card" style={{ padding: '0.8rem', fontSize: '0.75rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            v2.0.0 Live Feed
                        </p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Live <span className="accent-text">Feed</span></h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Clock size={16} />
                        Today's Activity
                    </div>
                </div>

                <AnimatePresence>
                    {announcedQuake && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card announcing"
                            style={{ marginBottom: '2rem', background: 'rgba(255, 62, 62, 0.1)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <AlertTriangle color="#ff3e3e" size={32} />
                                <div>
                                    <h3 style={{ color: '#ff3e3e' }}>NEW ACTIVITY DETECTED</h3>
                                    <p>A magnitude {announcedQuake.mag} earthquake just occurred at {announcedQuake.place}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="earthquake-list">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Syncing with global sensors...
                        </div>
                    ) : filteredQuakes.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No earthquakes found matching filters.
                        </div>
                    ) : (
                        filteredQuakes.map(quake => (
                            <motion.div
                                layout
                                key={quake.id}
                                className="glass-card earthquake-item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className={`mag - badge ${getMagnitudeColorClass(quake.mag)} `}>
                                    {quake.mag.toFixed(1)}
                                </div>
                                <div className="item-info">
                                    <h4>{quake.place}</h4>
                                    <p>{quake.lat.toFixed(3)}, {quake.lon.toFixed(3)}</p>
                                    <div className="badge-list">
                                        {quake.sources.map(src => (
                                            <span key={src} className="source-badge">{src}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="item-time">
                                    {formatTime(quake.time)}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
