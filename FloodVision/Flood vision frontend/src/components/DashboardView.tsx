import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ThemeVariant } from '../types';
import { 
  MapPin, Droplets, Wind, Gauge, CloudLightning, 
  Activity, AlertTriangle, Cpu, Radio, ShieldAlert, 
  Navigation, BarChart3, Zap, Scan, Maximize2,
  ChevronRight, Thermometer, RefreshCw
} from 'lucide-react';

export default function DashboardView() {
  const { 
    sensorNodes, 
    aiRiskLevel, 
    systemStats,
    alerts,
    activeLayout,
    setView
  } = useAppStore();

  const isGlass = activeLayout === ThemeVariant.GLASSMORPHISM;
  const panelBase = isGlass 
    ? 'bg-[#0d1117]/60 backdrop-blur-xl border border-white/10' 
    : 'bg-[#141313] border border-white/5';

  // Weather State
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const MAPUSA_LAT = 15.5938;
  const MAPUSA_LNG = 73.8035;
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      
      if (!apiKey) {
        // Fallback mock weather for aesthetic presentation if no key
        setTimeout(() => {
          setWeather({
            main: { temp: 28.5, humidity: 82, feels_like: 31.2, pressure: 1008 },
            wind: { speed: 4.2 },
            weather: [{ description: 'moderate rain', icon: '10d' }]
          });
          setWeatherLoading(false);
        }, 800);
        return;
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MAPUSA_LAT}&lon=${MAPUSA_LNG}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API unreachable');
        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        setWeatherError(err.message);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiKey]);

  const criticalNodes = sensorNodes.filter(s => s.status === 'critical' || s.status === 'warning');
  
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative space-y-6 no-scrollbar text-white bg-[#05070a]">
      {/* Cinematic Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
      }}></div>

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">
        
        {/* HEADER: COMMAND NEXUS & WEATHER */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase font-sans">
                Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Command</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Online
              </span>
              <span>|</span>
              <span>T-Zero: {timeString}</span>
              <span>|</span>
              <span>Mapusa Sector Grid</span>
            </div>
          </div>

          {/* WEATHER WIDGET (Compact & Sleek) */}
          <div className={`${panelBase} rounded-2xl p-4 flex items-center justify-between gap-6 w-full xl:w-auto min-w-[350px] shadow-2xl relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {weatherLoading ? (
              <div className="w-full flex justify-center py-2"><RefreshCw className="h-6 w-6 animate-spin text-cyan-400" /></div>
            ) : weatherError ? (
              <div className="w-full text-center text-red-400 text-xs font-mono"><AlertTriangle className="inline w-4 h-4 mr-2"/>Weather Offline</div>
            ) : weather ? (
              <>
                <div className="flex items-center gap-4 z-10">
                  <div className="relative w-14 h-14 bg-black/40 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                      alt="Weather" 
                      className="w-16 h-16 absolute scale-125 drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="text-3xl font-black font-sans tracking-tighter leading-none">{Math.round(weather.main.temp)}°</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mt-1">
                      {weather.weather[0].description}
                    </div>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-white/10 z-10"></div>
                
                <div className="flex flex-col gap-2 z-10">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Droplets className="h-3 w-3 text-cyan-400" /> {weather.main.humidity}% HUM
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Wind className="h-3 w-3 text-teal-400" /> {weather.wind.speed} M/S
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </header>

        {/* MAIN 3-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMN 1: TELEMETRY & ALERTS (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* KPI: Active Nodes */}
            <div className={`${panelBase} p-5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-colors`}>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">IoT Network</p>
                <div className="text-3xl font-bold font-sans flex items-baseline gap-1">
                  {systemStats.activeNodes} <span className="text-sm font-normal text-slate-500">/ {systemStats.totalSensors}</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Radio className="h-6 w-6 text-cyan-400" />
              </div>
            </div>

            {/* Critical Nodes List */}
            <div className={`${panelBase} rounded-2xl flex-1 flex flex-col overflow-hidden`}>
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                <h3 className="font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4 text-red-500" /> Critical Vectors
                </h3>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono font-bold animate-pulse">
                  {criticalNodes.length} WARN
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar max-h-[400px]">
                {criticalNodes.map(node => (
                  <div key={node.id} className="bg-black/40 border border-white/5 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setView('sensors')}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold truncate pr-2">{node.location}</div>
                      <AlertTriangle className={`h-4 w-4 shrink-0 ${node.status === 'critical' ? 'text-red-500 animate-bounce' : 'text-yellow-500'}`} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">{node.id}</div>
                      <div className={`text-xl font-mono font-bold leading-none ${node.status === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {node.waterLevel}<span className="text-[10px] ml-0.5">cm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: CENTER AI THREAT MAP (Span 6) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className={`${panelBase} rounded-2xl p-1 flex-1 relative overflow-hidden group shadow-2xl`}>
              
              {/* Top Bar inside image */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                <div className="bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Scan className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Live AI Threat Map</span>
                </div>
                <button className="bg-black/60 backdrop-blur border border-white/10 p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setView('ai-analysis')}>
                  <Maximize2 className="h-4 w-4 text-slate-300" />
                </button>
              </div>

              {/* Main Visual */}
              <div className="relative w-full h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden bg-[#0a0a0a]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA58l0uoL2ldchvHIgQlHo9w11Y67igR-xfT3OOyCC8eaTcZV6qRN57b47gQKnlIZnnpxyKgF06YYqBGOibfRwtSoC_JxP5PJHnG7UNbkhpZFmmGn1UfhdnBPJXdaY650w_hZmwby6vnSLjVE7hSJJO9_x8SJGfFwFhyvXgzq8k4NjCF39t-ec0U3gWq6_3oE8ZeLO7JVL9HIi-SqP1aLU5YcWQhfS9c6duEuy1wVvMGKmcjyIHUDaiN1Cycr6hwkQ5fnT2qqs_m-8" 
                  alt="City AI Scan" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Cyberpunk Scanline overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                
                {/* Animated Laser Scanner */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-[scan_3s_linear_infinite] z-10"></div>
                
                {/* Fake Bounding Boxes */}
                <div className="absolute top-[25%] left-[10%] w-[30%] h-[35%] border-[1.5px] border-cyan-500/50 bg-cyan-500/10 rounded flex flex-col justify-between p-1 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]">
                  <span className="text-[8px] font-mono text-cyan-300 bg-black/60 px-1 py-0.5 w-max">DRAIN_CLEAR [98%]</span>
                  <div className="w-2 h-2 border-r border-b border-cyan-500 absolute bottom-0 right-0"></div>
                  <div className="w-2 h-2 border-l border-t border-cyan-500 absolute top-0 left-0"></div>
                </div>

                <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] border-2 border-red-500 bg-red-500/10 rounded flex flex-col justify-between p-1 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)] animate-[pulse_2s_infinite]">
                  <span className="text-[8px] font-mono text-red-100 bg-red-600 px-1 py-0.5 w-max font-bold">CRITICAL_BLOCKAGE</span>
                  <div className="text-[8px] font-mono text-red-400 self-end bg-black/80 px-1">+12cm/hr Rise</div>
                  <div className="w-3 h-3 border-r-2 border-b-2 border-red-500 absolute bottom-0 right-0"></div>
                  <div className="w-3 h-3 border-l-2 border-t-2 border-red-500 absolute top-0 left-0"></div>
                </div>

                {/* Crosshairs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/30"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/30"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-white/30"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-white/30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: DIAGNOSTICS & QUICK ACTIONS (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* KPI: AI Risk */}
            <div className={`${panelBase} p-5 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-colors`}>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">AI Urban Risk</p>
                <div className="text-3xl font-bold font-sans flex items-baseline gap-1 text-white">
                  {aiRiskLevel}<span className="text-lg text-red-400">%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-red-400" />
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className={`${panelBase} rounded-2xl flex-1 flex flex-col p-5`}>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Execution Modules
              </h3>
              
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                
                <button 
                  onClick={() => setView('route-sim')}
                  className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 p-4 rounded-xl flex items-center gap-4 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-sm text-blue-100">Smart Routing</h4>
                    <p className="text-[10px] font-mono text-blue-300/70">Simulate safe paths</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => setView('rain-radar')}
                  className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-4 transition-all group"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-sm text-emerald-100">Rainfall Radar</h4>
                    <p className="text-[10px] font-mono text-emerald-300/70">Predictive heatmaps</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => setView('ai-analysis')}
                  className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 p-4 rounded-xl flex items-center gap-4 transition-all group"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-sm text-purple-100">CCTV Analysis</h4>
                    <p className="text-[10px] font-mono text-purple-300/70">Gemini vision models</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}