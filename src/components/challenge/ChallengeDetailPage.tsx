import { ArrowLeft, Zap, Clock, MapPin, Users, Flame } from 'lucide-react';
import type { Challenge, UserChallenge, CheckIn } from '../../types';
import { CATEGORY_COLORS } from '../../data/mockData';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Avatar from '../ui/Avatar';
import DailyCheckinBox from './DailyCheckinBox';

interface ChallengeDetailPageProps {
  challenge: Challenge;
  userChallenge: UserChallenge;
  checkIns: CheckIn[];
  isCheckedInToday: boolean;
  streakCount: number;
  onBack: () => void;
  onSubmitCheckin: (message: string, mediaUrl?: string, lat?: number, lng?: number) => Promise<void>;
}

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

export default function ChallengeDetailPage({
  challenge,
  userChallenge,
  checkIns,
  isCheckedInToday,
  streakCount,
  onBack,
  onSubmitCheckin,
}: ChallengeDetailPageProps) {
  const daysElapsed = Math.max(0, Math.floor((Date.now() - new Date(challenge.start_time || challenge.created_at).getTime()) / 86400000));
  const daysRemaining = Math.max(0, challenge.duration_days - daysElapsed);
  const hasMedia = !!challenge.media_url;

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm transition-colors text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <Card padding="sm" className={`relative overflow-hidden ${hasMedia ? 'min-h-[240px]' : ''}`}>
        {hasMedia && challenge.media_url && (
          <>
            {isVideo(challenge.media_url) ? (
              <video
                src={challenge.media_url}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
              />
            ) : (
              <img
                src={challenge.media_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </>
        )}

        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border w-fit ${CATEGORY_COLORS[challenge.category] || 'bg-white/[0.06] text-slate-300 border-white/[0.12]'}`}>
              {challenge.category}
            </span>
            {challenge.challenge_mode === 'daily' && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Flame className="w-3 h-3" />
                Daily
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
          <p className={`text-xs leading-relaxed ${hasMedia ? 'text-white/75' : 'text-slate-300'}`}>{challenge.description}</p>

          {challenge.stake_description && (
            <div className="rounded-lg p-2 bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] italic font-medium text-amber-300">
                Wager: {challenge.stake_description}
              </p>
            </div>
          )}

          {challenge.challenge_type === 'friend' && challenge.friend_username && (
            <div className="flex items-center gap-3 rounded-xl p-3 bg-white/[0.05] border border-white/[0.08]">
              <Avatar username={challenge.creator_username} size="sm" />
              <span className="text-xs font-bold text-slate-300">VS</span>
              <Avatar username={challenge.friend_username} size="sm" />
              <div className="ml-auto">
                <span className="text-[10px] font-medium text-slate-400">@{challenge.friend_username}</span>
              </div>
            </div>
          )}

          {challenge.location_name && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{challenge.location_name} ({challenge.target_radius_m || 150}m radius)</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="glass-panel p-2 text-center">
              <Clock className="w-3 h-3 mx-auto text-slate-400" />
              <p className="text-[10px] mt-0.5 text-slate-400">Remaining</p>
              <p className="text-xs font-bold text-white">{daysRemaining}d</p>
            </div>
            <div className="glass-panel p-2 text-center">
              <Users className="w-3 h-3 mx-auto text-slate-400" />
              <p className="text-[10px] mt-0.5 text-slate-400">Participants</p>
              <p className="text-xs font-bold text-white">{challenge.participants_count}</p>
            </div>
            <div className="rounded-lg p-2 text-center bg-orange-500/15 border border-orange-500/25">
              <Zap className="w-3 h-3 mx-auto text-orange-400" />
              <p className="text-[10px] mt-0.5 text-orange-400">XP</p>
              <p className="text-xs font-bold text-orange-300">{challenge.reward_xp}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">Progress</span>
          <span className="text-xs font-bold text-white">{userChallenge.progress}%</span>
        </div>
        <ProgressBar
          value={userChallenge.progress}
          color={userChallenge.status === 'COMPLETED' ? 'emerald' : userChallenge.status === 'FAILED' ? 'rose' : 'orange'}
          size="md"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Day {daysElapsed} of {challenge.duration_days}
        </p>
      </Card>

      {(challenge.challenge_mode === 'daily' || challenge.confirmation_method === 'location') && (
        <DailyCheckinBox
          challengeMode={challenge.challenge_mode || 'normal'}
          confirmationMethod={challenge.confirmation_method}
          isCheckedInToday={isCheckedInToday}
          streakCount={streakCount}
          targetLat={challenge.target_lat}
          targetLng={challenge.target_lng}
          targetRadiusM={challenge.target_radius_m}
          onSubmitCheckin={onSubmitCheckin}
        />
      )}

      {checkIns.length > 0 && (
        <Card padding="sm">
          <h3 className="text-xs font-bold text-slate-300 mb-3">Check-in History</h3>
          <div className="space-y-3">
            {checkIns.map(ci => (
              <div key={ci.id} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-300">
                      {new Date(ci.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      ci.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-300' :
                      ci.status === 'DISPUTED' ? 'bg-rose-500/15 text-rose-300' :
                      'bg-white/[0.06] text-slate-400'
                    }`}>
                      {ci.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ci.text_proof}</p>
                  {ci.location_lat && ci.location_lng && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" />
                      <span className="text-[9px] text-slate-500">Location verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}