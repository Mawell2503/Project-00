import { useState } from 'react';
import type { Challenge } from '../../types';
import { useCallback } from 'react';

interface ChallengeMediaCardProps {
  challenge: Challenge;
  onChallengeClick: (challengeId: string) => void;
}

export default function ChallengeMediaCard({
  challenge,
  onChallengeClick,
}: ChallengeMediaCardProps) {
  const hasMedia = !!challenge.media_url;
  const isVideo = hasMedia && /\.(mp4|webm|ogg)$/i.test(challenge.media_url);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    onChallengeClick(challenge.id);
  }, [onChallengeClick, challenge.id]);

  const handleMediaMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  const handleMediaMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden group cursor-pointer h-56"
    >
      {/* Base background (always present) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22190f] via-[#181226] to-[#0e0c13]" />
      <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-24 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />

      {hasMedia && challenge.media_url && (
        <>
          {isVideo ? (
            <video
              src={challenge.media_url}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={handleMediaMouseEnter}
              onMouseLeave={handleMediaMouseLeave}
            />
          ) : (
            <img
              src={challenge.media_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          {isVideo && hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-between p-4 h-full">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border w-fit ${
            challenge.category === 'fitness'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
              : challenge.category === 'productivity'
                ? 'bg-amber-500/15 text-amber-300 border-amber-400/40'
                : challenge.category === 'social'
                  ? 'bg-orange-500/15 text-orange-300 border-orange-400/40'
                  : 'bg-white/[0.08] text-slate-200 border-white/[0.15]'
          }`}>
            {challenge.category}
          </span>
          {challenge.challenge_mode === 'daily' && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M12 8v8"/></svg>
              Daily
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-white drop-shadow">{challenge.title}</h3>
          <p className="mt-1 line-clamp-2 text-white/85 text-xs">{challenge.description}</p>
        </div>

        <div className="flex items-center justify-between text-white/85 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[8px] font-black uppercase text-white">
              {challenge.creator_username[0]}
            </span>
            @{challenge.creator_username}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
              {challenge.participants_count}
            </span>
            <span className="flex items-center gap-1 font-bold text-orange-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M12 8v8"/></svg>
              {challenge.reward_xp} XP
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}