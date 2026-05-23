import { useState } from 'react';
import { useAppStore } from '../store';
import { ThemeVariant } from '../types';
import {
  Trophy, Camera, Droplets, Star, Award, Users, MapPin,
  Zap, ChevronRight, Shield, Medal, Target, Heart, CheckCircle2,
  ArrowRight, Sparkles
} from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma',    points: 1240, badge: 'guardian', reports: 47, accuracy: 94 },
  { rank: 2, name: 'Arjun Nair',      points: 980,  badge: 'guardian', reports: 38, accuracy: 91 },
  { rank: 3, name: 'Divya Menon',     points: 750,  badge: 'guardian', reports: 29, accuracy: 89 },
  { rank: 4, name: 'Ravi Patel',      points: 520,  badge: 'reporter', reports: 22, accuracy: 85 },
  { rank: 5, name: 'Sneha Kulkarni',  points: 390,  badge: 'reporter', reports: 17, accuracy: 82 },
];

const BADGE_ICONS: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  guardian: { icon: <Shield className="h-4 w-4" />, color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40', label: 'Flood Guardian' },
  reporter: { icon: <Medal className="h-4 w-4" />,  color: 'text-blue-400 bg-blue-500/20 border-blue-500/40',    label: 'Reporter'       },
  rookie:   { icon: <Star className="h-4 w-4" />,   color: 'text-slate-400 bg-slate-500/20 border-slate-500/40', label: 'Rookie'         },
};

const DRAINS = [
  { id: 1, location: 'Mapusa Market Junction',   adopted: true,  status: 'clear',   reporter: 'Priya S.' },
  { id: 2, location: 'Panaji Bridge Underpass',  adopted: true,  status: 'blocked', reporter: 'Arjun N.' },
  { id: 3, location: 'Calangute Road Drain #3',  adopted: false, status: 'unknown', reporter: null },
  { id: 4, location: 'Margao Central Outlet',    adopted: true,  status: 'debris',  reporter: 'Ravi P.'  },
  { id: 5, location: 'Vasco Storm Drain B12',    adopted: false, status: 'unknown', reporter: null },
];

export default function SimulationView() {
  const { activeLayout, setView } = useAppStore();
  const isGlass = activeLayout === ThemeVariant.GLASSMORPHISM;

  const [activeTab, setActiveTab] = useState<'reporter' | 'leaderboard' | 'drains'>('reporter');

  const panelBase = isGlass
    ? 'bg-[#0d1117]/60 backdrop-blur-xl border border-white/10'
    : 'bg-[#141313] border border-white/5';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative space-y-8 no-scrollbar text-white bg-[#05070a]">
      {/* Ambient background */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1300px] mx-auto space-y-8">

        {/* ── HERO HEADER ── */}
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6">
            <div className="space-y-3">
              {/* Hackathon Winner Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                <Trophy className="h-4 w-4 text-yellow-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-widest">
                  🏆 Hackathon Winner Feature
                </span>
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                Community{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Simulation
                </span>
              </h1>
              <p className="text-slate-400 font-mono text-sm max-w-xl leading-relaxed">
                Turn every citizen into a flood sensor. Crowd-sourced real-time data, gamified engagement, and community-driven flood prevention.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { label: 'Active Reporters', value: '2,341', icon: <Users className="h-4 w-4 text-cyan-400" /> },
                { label: 'Reports Today',    value: '128',   icon: <Camera className="h-4 w-4 text-pink-400" /> },
                { label: 'Drains Adopted',   value: '89',    icon: <MapPin className="h-4 w-4 text-emerald-400" /> },
              ].map(s => (
                <div key={s.label} className={`${panelBase} rounded-xl px-4 py-3 flex items-center gap-3 min-w-[140px]`}>
                  {s.icon}
                  <div>
                    <p className="text-lg font-bold font-sans">{s.value}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── FEATURE CARDS (3 big info cards) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card 1 — Citizen Flood Reporter */}
          <div className={`${panelBase} rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300 cursor-pointer`}
            onClick={() => setActiveTab('reporter')}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-pink-400" />
            </div>

            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center border border-pink-500/30">
              <Camera className="h-6 w-6 text-pink-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-white">Citizen Flood Reporter</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Users snap a photo of a flooded road and submit it. <span className="text-pink-300 font-semibold">Gemini Vision</span> auto-validates it's actually flood water (not a puddle), extracts water depth estimate, and pins it live on the map.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <Zap className="h-3.5 w-3.5 text-pink-400" />
              <span className="text-xs font-mono text-pink-300 uppercase tracking-wider">Turns everyone into a sensor</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setActiveTab('reporter'); }}
              className="w-full py-2.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Report <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2 — Leaderboard */}
          <div className={`${panelBase} rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300 cursor-pointer`}
            onClick={() => setActiveTab('leaderboard')}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-yellow-400" />
            </div>

            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-white mb-2">Reporter Leaderboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Points and badges for accurate flood reports. Top reporters earn <span className="text-yellow-300 font-semibold">"Flood Guardian"</span> status. Creates a self-sustaining crowd-sensor network — more engagement, more data, better predictions.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <Award className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs font-mono text-yellow-300 uppercase tracking-wider">Community-driven accuracy</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setActiveTab('leaderboard'); }}
              className="w-full py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              View Rankings <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 3 — Drain Adoption */}
          <div className={`${panelBase} rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 cursor-pointer`}
            onClick={() => setActiveTab('drains')}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Heart className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-white mb-2">Drain Adoption Program</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Citizens <span className="text-emerald-300 font-semibold">"adopt"</span> a nearby drain, report blockages, and earn points for clearing debris. Directly reduces flood risk at the grassroots level. Proven model from US cities like San Francisco.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider">Grassroots flood prevention</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setActiveTab('drains'); }}
              className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Adopt a Drain <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── TAB PANEL ── */}
        <div className={`${panelBase} rounded-2xl overflow-hidden`}>
          {/* Tab bar */}
          <div className="flex border-b border-white/10 bg-black/20">
            {[
              { id: 'reporter' as const,    label: 'Flood Reporter', icon: <Camera className="h-4 w-4" />,  color: 'text-pink-400   border-pink-400'   },
              { id: 'leaderboard' as const, label: 'Leaderboard',    icon: <Trophy className="h-4 w-4" />,  color: 'text-yellow-400 border-yellow-400' },
              { id: 'drains' as const,      label: 'Drain Adoption', icon: <Droplets className="h-4 w-4" />,color: 'text-emerald-400 border-emerald-400'},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? `${tab.color} bg-white/5`
                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* ── Reporter Tab ── */}
            {activeTab === 'reporter' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-pink-300 mb-1">How It Works</h3>
                  <p className="text-sm text-slate-400 font-mono">Gemini Vision-powered community flood detection system</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { step: '01', title: 'Snap a Photo', desc: 'Take a photo of a flooded road, drain, or area near you. Any phone camera works.' },
                    { step: '02', title: 'Gemini Validates', desc: 'Our Gemini Vision API analyzes the photo to confirm it shows actual flood water and estimates water depth.' },
                    { step: '03', title: 'Live Map Pin', desc: 'Validated reports are instantly pinned on the community map with depth estimates and exact coordinates.' },
                  ].map(s => (
                    <div key={s.step} className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
                      <div className="text-3xl font-black font-mono text-pink-500/40 mb-2">{s.step}</div>
                      <h4 className="font-bold text-white mb-1">{s.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setView('report')}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-600/40 to-rose-600/30 hover:from-pink-600/60 hover:to-rose-600/50 border border-pink-500/40 text-pink-200 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  <Camera className="h-5 w-5" />
                  Go to Report Page
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── Leaderboard Tab ── */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-yellow-300">Top Flood Guardians</h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Simulation Data Preview</span>
                </div>
                <div className="space-y-3">
                  {MOCK_LEADERBOARD.map(person => {
                    const badge = BADGE_ICONS[person.badge];
                    return (
                      <div key={person.rank} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        person.rank <= 3 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/3 border-white/5'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black font-mono ${
                          person.rank === 1 ? 'bg-yellow-400 text-black' :
                          person.rank === 2 ? 'bg-slate-300 text-black' :
                          person.rank === 3 ? 'bg-orange-400 text-black' :
                          'bg-white/10 text-white'
                        }`}>
                          {person.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-white">{person.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{person.reports} reports · {person.accuracy}% accuracy</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${badge.color}`}>
                          {badge.icon}
                          <span className="hidden sm:inline">{badge.label}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black font-mono text-yellow-400">{person.points}</p>
                          <p className="text-[10px] font-mono text-slate-500">pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setView('report')}
                    className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 font-mono transition-colors cursor-pointer"
                  >
                    View live leaderboard with real data <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Drains Tab ── */}
            {activeTab === 'drains' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-emerald-300">Drain Adoption Map</h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Goa Network</span>
                </div>
                <div className="space-y-2">
                  {DRAINS.map(drain => (
                    <div key={drain.id} className="flex items-center gap-4 p-4 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        drain.status === 'clear'   ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                        drain.status === 'blocked' ? 'bg-red-400 shadow-[0_0_8px_#f87171] animate-pulse' :
                        drain.status === 'debris'  ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' :
                        'bg-slate-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{drain.location}</p>
                        {drain.adopted && (
                          <p className="text-[10px] font-mono text-slate-400">Adopted by {drain.reporter}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {drain.status === 'blocked' && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono uppercase">Blocked</span>
                        )}
                        {drain.status === 'debris' && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono uppercase">Debris</span>
                        )}
                        {drain.status === 'clear' && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Clear
                          </span>
                        )}
                        {!drain.adopted && (
                          <button
                            onClick={() => setView('report')}
                            className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded font-mono uppercase transition-colors cursor-pointer"
                          >
                            Adopt
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
