import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Activity,
    Cpu,
    AlertTriangle,
    ArrowRight,
    Zap,
    FileText,
    Menu,
    X,
    Crosshair,
    Database,
    Wifi,
    Hexagon,
    ScanLine,
    Disc,
    Layers,
    Settings,
    Maximize2,
    Radar,
    Target,
    Wrench,
    Search,
    ShieldCheck,
    Banknote,
    TrendingUp,
    Clock,
    Truck,
    BarChart3
} from 'lucide-react';

// --- UTILS & HOOKS ---

const useDataStream = () => {
    const [stream, setStream] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            const newData = {
                id: Math.random(),
                code: `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`,
                val: Math.floor(Math.random() * 100) + '%',
                metric: ['PTO_ENGAGED', 'INJECTOR_PULSE', 'THERMAL_LOAD', 'NOX_LEVEL', 'RPM_VARIANCE'][Math.floor(Math.random() * 5)]
            };
            setStream(prev => [newData, ...prev.slice(0, 6)]);
        }, 600);
        return () => clearInterval(interval);
    }, []);
    return stream;
};

const useTypewriter = (text, speed = 50) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(timer);
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);
    return displayedText;
};

const HUDCorner = ({ className = "" }) => (
    <div className={`absolute w-4 h-4 border-orange-500/50 ${className}`} />
);

// --- COMPACT X-RAY SCANNER (MACK STYLE) ---
const TruckXRayScanner = () => {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [activeSystem, setActiveSystem] = useState(null);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePos({ x, y });

            if (x > 10 && x < 30 && y > 45 && y < 70) setActiveSystem('ENGINE');
            else if (x > 65 && x < 85 && y > 65 && y < 90) setActiveSystem('REAR_AXLE');
            else if (x > 32 && x < 45 && y > 25 && y < 50) setActiveSystem('ECU_MAIN');
            else if (x > 32 && x < 45 && y > 65 && y < 85) setActiveSystem('FUEL_CELL');
            else if (x > 50 && x < 60 && y > 65 && y < 80) setActiveSystem('PNEUMATICS');
            else setActiveSystem(null);
        }
    };

    const systems = {
        ENGINE: { label: "MACK_MP8_CORE", val: "94°C", color: "#f97316", id: "SYS-01" },
        REAR_AXLE: { label: "AXLE_LOAD_B", val: "9.1T", color: "#10b981", id: "SYS-02" },
        ECU_MAIN: { label: "V-MAC_IV_ECU", val: "LINK_OK", color: "#3b82f6", id: "SYS-03" },
        FUEL_CELL: { label: "INJECT_RATE", val: "14L/H", color: "#ec4899", id: "SYS-04" },
        PNEUMATICS: { label: "BRAKE_AIR", val: "125 PSI", color: "#eab308", id: "SYS-05" }
    };

    const currentData = activeSystem ? systems[activeSystem] : { label: "SYSTEM_SCAN...", val: "--", color: "#444", id: "---" };

    return (
        <div className="w-full flex flex-col xl:flex-row gap-0 items-stretch justify-center border border-white/10 bg-[#020202] max-w-4xl">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative w-full h-[300px] xl:h-[350px] overflow-hidden group cursor-none select-none flex-grow"
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none opacity-30">
                    <svg viewBox="0 0 500 300" className="w-full h-full fill-none stroke-white stroke-1" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <pattern id="wirehatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <path d="M -1,2 l 6,0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <line x1="0" y1="260" x2="500" y2="260" strokeDasharray="10 5" opacity="0.5" />
                        <path d="M 40 160 L 40 120 L 140 110 L 160 80" strokeWidth="1.5" />
                        <path d="M 40 160 L 40 200 L 80 210" strokeWidth="1.5" />
                        <path d="M 40 130 L 140 130" opacity="0.5" />
                        <rect x="35" y="130" width="10" height="60" fill="url(#wirehatch)" />
                        <path d="M 160 80 L 260 80 L 260 200 L 160 200" strokeWidth="1.5" />
                        <path d="M 160 80 L 160 200" strokeWidth="1" />
                        <path d="M 170 90 L 250 90 L 250 130 L 170 130 Z" opacity="0.6" />
                        <path d="M 170 140 L 250 140 L 250 190 L 170 190 Z" strokeDasharray="2 2" opacity="0.4" />
                        <path d="M 270 200 L 270 40" strokeWidth="2" />
                        <path d="M 275 200 L 275 40" strokeWidth="2" />
                        <path d="M 270 40 L 275 40" />
                        <path d="M 80 210 L 480 210 L 480 230 L 140 230" strokeWidth="1.5" />
                        <g>
                            <circle cx="110" cy="240" r="30" strokeWidth="1.5" />
                            <circle cx="110" cy="240" r="18" strokeDasharray="2 2" opacity="0.6" />
                            <circle cx="110" cy="240" r="6" fill="rgba(255,255,255,0.2)" />
                            <circle cx="380" cy="240" r="30" strokeWidth="1.5" />
                            <circle cx="380" cy="240" r="18" strokeDasharray="2 2" opacity="0.6" />
                            <circle cx="450" cy="240" r="30" strokeWidth="1.5" />
                            <circle cx="450" cy="240" r="18" strokeDasharray="2 2" opacity="0.6" />
                        </g>
                    </svg>
                </div>
                <div
                    className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none will-change-[clip-path]"
                    style={{
                        clipPath: `circle(100px at ${mousePos.x}% ${mousePos.y}%)`,
                        background: 'radial-gradient(circle at center, rgba(20,20,20,0.95), rgba(0,0,0,0.8))'
                    }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30"></div>
                    <svg viewBox="0 0 500 300" className="w-full h-full fill-none" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(60, 150)">
                            <path d="M 0 0 L 80 0 L 85 50 L -5 50 Z" stroke="#f97316" strokeWidth="2" fill="rgba(249,115,22,0.1)" />
                            <rect x="0" y="-5" width="80" height="10" stroke="#f97316" fill="#f97316" fillOpacity="0.3" />
                            <line x1="-5" y1="5" x2="-5" y2="45" stroke="#f97316" strokeWidth="2" className="animate-spin-slow" />
                            <circle cx="85" cy="20" r="10" stroke="#f97316" strokeDasharray="2 2" className="animate-spin-slow" />
                        </g>
                        <path d="M 150 160 L 200 170 L 200 190 L 150 200 Z" stroke="white" fill="rgba(255,255,255,0.1)" />
                        <line x1="200" y1="180" x2="380" y2="210" stroke="white" strokeWidth="3" strokeDasharray="4 4" opacity="0.6" className="animate-pulse" />
                        <g>
                            <circle cx="380" cy="240" r="28" stroke="#10b981" strokeWidth="2" strokeDasharray="8 4" className="animate-[spin_4s_linear_infinite]" />
                            <circle cx="450" cy="240" r="28" stroke="#10b981" strokeWidth="2" strokeDasharray="8 4" className="animate-[spin_4s_linear_infinite]" />
                            <circle cx="380" cy="240" r="8" fill="#10b981" opacity="0.5" />
                            <circle cx="450" cy="240" r="8" fill="#10b981" opacity="0.5" />
                            <path d="M 350 200 Q 415 180 480 200" stroke="#10b981" strokeWidth="1.5" fill="none" />
                        </g>
                        <g>
                            <circle cx="110" cy="240" r="28" stroke="#eab308" strokeWidth="2" strokeDasharray="8 4" className="animate-[spin_4s_linear_infinite]" />
                            <rect x="100" y="190" width="15" height="30" stroke="#eab308" fill="none" />
                        </g>
                        <g transform="translate(180, 110)">
                            <rect width="40" height="25" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(59,130,246,0.1)" />
                            <line x1="5" y1="5" x2="20" y2="5" stroke="#3b82f6" />
                            <circle cx="30" cy="12" r="4" stroke="#3b82f6" strokeDasharray="2 2" className="animate-spin-slow" />
                            <path d="M 20 25 L 20 60 L 40 80" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
                        </g>
                        <g transform="translate(170, 215)">
                            <rect width="70" height="25" rx="5" stroke="#ec4899" strokeWidth="2" fill="rgba(236,72,153,0.1)" />
                            <path d="M 15 0 L 15 25 M 55 0 L 55 25" stroke="#ec4899" opacity="0.5" />
                            <text x="25" y="16" fill="#ec4899" fontSize="6" fontFamily="monospace">DIESEL</text>
                        </g>
                        <g transform="translate(260, 220)">
                            <rect width="20" height="10" rx="3" stroke="#eab308" />
                            <rect x="25" y="0" width="20" height="10" rx="3" stroke="#eab308" />
                        </g>
                    </svg>
                </div>
                <div
                    className="absolute pointer-events-none transition-transform duration-75 ease-out z-50"
                    style={{
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className={`w-[180px] h-[180px] border border-white/20 rounded-full flex items-center justify-center relative transition-all duration-300 ${activeSystem ? 'border-orange-500/50 scale-95' : 'animate-[spin_12s_linear_infinite]'}`}>
                        <div className="absolute top-0 w-[1px] h-[10px] bg-white/50"></div>
                        <div className="absolute bottom-0 w-[1px] h-[10px] bg-white/50"></div>
                        <div className="absolute left-0 w-[10px] h-[1px] bg-white/50"></div>
                        <div className="absolute right-0 w-[10px] h-[1px] bg-white/50"></div>
                    </div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${activeSystem ? 'w-6 h-6 border-2 border-orange-500 rotate-45' : 'w-1.5 h-1.5 bg-white rounded-full'}`}></div>
                    {activeSystem && (
                        <div className="absolute top-[-110px] left-0 bg-orange-500 text-black text-[9px] font-bold px-2 py-1 font-mono animate-in fade-in slide-in-from-bottom-2">
                            LOCKED: {activeSystem}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full xl:w-[250px] min-w-[220px] border-l border-white/10 bg-[#050505] relative flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2 text-orange-500">
                        <Radar className="animate-spin-slow" size={14} />
                        <span className="text-[10px] font-bold tracking-widest">LIVE_FEED</span>
                    </div>
                    <div className="text-[8px] text-gray-500 font-mono">ID: {currentData.id}</div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center relative overflow-hidden">
                    {activeSystem && (
                        <div className="absolute left-0 top-1/2 w-8 h-[1px] bg-orange-500 transition-all duration-300 origin-left animate-in slide-in-from-left"></div>
                    )}
                    <div className="space-y-4 relative z-10">
                        <div className="space-y-1">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">TARGET_SYSTEM</div>
                            <div className="text-lg font-bold font-mono tracking-tighter transition-colors duration-300" style={{ color: currentData.color }}>
                                {currentData.label}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">METRIC_VALUE</div>
                            <div className="text-3xl font-bold text-white font-mono tracking-tight">
                                {currentData.val}
                            </div>
                        </div>
                        <div className="space-y-1 pt-2">
                            <div className="flex justify-between text-[8px] text-gray-600 font-mono uppercase">
                                <span>Signal</span>
                                <span>100%</span>
                            </div>
                            <div className="w-full h-8 flex items-end gap-[1px]">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-white/5 transition-all duration-100 ease-in-out"
                                        style={{
                                            height: `${Math.random() * 100}%`,
                                            backgroundColor: activeSystem ? currentData.color : '#333',
                                            opacity: activeSystem ? 0.8 : 0.2
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 text-gray-800 opacity-20">
                        <Settings size={120} strokeWidth={0.5} />
                    </div>
                </div>
                <div className="p-3 border-t border-white/10 bg-black/50 text-[8px] text-gray-600 font-mono flex justify-between">
                    <span>SCANNER: <span className="text-green-500">ACTIVE</span></span>
                    <span>4ms</span>
                </div>
            </div>
        </div>
    );
};

const SentinelLanding = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [booted, setBooted] = useState(false);
    const dataStream = useDataStream();
    const subheadline = useTypewriter("Sentinel transforms raw combustion metrics into operational dominance.", 30);

    useEffect(() => {
        const timer = setTimeout(() => setBooted(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!booted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono text-orange-500 text-xs">
                <div className="space-y-2">
                    <div className="animate-pulse">INITIALIZING_KERNEL...</div>
                    <div className="animate-[pulse_1s_ease-in-out_0.2s]">LOADING_J1939_PROTOCOLS...</div>
                    <div className="animate-[pulse_1s_ease-in-out_0.4s]">ESTABLISHING_UPLINK...</div>
                    <div className="text-white mt-4">SYSTEM_READY_</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-mono selection:bg-orange-500 selection:text-black overflow-x-hidden relative">
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
            <div className="fixed inset-0 pointer-events-none z-[90] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white font-bold tracking-tighter text-xl uppercase select-none">
                        <Terminal size={20} className="text-orange-500 animate-pulse" />
                        Sentinel<span className="text-orange-500">Twin</span><span className="text-orange-500">_</span>
                    </div>

                    <div className="hidden md:flex items-center gap-12 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold">
                        <a href="#problem" className="hover:text-orange-500 transition-colors">01 // The_Bleed</a>
                        <a href="#solution" className="hover:text-orange-500 transition-colors">02 // The_Twin</a>
                        <a href="#advantage" className="hover:text-orange-500 transition-colors">03 // The_Advantage</a>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-8">
                            <Wifi size={14} className="text-emerald-500" />
                            <span className="text-emerald-500">ONLINE</span>
                        </div>
                    </div>

                    <div className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 p-6 flex flex-col gap-4 text-sm font-bold uppercase tracking-wider">
                        <a href="#problem" onClick={() => setIsMenuOpen(false)}>01 // The_Bleed</a>
                        <a href="#solution" onClick={() => setIsMenuOpen(false)}>02 // The_Twin</a>
                        <a href="#advantage" onClick={() => setIsMenuOpen(false)}>03 // The_Advantage</a>
                    </div>
                )}
            </nav>

            <section className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 perspective-[1000px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(60deg)_translateY(-100px)] animate-[grid-move_20s_linear_infinite]"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-3 text-orange-500 text-[10px] border border-orange-500/30 px-3 py-1 bg-orange-500/5 uppercase tracking-[0.2em]">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
                            <span>Secure_Uplink_Established</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.85] select-none">
                            SYNTHESIZING <br />
                            <span className="relative inline-block">
                                <span className="absolute -inset-1 bg-orange-500/20 blur-xl"></span>
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
                                    ENGINE DATA.
                                </span>
                            </span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed border-l-2 border-orange-500 pl-6 h-12 font-mono">
                            {subheadline}<span className="animate-pulse">_</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 pt-8">
                            <button className="bg-white text-black px-8 py-4 font-bold text-xs hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 group uppercase tracking-widest clip-path-slant">
                                Deploy_Sentinel
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border border-white/20 px-8 py-4 text-xs text-white hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-widest flex items-center justify-center gap-3 bg-transparent">
                                <Activity size={16} />
                                Live_Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center w-full">
                        <TruckXRayScanner />
                        <div className="absolute top-0 right-[-20px] md:right-[-50px] w-40 opacity-50 pointer-events-none hidden lg:block">
                            {dataStream.map((item) => (
                                <div key={item.id} className="text-[9px] font-mono text-gray-600 mb-1 text-right">
                                    {item.code}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 1: THE BLEED (REBUILT TO MATCH SCREENSHOT) --- */}
            <section id="problem" className="py-32 border-t border-white/10 bg-[#080808] relative">
                <div className="container mx-auto px-6">
                    <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                        <div>
                            <div className="text-orange-500 text-xs font-bold tracking-widest mb-2">SECTOR_ANALYSIS_01</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">The Bleed</h2>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm font-mono text-right">
                            CRITICAL_FAILURE_DETECTED: <br />
                            Reactive maintenance is an operational hemorrhage.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* --- UPDATED CARD 1: EXACT SCREENSHOT REPLICA --- */}
                        <div className="relative group p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col h-full">
                            {/* Custom Corner Accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500/30"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500/30"></div>

                            <div className="flex justify-between items-start mb-12">
                                <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center border border-white/10">
                                    <AlertTriangle className="text-red-500 w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <div className="text-[10px] text-gray-600 font-mono tracking-widest">ERR_CODE_001</div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">UNPREDICTED FAILURE</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-12 font-mono flex-grow">
                                Reactive repairs cost 3x more than predictive maintenance. One blown gasket kills a month's profit.
                            </p>

                            <div className="w-full h-px bg-white/10 mb-6 border-t border-dashed border-gray-700"></div>

                            <div className="font-mono text-xs tracking-widest uppercase text-red-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                LOSS: 15,000/INCIDENT
                            </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="relative group p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col h-full">
                            <HUDCorner className="top-0 left-0 border-t border-l" />
                            <HUDCorner className="top-0 right-0 border-t border-r" />
                            <HUDCorner className="bottom-0 left-0 border-b border-l" />
                            <HUDCorner className="bottom-0 right-0 border-b border-r" />

                            <div className="flex justify-between items-start mb-12">
                                <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center border border-white/10">
                                    <Clock className="text-yellow-500 w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <div className="text-[10px] text-gray-600 font-mono tracking-widest">ERR_CODE_002</div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">Unplanned Downtime</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-12 font-mono flex-grow">Every hour a truck sits idle due to breakdown is lost revenue that can never be recovered.</p>

                            <div className="w-full h-px bg-white/10 mb-6 border-t border-dashed border-gray-700"></div>

                            <div className="font-mono text-xs tracking-widest uppercase text-yellow-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                LOSS: ₹15K/DAY
                            </div>
                        </div>

                        {/* CARD 3 */}
                        <div className="relative group p-8 bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col h-full">
                            <HUDCorner className="top-0 left-0 border-t border-l" />
                            <HUDCorner className="top-0 right-0 border-t border-r" />
                            <HUDCorner className="bottom-0 left-0 border-b border-l" />
                            <HUDCorner className="bottom-0 right-0 border-b border-r" />

                            <div className="flex justify-between items-start mb-12">
                                <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center border border-white/10">
                                    <Activity className="text-blue-500 w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <div className="text-[10px] text-gray-600 font-mono tracking-widest">ERR_CODE_003</div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">Asset Degradation</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-12 font-mono flex-grow">Running engines to failure permanently shortens their lifespan and resale value.</p>

                            <div className="w-full h-px bg-white/10 mb-6 border-t border-dashed border-gray-700"></div>

                            <div className="font-mono text-xs tracking-widest uppercase text-blue-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                LIFE: -30%
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: THE TWIN (REBUILT AS TERMINAL FLOW) --- */}
            <section id="solution" className="py-32 border-t border-white/10 relative overflow-hidden bg-[#050505]">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">

                    {/* LEFT COLUMN: TERMINAL FLOWCHART */}
                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded p-1 shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-[#111] px-4 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="text-[10px] font-mono text-gray-600 uppercase">TERMINAL_ROOT</div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-12 space-y-12 bg-[#050505] min-h-[400px] flex flex-col justify-center relative">
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                            {/* Flow Step 1 */}
                            <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                                <div className="text-gray-500 w-32">INPUT_SOURCE</div>
                                <ArrowRight size={14} className="text-gray-700" />
                                <div className="w-40 px-3 py-1.5 border border-white/20 bg-white/5 text-gray-300 text-center">ECU_PORT_J1939</div>
                            </div>

                            {/* Flow Step 2 (With Mini Graph Attached) */}
                            <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                                <div className="text-gray-500 w-32">PROCESSING</div>
                                <ArrowRight size={14} className="text-gray-700" />
                                <div className="relative w-40">
                                    <div className="px-3 py-1.5 border border-orange-500/50 bg-orange-500/10 text-orange-500 animate-pulse text-center cursor-pointer relative z-20">SENTINEL_AI_CORE</div>

                                    {/* INJECTED MINI GRAPH (Connected) */}
                                    <div className="absolute top-1/2 left-full w-24 h-24 ml-8 -mt-12 border border-white/10 bg-black p-2 z-10 hidden lg:block">
                                        <div className="text-[8px] text-gray-500 mb-1 font-mono uppercase">PREDICTION_MODEL</div>
                                        {/* Connecting Line */}
                                        <svg className="absolute right-full top-1/2 w-8 h-20 -mt-10 pointer-events-none overflow-visible">
                                            <path d="M 32 40 L 0 40" stroke="#f97316" strokeWidth="1" fill="none" />
                                            <circle cx="32" cy="40" r="2" fill="#f97316" />
                                        </svg>
                                        {/* The Graph */}
                                        <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
                                            {/* Axes */}
                                            <line x1="0" y1="60" x2="100" y2="60" stroke="#333" strokeWidth="1" />
                                            <line x1="0" y1="0" x2="0" y2="60" stroke="#333" strokeWidth="1" />
                                            {/* Curve */}
                                            <path d="M 0 10 Q 40 10 70 40 L 90 55" stroke="#f97316" strokeWidth="1.5" fill="none" />
                                            <circle cx="70" cy="40" r="2" fill="#f97316" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Flow Step 3 */}
                            <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                                <div className="text-gray-500 w-32">OUTPUT</div>
                                <ArrowRight size={14} className="text-gray-700" />
                                <div className="w-40 px-3 py-1.5 border border-emerald-500/50 bg-emerald-500/10 text-emerald-500 text-center">VERIFIED_LIQUIDITY</div>
                            </div>

                            {/* Mock Bash Console */}
                            <div className="mt-12 pt-6 border-t border-white/10 font-mono text-[10px] text-gray-500 space-y-2 relative z-10">
                                <div className="absolute top-[-10px] right-0 bg-[#222] text-white px-1 text-[8px]">BASH</div>
                                <p><span className="text-blue-500">root@sentinel:~$</span> ./audit_trip --id=TRK-892</p>
                                <p>Analyzing telemetry packets...</p>
                                <p className="text-emerald-500">✔ PTO_ENGAGED: 04:12:00 (SIG_VERIFIED)</p>
                                <p className="text-emerald-500">✔ LOAD_DROP: CONFIRMED @ 12.9716° N</p>
                                <p className="text-white bg-white/10 inline-block px-1">STATUS: INVOICE_GENERATED #INV-2024-X9</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TEXT CONTENT */}
                    <div className="space-y-10">
                        <div className="text-orange-500 text-xs font-bold tracking-widest font-mono">TECHNOLOGY_STACK_02</div>
                        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter uppercase">The Digital Twin</h2>

                        <div className="text-xl text-white font-light">
                            We don't guess. <span className="border-b border-orange-500 pb-1">We measure the burn.</span>
                        </div>

                        <p className="text-gray-400 leading-relaxed max-w-md">
                            Legacy GPS trackers only know "Where". Sentinel knows "How". By plugging into the J1939 Engine Port, we capture fuel injection rates, cylinder pressure, and thermal stress in real-time.
                        </p>

                        <ul className="space-y-6 pt-4 text-sm text-gray-300 font-mono">
                            <li className="flex items-center gap-4 group">
                                <div className="w-8 h-px bg-white/20 group-hover:bg-orange-500 transition-colors"></div>
                                Predict breakdowns 72 hours in advance.
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="w-8 h-px bg-white/20 group-hover:bg-orange-500 transition-colors"></div>
                                Audit driver behavior against fuel burn.
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="w-8 h-px bg-white/20 group-hover:bg-orange-500 transition-colors"></div>
                                Verify work completion via PTO engagement.
                            </li>
                        </ul>
                    </div>

                </div>
            </section>

            {/* --- SECTION 3: THE ADVANTAGE --- */}
            <section id="advantage" className="py-32 border-t border-white/10 bg-[#080808] relative">
                <div className="container mx-auto px-6">
                    <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                        <div>
                            <div className="text-orange-500 text-xs font-bold tracking-widest mb-2">SECTOR_ANALYSIS_01</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">The Advantage</h2>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm font-mono text-right">
                            OPERATIONAL_IMPACT: <br />
                            Shifting from reactive chaos to predictive dominance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Clock className="text-emerald-500" />,
                                title: "Longer Availability",
                                desc: "Eliminate unplanned downtime. Keep vehicles on the road, not in the shop.",
                                stat: "UPTIME: +15%",
                                color: "emerald"
                            },
                            {
                                icon: <Truck className="text-blue-500" />,
                                title: "More Days in Field",
                                desc: "Maximize asset utilization. Squeeze more revenue miles out of every truck.",
                                stat: "UTILIZATION: 92%",
                                color: "blue"
                            },
                            {
                                icon: <TrendingUp className="text-yellow-500" />,
                                title: "Higher Profitability",
                                desc: "Reduce maintenance costs by fixing small issues before they become big failures.",
                                stat: "MARGIN: +8%",
                                color: "yellow"
                            },
                            {
                                icon: <ShieldCheck className="text-orange-500" />,
                                title: "Asset Longevity",
                                desc: "Extend the operational lifespan of your fleet through precision health monitoring.",
                                stat: "LIFE: +3 YRS",
                                color: "orange"
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative group p-6 bg-[#050505] border border-white/10 hover:border-white/30 transition-all duration-500">
                                <HUDCorner className="top-0 left-0 border-t border-l" />
                                <HUDCorner className="top-0 right-0 border-t border-r" />
                                <HUDCorner className="bottom-0 left-0 border-b border-l" />
                                <HUDCorner className="bottom-0 right-0 border-b border-r" />

                                <div className="mb-6 flex justify-between items-start">
                                    <div className="p-3 bg-white/5 rounded-sm group-hover:bg-white/10 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-mono">KPI_{i}0{i + 1}</div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed mb-8 h-12">{item.desc}</p>

                                <div className={`pt-4 border-t border-dashed border-white/10 font-mono text-[10px] tracking-widest uppercase text-${item.color}-500 flex items-center gap-2`}>
                                    <div className={`w-2 h-2 bg-${item.color}-500 rounded-full animate-pulse`}></div>
                                    {item.stat}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-white/10 bg-black text-[10px] tracking-widest uppercase relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
                                <Terminal size={20} className="text-orange-500" />
                                Sentinel_
                            </div>
                            <p className="text-gray-500 leading-relaxed max-w-xs normal-case tracking-normal text-xs">
                                Bengaluru, India.<br />
                                Building the Intelligence Layer for Indian Logistics.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">System</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-orange-500 cursor-pointer">Status</li>
                                <li className="hover:text-orange-500 cursor-pointer">Changelog</li>
                                <li className="hover:text-orange-500 cursor-pointer">Documentation</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-orange-500 cursor-pointer">Privacy_Protocol</li>
                                <li className="hover:text-orange-500 cursor-pointer">Terms_Of_Service</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-600">© 2025 SENTINEL INDUSTRIES.</div>
                        <div className="flex items-center gap-4 font-mono text-gray-600">
                            <span>LAT: 12.9716° N</span>
                            <span>LON: 77.5946° E</span>
                            <span className="text-orange-500">SYS_VER_2.4.0</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SentinelLanding;