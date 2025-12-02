import React, { useRef, useEffect, useState } from 'react';
import {
    Activity,
    Zap,
    AlertTriangle,
    MapPin,
    Wrench,
    Layers,
    DollarSign,
    Truck,
    ShieldAlert,
    Globe,
    Navigation,
    CloudRain,
    TrendingUp,
    Droplet,
    Gauge,
    IndianRupee
} from 'lucide-react';

// --- MOCK FLEET DATA ENRICHED (INDIAN CONTEXT) ---
const FLEET_DATA = [
    {
        id: 'MH-12',
        model: 'Tata Prima 5530',
        driver: 'R. Kumar',
        driverScore: 92,
        status: 'CRITICAL',
        lat: 19.0760, // Mumbai
        lon: 72.8777,
        heading: 0,
        weather: 'STORM',
        route: { from: 'Mumbai', to: 'Delhi (NH48)', profitPerKm: 45.50 },
        telemetry: { rpm: 1250, speed: 0, fuelEff: 2.8, vibration: 'High', tripValue: 85000, tripProgress: 88, liquidity: 142000 },
        issues: [{ code: 'BS-VI ERR', component: 'AdBlue Dosing', cost: 12500 }]
    },
    {
        id: 'KA-01',
        model: 'Ashok Leyland 5525',
        driver: 'V. Singh',
        driverScore: 78,
        status: 'EARNING',
        lat: 12.9716, // Bangalore
        lon: 77.5946,
        heading: 45,
        weather: 'CLEAR',
        route: { from: 'Bangalore', to: 'Chennai', profitPerKm: 52.00 },
        telemetry: { rpm: 1400, speed: 65, fuelEff: 3.2, vibration: 'Normal', tripValue: 42000, tripProgress: 45, liquidity: 35000 },
        issues: []
    },
    {
        id: 'TN-09',
        model: 'BharatBenz 5528',
        driver: 'S. Reddy',
        driverScore: 98,
        status: 'EARNING',
        lat: 13.0827, // Chennai
        lon: 80.2707,
        heading: 270,
        weather: 'RAIN',
        route: { from: 'Chennai', to: 'Hyderabad', profitPerKm: 48.20 },
        telemetry: { rpm: 1350, speed: 58, fuelEff: 3.5, vibration: 'Normal', tripValue: 56000, tripProgress: 12, liquidity: 48000 },
        issues: []
    },
    {
        id: 'HR-55',
        model: 'Eicher Pro 6055',
        driver: 'A. Yadav',
        driverScore: 85,
        status: 'IDLE',
        lat: 28.7041, // Delhi
        lon: 77.1025,
        heading: 0,
        weather: 'CLEAR',
        route: { from: 'Gurgaon', to: 'Warehouse', profitPerKm: 0.00 },
        telemetry: { rpm: 600, speed: 0, fuelEff: 0.0, vibration: 'Normal', tripValue: 0, tripProgress: 0, liquidity: 5000 },
        issues: []
    }
];

const SentinelDashboard = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // VIEW STATE
    const [viewMode, setViewMode] = useState('MAP');
    const [mapFilter, setMapFilter] = useState('STATUS');
    const [activeTruckId, setActiveTruckId] = useState(null);
    const [sentinelMode, setSentinelMode] = useState(false);

    // Derived state
    const activeTruckData = FLEET_DATA.find(t => t.id === activeTruckId) || FLEET_DATA[0];
    const totalFloat = FLEET_DATA.reduce((acc, curr) => acc + curr.telemetry.liquidity, 0);

    // Format INR Helper
    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    // --- CANVAS ANIMATION ENGINE ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // --- RENDER HELPERS ---

        // Draw Digital Twin (Single Vehicle)
        const renderTwin = (ctx, w, h, time) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // 1. Dynamic Background based on speed
            const speedFactor = activeTruckData.telemetry.speed / 80;
            const gridSize = 40;
            const offset = (time * (20 + speedFactor * 50)) % gridSize;

            ctx.beginPath();
            ctx.strokeStyle = sentinelMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 153, 51, 0.1)'; // Saffron hint for India context? Keeping standard tech colors for now but slight warmth.
            ctx.lineWidth = 1;

            // Perspective floor
            for (let x = 0; x <= w; x += gridSize) {
                ctx.moveTo(x, 0); ctx.lineTo(x, h);
            }
            for (let y = offset; y <= h; y += gridSize) {
                ctx.moveTo(0, y); ctx.lineTo(w, y);
            }
            ctx.stroke();

            // 2. Draw Truck Profile
            ctx.save();
            ctx.translate(centerX - 100, centerY);
            const bounce = activeTruckData.telemetry.speed > 0 ? Math.sin(time * 12) * 2 : 0;
            ctx.translate(0, bounce);

            const isCritical = activeTruckData.status === 'CRITICAL';
            const mainColor = sentinelMode || isCritical ? '#ef4444' : '#10b981';
            const glowColor = sentinelMode || isCritical ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)';

            ctx.strokeStyle = mainColor;
            ctx.lineWidth = 2;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15;
            ctx.lineJoin = 'round';

            ctx.beginPath();
            // Simple Truck Shape (COE - Cab Over Engine style common in India)
            ctx.moveTo(60, 40); ctx.lineTo(160, 40); ctx.lineTo(160, -60); // Flat front for Tata/Leyland style
            ctx.lineTo(60, -60); ctx.lineTo(60, 40);

            // Wheels
            const drawWheel = (x, y) => {
                ctx.moveTo(x + 15, y);
                ctx.arc(x, y, 15, 0, Math.PI * 2);
            };
            drawWheel(80, 40); drawWheel(140, 40);

            // Trailer
            ctx.moveTo(40, 20); ctx.lineTo(60, 20);
            ctx.moveTo(-140, -50); ctx.lineTo(40, -50); ctx.lineTo(40, 40);
            ctx.lineTo(-140, 40); ctx.lineTo(-140, -50);
            drawWheel(-100, 40); drawWheel(-70, 40);

            ctx.stroke();

            // Wheel Spin
            if (activeTruckData.telemetry.speed > 0) {
                const drawSpokes = (wx, wy) => {
                    ctx.save();
                    ctx.translate(wx, wy);
                    ctx.rotate(time * (5 + speedFactor * 5));
                    ctx.beginPath();
                    ctx.moveTo(0, -12); ctx.lineTo(0, 12);
                    ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
                    ctx.strokeStyle = mainColor;
                    ctx.stroke();
                    ctx.restore();
                };
                drawSpokes(80, 40); drawSpokes(140, 40);
                drawSpokes(-100, 40); drawSpokes(-70, 40);
            }
            ctx.restore();

            // 3. Alerts
            if (sentinelMode || isCritical) {
                const pulse = (Math.sin(time * 4) + 1) / 2;
                const engineX = centerX + 40;
                const engineY = centerY;

                ctx.beginPath();
                ctx.arc(engineX, engineY, 20 + (pulse * 20), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(239, 68, 68, ${0.5 - (pulse * 0.5)})`;
                ctx.fill();

                if (isCritical) {
                    ctx.font = 'bold 14px monospace';
                    ctx.fillStyle = '#ef4444';
                    ctx.fillText(`⚠️ ${activeTruckData.issues[0]?.code || 'ERROR'}`, engineX + 50, engineY - 60);
                }
            }
        };

        // Draw Fleet Map (India View)
        const renderMap = (ctx, w, h, time) => {
            // 1. Draw Static Map Grid
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
            ctx.lineWidth = 1;
            const cellSize = 60;

            ctx.beginPath();
            for (let x = 0; x < w; x += cellSize) {
                ctx.moveTo(x, 0); ctx.lineTo(x, h);
            }
            for (let y = 0; y < h; y += cellSize) {
                ctx.moveTo(0, y); ctx.lineTo(w, y);
            }
            ctx.stroke();

            // 2. Plot Vehicles & Routes (India Coordinates)
            // Approximate India Bounds for projection
            const latMin = 8.0, latMax = 32.0;
            const lonMin = 68.0, lonMax = 88.0;

            FLEET_DATA.forEach(truck => {
                const x = ((truck.lon - lonMin) / (lonMax - lonMin)) * w;
                const y = h - ((truck.lat - latMin) / (latMax - latMin)) * h;

                const isSelected = activeTruckId === truck.id;

                // COLOR LOGIC based on Filter
                let color = '#10b981'; // Default Green
                let glowColor = 'rgba(16, 185, 129, 0.1)';

                if (mapFilter === 'STATUS') {
                    color = truck.status === 'CRITICAL' ? '#ef4444' : (truck.status === 'IDLE' ? '#94a3b8' : '#10b981');
                } else if (mapFilter === 'PROFIT') {
                    // Profit Heatmap (INR values)
                    const profit = truck.route.profitPerKm;
                    color = profit > 50 ? '#fbbf24' : (profit > 40 ? '#10b981' : '#ef4444');
                    glowColor = color;
                } else if (mapFilter === 'WEATHER') {
                    color = truck.weather === 'STORM' ? '#ef4444' : (truck.weather === 'RAIN' ? '#3b82f6' : '#94a3b8');
                }

                // Draw Route Line (Trail)
                if (truck.status !== 'IDLE') {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - 20, y + 10); // Simulated trail
                    ctx.strokeStyle = `rgba(255,255,255,0.1)`;
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Draw Pulse
                const pulseSize = 5 + Math.sin(time * 2 + truck.id) * 3;
                ctx.beginPath();
                ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
                ctx.fillStyle = mapFilter === 'PROFIT' ? color : glowColor;
                ctx.globalAlpha = 0.3;
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Draw Dot
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Draw Selection Ring
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, Math.PI * 2);
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Label
                ctx.fillStyle = isSelected ? '#fff' : '#64748b';
                ctx.font = isSelected ? 'bold 12px monospace' : '10px monospace';
                ctx.fillText(truck.id, x + 10, y + 4);

                // Context Label (Profit/Weather)
                if (mapFilter === 'PROFIT' && truck.route.profitPerKm > 0) {
                    ctx.fillStyle = '#fbbf24';
                    ctx.fillText(`₹${truck.route.profitPerKm}/km`, x + 10, y + 16);
                }
                if (mapFilter === 'WEATHER' && truck.weather !== 'CLEAR') {
                    ctx.fillStyle = truck.weather === 'STORM' ? '#ef4444' : '#3b82f6';
                    ctx.fillText(truck.weather, x + 10, y + 16);
                }
            });
        };

        // --- MAIN RENDER LOOP ---
        const render = () => {
            time += 0.05;
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            if (viewMode === 'MAP') {
                renderMap(ctx, w, h, time);
            } else {
                renderTwin(ctx, w, h, time);
            }

            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [viewMode, activeTruckId, sentinelMode, activeTruckData, mapFilter]);

    // --- HANDLERS ---
    const handleTruckSelect = (id) => {
        setActiveTruckId(id);
        setViewMode('TWIN');
    };

    const handleBackToMap = () => {
        setViewMode('MAP');
        setActiveTruckId(null);
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#0B0F19] text-slate-200 font-sans overflow-hidden selection:bg-emerald-500/30">

            {/* --- TOP BAR --- */}
            <header className="h-16 flex-none border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur z-20 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                        <span className="font-bold text-[#0B0F19] text-xl">S</span>
                    </div>
                    <div>
                        <h1 className="font-bold tracking-wider text-lg leading-none">SENTINEL <span className="text-orange-500">INDIA</span></h1>
                        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Logistics OS v4.0</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Current View Indicator */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-400">
                        {viewMode === 'MAP' ? <Globe size={14} /> : <Truck size={14} />}
                        <span>MODE: {viewMode}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Available Float</div>
                            <div className="text-2xl font-bold font-mono text-white leading-none">{formatINR(totalFloat)}</div>
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Zap size={18} fill="currentColor" />
                            <span className="hidden sm:inline">Instant Pay-Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT SIDEBAR: FLEET LIST */}
                <aside className="w-80 flex-none border-r border-slate-800 bg-[#0F1420] flex flex-col z-10">
                    <div className="p-4 border-b border-slate-800 space-y-3">
                        {/* Fleet Overview Button */}
                        <button
                            onClick={handleBackToMap}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded border transition-all ${viewMode === 'MAP' ? 'bg-slate-700 border-slate-500 text-white shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                        >
                            <Globe size={16} />
                            <span className="text-sm font-bold">All India Map</span>
                        </button>

                        {/* MAP FILTERS */}
                        {viewMode === 'MAP' && (
                            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                                <button
                                    onClick={() => setMapFilter('STATUS')}
                                    className={`text-[10px] py-1 rounded font-bold transition-colors ${mapFilter === 'STATUS' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    STATUS
                                </button>
                                <button
                                    onClick={() => setMapFilter('PROFIT')}
                                    className={`text-[10px] py-1 rounded font-bold transition-colors ${mapFilter === 'PROFIT' ? 'bg-emerald-900/50 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    PROFIT
                                </button>
                                <button
                                    onClick={() => setMapFilter('WEATHER')}
                                    className={`text-[10px] py-1 rounded font-bold transition-colors ${mapFilter === 'WEATHER' ? 'bg-blue-900/50 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    WEATHER
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <div className="px-2 py-2 text-[10px] font-mono text-slate-500 uppercase">Vehicles ({FLEET_DATA.length})</div>

                        {FLEET_DATA.map((truck) => (
                            <div
                                key={truck.id}
                                onClick={() => handleTruckSelect(truck.id)}
                                className={`p-3 rounded border cursor-pointer transition-all group relative overflow-hidden ${activeTruckId === truck.id
                                        ? 'bg-slate-800 border-slate-500 shadow-lg'
                                        : 'bg-[#161b28] border-transparent hover:border-slate-700 hover:bg-slate-800/50'
                                    }`}
                            >
                                {/* Status Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${truck.status === 'CRITICAL' ? 'bg-red-500' :
                                        truck.status === 'EARNING' ? 'bg-emerald-500' : 'bg-slate-500'
                                    }`}></div>

                                <div className="pl-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm text-white flex items-center gap-2">
                                            {truck.id} {truck.model}
                                        </span>
                                        {truck.weather === 'STORM' && <CloudRain size={14} className="text-blue-400" />}
                                        {truck.status === 'CRITICAL' && <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        {truck.status === 'EARNING' ? (
                                            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-900/30 px-1 rounded border border-emerald-900">
                                                ₹{truck.route.profitPerKm}/km
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-mono text-slate-500">IDLE</div>
                                        )}
                                        <div className="text-[10px] text-slate-400">{truck.driver}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* CENTER: CANVAS AREA */}
                <main className="flex-1 relative flex flex-col bg-[#0B0F19]">

                    {/* Canvas Container */}
                    <div ref={containerRef} className="flex-1 relative overflow-hidden cursor-crosshair">
                        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

                        {/* --- MAP VIEW OVERLAYS --- */}
                        {viewMode === 'MAP' && (
                            <div className="absolute top-6 left-6 pointer-events-none">
                                <div className="bg-[#0B0F19]/80 backdrop-blur border border-slate-700 p-4 rounded max-w-xs">
                                    <div className="text-[10px] text-emerald-400 font-bold uppercase mb-2 flex items-center gap-2">
                                        {mapFilter === 'PROFIT' ? <TrendingUp size={14} /> : <Activity size={14} />}
                                        {mapFilter === 'PROFIT' ? 'Profit Heatmap' : 'Pan-India Ops'}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-300">
                                            <span>Active / Earning</span>
                                            <span className="font-mono text-emerald-400">3 Units</span>
                                        </div>
                                        {mapFilter === 'PROFIT' && (
                                            <div className="flex justify-between text-xs text-slate-300">
                                                <span>Avg Profit/km</span>
                                                <span className="font-mono text-yellow-400">₹48.5</span>
                                            </div>
                                        )}
                                        <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full w-[75%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- DIGITAL TWIN OVERLAYS --- */}
                        {viewMode === 'TWIN' && (
                            <>
                                {/* Heads Up Financials */}
                                <div className="absolute top-6 left-6 flex gap-4 pointer-events-none">
                                    <div className="bg-[#0B0F19]/80 backdrop-blur border border-slate-700 p-4 rounded min-w-[140px]">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Trip Value</div>
                                        <div className="text-xl text-white font-mono">{formatINR(activeTruckData.telemetry.tripValue)}</div>
                                    </div>
                                    <div className="bg-[#0B0F19]/80 backdrop-blur border border-emerald-500/30 p-4 rounded min-w-[140px]">
                                        <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Profit / km</div>
                                        <div className="text-xl text-white font-mono">₹{activeTruckData.route.profitPerKm}</div>
                                    </div>
                                </div>

                                {/* Driver Scorecard Overlay */}
                                <div className="absolute top-6 right-6 pointer-events-none text-right">
                                    <div className="bg-[#0B0F19]/80 backdrop-blur border border-slate-700 p-4 rounded mb-2">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Driver Performance</div>
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="text-right">
                                                <div className="text-sm text-white font-bold">{activeTruckData.driver}</div>
                                                <div className="text-[10px] text-slate-400">Safety Score</div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${activeTruckData.driverScore > 90 ? 'border-emerald-500 text-emerald-500' : (activeTruckData.driverScore > 80 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500')}`}>
                                                {activeTruckData.driverScore}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Diagnostic Toggle */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                    <button
                                        onClick={() => setSentinelMode(!sentinelMode)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs tracking-wide border transition-all duration-300 ${sentinelMode
                                                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                                : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400'
                                            }`}
                                    >
                                        <Layers size={14} />
                                        {sentinelMode ? 'DIAGNOSTIC MODE: ACTIVE' : 'ACTIVATE DIAGNOSTICS'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* BOTTOM TELEMETRY STRIP */}
                    <div className="h-32 border-t border-slate-800 bg-[#0F1420] grid grid-cols-4 divide-x divide-slate-800">
                        {viewMode === 'MAP' ? (
                            // Map Footer
                            <div className="col-span-4 p-4 flex items-center justify-between px-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-full text-slate-400"><Navigation size={20} /></div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Fleet Command</div>
                                        <div className="text-xs text-slate-500">Hub: Nhava Sheva</div>
                                    </div>
                                </div>
                                <div className="flex gap-12">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase">Est. Revenue</div>
                                        <div className="text-lg font-mono text-emerald-400">{formatINR(1850000)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase">Fuel Cost</div>
                                        <div className="text-lg font-mono text-red-400">-{formatINR(620000)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase">Net Profit</div>
                                        <div className="text-lg font-mono text-white">{formatINR(1230000)}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Digital Twin Footer
                            <>
                                <div className="p-4 flex flex-col justify-center">
                                    <div className="text-[10px] text-slate-500 uppercase mb-2">Engine Load</div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(activeTruckData.telemetry.rpm / 2500) * 100}%` }}></div>
                                    </div>
                                    <div className="text-right font-mono text-xs text-emerald-400">{activeTruckData.telemetry.rpm} RPM</div>
                                </div>
                                <div className="p-4 flex flex-col justify-center">
                                    <div className="text-[10px] text-slate-500 uppercase mb-1">Fuel Efficiency</div>
                                    <div className="flex items-center gap-2">
                                        <Droplet size={16} className="text-blue-500" />
                                        <div className="text-lg font-mono text-white">{activeTruckData.telemetry.fuelEff} <span className="text-sm text-slate-500">km/l</span></div>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col justify-center">
                                    <div className="text-[10px] text-slate-500 uppercase mb-1">Speed</div>
                                    <div className="text-lg font-mono text-white">{activeTruckData.telemetry.speed} <span className="text-sm text-slate-500">km/h</span></div>
                                </div>
                                <div className="p-4 flex flex-col justify-center bg-slate-900/50">
                                    <div className="text-[10px] text-slate-500 uppercase mb-1">Route Status</div>
                                    <div className="text-sm font-mono text-white">
                                        {activeTruckData.route.from} → {activeTruckData.route.to}
                                    </div>
                                    <div className="text-xs text-emerald-400 mt-1">On Schedule</div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* RIGHT SIDEBAR: ACTION CENTER */}
                <aside className="w-80 flex-none border-l border-slate-800 bg-[#0F1420] p-6 flex flex-col z-10">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap size={14} /> FinOps Console
                    </h2>

                    {viewMode === 'MAP' ? (
                        // Map View Actions
                        <div className="bg-[#0B0F19] border border-slate-700 rounded-lg p-5 mb-4">
                            <h3 className="text-white font-bold text-sm mb-2">Working Capital</h3>
                            <p className="text-xs text-slate-400 mb-4">Liquidity available from verified trips.</p>
                            <div className="space-y-2 mb-4">
                                {FLEET_DATA.filter(t => t.status === 'EARNING').map(t => (
                                    <div key={t.id} className="flex justify-between text-xs bg-[#161b28] p-2 rounded">
                                        <span className="text-slate-300">{t.id}</span>
                                        <span className="font-mono text-emerald-400">+{formatINR(t.telemetry.liquidity)}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors">
                                Unlock {formatINR(totalFloat)}
                            </button>
                        </div>
                    ) : (
                        // Single Truck Actions
                        activeTruckData.status === 'CRITICAL' ? (
                            /* REPAIR CARD */
                            <div className="bg-[#0B0F19] border border-red-500/50 rounded-lg p-5 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-2 bg-red-900/30 rounded text-red-500"><AlertTriangle size={20} /></div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-red-400 font-bold uppercase">Breakdown Prevent</div>
                                        <div className="text-xs text-red-300">Active Fault</div>
                                    </div>
                                </div>

                                <h3 className="text-white font-bold text-sm mb-1">{activeTruckData.issues[0]?.component || 'Unknown'}</h3>
                                <p className="text-xs text-slate-400 mb-4">{activeTruckData.issues[0]?.code} detected.</p>

                                <div className="bg-[#161b28] rounded p-3 mb-4 border border-slate-800">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Est. Cost:</span>
                                        <span className="text-white font-mono">{formatINR(activeTruckData.issues[0]?.cost)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Repair Credit:</span>
                                        <span className="text-emerald-400 font-mono">APPROVED</span>
                                    </div>
                                </div>

                                <button className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Wrench size={14} />
                                    Pay Service Center
                                </button>
                            </div>
                        ) : (
                            /* EARNING CARD */
                            <div className="bg-gradient-to-br from-emerald-900/20 to-[#0B0F19] border border-emerald-500/30 rounded-lg p-5 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-900/30 rounded text-emerald-500"><IndianRupee size={20} /></div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-emerald-400 font-bold uppercase">Margin Analysis</div>
                                        <div className="text-xs text-emerald-300">High Profit Route</div>
                                    </div>
                                </div>

                                <div className="mb-4 space-y-1">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Rate:</span>
                                        <span className="text-white font-mono">₹62/km</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Fuel:</span>
                                        <span className="text-red-400 font-mono">-₹18/km</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                                        <span>Net Profit:</span>
                                        <span className="text-emerald-400 font-mono">₹44/km</span>
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/20">
                                    <Zap size={14} fill="currentColor" />
                                    Advance {formatINR(activeTruckData.telemetry.tripValue * 0.5)}
                                </button>
                            </div>
                        )
                    )}

                    <div className="mt-auto border-t border-slate-800 pt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">RS</div>
                            <div>
                                <div className="text-xs text-white font-bold">Account Manager</div>
                                <div className="text-[10px] text-slate-500">Rahul S. • Active now</div>
                            </div>
                        </div>
                        <button className="w-full border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs py-2 rounded transition-colors">
                            Contact Support
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SentinelDashboard;