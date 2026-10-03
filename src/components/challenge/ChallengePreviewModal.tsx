import { useState } from 'react';
import { ArrowLeft, Users, Zap, Flame, Calendar, Trophy } from 'lucide-react';
import type { Challenge } from '../../types';
import { CATEGORY_COLORS } from '../../data/mockData';
import Avatar from '../ui/Avatar';

interface ChallengePreviewModalProps {
  isOpen: boolean;
  challenge: Challenge | null;
  onClose: () => void;
  onJoin: (challengeId: string) => Promise<void>;
}

export default function ChallengePreviewModal({ isOpen, challenge, onClose, onJoin }: ChallengePreviewModalProps) {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !challenge) return null;

  const handleJoin = async () => {
    setError(null);
    setJoining(true);
    try {
      await onJoin(challenge.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join challenge.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-shell">

        <div className="modal-header">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-white hover:opacity-70">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-white text-lg">Challenge Details</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border w-fit ${CATEGORY_COLORS[challenge.category] || 'bg-white/[0.06] text-slate-300 border-white/[0.12]'}`}>
              {challenge.category}
            </span>
            {challenge.challenge_mode === 'daily' && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                <Flame className="w-2.5 h-2.5" />
                Daily
              </span>
            )}
          </div>

          <h2 className="text-lg font-extrabold text-white leading-tight">{challenge.title}</h2>

          <div className="flex items-center gap-2">
            <Avatar username={challenge.creator_username} size="sm" />
            <span className="text-xs text-slate-400">Created by <span className="font-bold text-white">@{challenge.creator_username}</span></span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>

          {challenge.stake_description && (
            <div className="glass-panel px-4 py-3">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">What's at stake</p>
              <p className="text-xs text-amber-200">{challenge.stake_description}</p>
            </div>
          )}

          {challenge.location_name && (
            <div className="glass-panel px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
              <p className="text-xs text-white">{challenge.location_name}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="glass-panel px-3 py-2.5 text-center">
              <Calendar className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-sm font-extrabold text-white">{challenge.duration_days}</p>
              <p className="text-[9px] text-slate-400 font-medium">{challenge.duration_days === 1 ? 'Day' : 'Days'}</p>
            </div>
            <div className="glass-panel px-3 py-2.5 text-center">
              <Users className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-sm font-extrabold text-white">{challenge.participants_count}</p>
              <p className="text-[9px] text-slate-400 font-medium">Joined</p>
            </div>
            <div className="glass-panel px-3 py-2.5 text-center">
              <Trophy className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-sm font-extrabold text-orange-300">{challenge.reward_xp}</p>
              <p className="text-[9px] text-slate-400 font-medium">XP</p>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        </div>

        <div className="px-5 py-3 border-t border-white/[0.08] shrink-0">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="btn-primary"
          >
            {joining ? (
              'Joining...'
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Accept Challenge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
