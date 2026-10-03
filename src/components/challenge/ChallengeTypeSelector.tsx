import { Users, MapPin, ChevronRight, Zap } from 'lucide-react';
import type { ChallengeType } from '../../types';

interface ChallengeTypeSelectorProps {
  isOpen: boolean;
  onSelect: (type: ChallengeType) => void;
  onClose: () => void;
}

const CHALLENGE_TYPES: {
  type: ChallengeType;
  icon: typeof Users;
  title: string;
  subtitle: string;
  gradient: string;
  glow: string;
}[] = [
  {
    type: 'friend',
    icon: Users,
    title: 'Bet Against a Friend',
    subtitle: 'Challenge someone directly. Photo, video, or location proof.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(249,115,22,0.35)',
  },
  {
    type: 'local',
    icon: MapPin,
    title: 'Bet Locally',
    subtitle: 'Public bet visible to everyone in the lobby. Wager your XP.',
    gradient: 'from-orange-500 to-rose-600',
    glow: 'rgba(249,115,22,0.35)',
  },
];

export default function ChallengeTypeSelector({ isOpen, onSelect, onClose }: ChallengeTypeSelectorProps) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div
        className="modal-shell animate-modal-pop relative overflow-hidden"
        style={{
          background: 'rgba(18, 16, 22, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 48px rgba(249, 115, 22, 0.1)',
        }}
      >
        {/* Ambient top glow */}
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-56 w-72 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="modal-header relative">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">Choose Your Bet</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Pick how you want to play</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <div className="p-5 space-y-3 relative">
          {CHALLENGE_TYPES.map(ct => {
            const Icon = ct.icon;
            return (
              <button
                key={ct.type}
                onClick={() => onSelect(ct.type)}
                className="w-full text-left group"
              >
                <div
                  className="rounded-2xl p-4 transition-all duration-200 cursor-pointer border border-white/[0.08]
                             bg-white/[0.04] hover:bg-white/[0.07] hover:border-orange-400/40
                             hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(249,115,22,0.12)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${ct.gradient} blur-md opacity-40`}
                        style={{ boxShadow: `0 0 18px ${ct.glow}` }}
                      />
                      <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${ct.gradient} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white">{ct.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{ct.subtitle}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        <Zap className="w-2.5 h-2.5" />
                        Start
                      </span>
                    </div>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.04] text-orange-300 group-hover:bg-orange-500/15 group-hover:border-orange-400/40 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}