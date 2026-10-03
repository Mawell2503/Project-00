import { useCallback, useState, useEffect, useMemo } from 'react';
import type { Challenge, UserChallenge } from '../../types';
import SwipeableChallengeRow from '../../components/challenge/SwipeableChallengeRow';
import ChallengeMediaCard from '../../components/challenge/ChallengeMediaCard';
import { MOCK_CHALLENGES } from '../../data/mockData';
import { Users, Zap, Flame } from 'lucide-react';
import SectionLabel from '../../components/ui/SectionLabel';

interface LobbyPageProps {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  onChallengeClick: (challengeId: string) => void;
  onJoin: (challengeId: string) => Promise<void>;
}

export default function LobbyPage({
  challenges,
  userChallenges,
  onChallengeClick,
  onJoin,
}: LobbyPageProps) {
  const [filter, setFilter] = useState<string>('all');
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('betz_dismissed');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  const joinedIds = new Set(userChallenges.map(uc => uc.challenge_id));

  // Combine real challenges with mocks if needed, but prefer real
  const allChallenges = challenges.length > 0 ? challenges : MOCK_CHALLENGES;

  // Get unique categories from all challenges for dynamic filters
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allChallenges.forEach(challenge => {
      if (challenge.category) {
        cats.add(challenge.category);
      }
    });
    // Always include 'all' and 'daily' as special filters
    cats.add('all');
    // Check if any challenge is daily to include daily filter
    const hasDaily = allChallenges.some(ch => ch.challenge_mode === 'daily');
    if (hasDaily) {
      cats.add('daily');
    }
    return Array.from(cats);
  }, [allChallenges]);

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return allChallenges.filter(challenge => {
      // Skip dismissed
      if (dismissedIds.includes(challenge.id)) return false;
      // Apply category filter
      if (filter === 'all') return true;
      if (filter === 'daily') return challenge.challenge_mode === 'daily';
      return challenge.category === filter;
    });
  }, [allChallenges, filter, dismissedIds]);

  // Sort: show undismissed, not joined first? Actually show all, but maybe put joined last
  const sortedChallenges = useMemo(() => {
    return [...filteredChallenges].sort((a, b) => {
      const aJoined = joinedIds.has(a.id);
      const bJoined = joinedIds.has(b.id);
      if (aJoined && !bJoined) return 1; // joined after
      if (!aJoined && bJoined) return -1; // not joined before
      return 0; // keep original order
    });
  }, [filteredChallenges, joinedIds]);

  const handleDismiss = useCallback(async (challengeId: string) => {
    setDismissedIds(prev => {
      const newIds = [...prev, challengeId];
      localStorage.setItem('betz_dismissed', JSON.stringify(newIds));
      return newIds;
    });
  }, []);

  const handleJoin = useCallback(async (challengeId: string) => {
    try {
      await onJoin(challengeId);
      // Optionally show a toast or snack here via context or state
    } catch (err) {
      console.error('Failed to join challenge:', err);
      // Could show error toast
    }
  }, [onJoin]);

  const handleChallengeClick = useCallback((challengeId: string) => {
    onChallengeClick(challengeId);
  }, [onChallengeClick]);

  const handleOpenRow = useCallback((challengeId: string) => {
    setOpenRowId(challengeId);
  }, []);

  const handleCloseRow = useCallback(() => {
    setOpenRowId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <SectionLabel title="Lobby" subtitle="Discover what your peers are working on" />
        <h2 className="mt-1 text-2xl font-bold text-orange-400">Peer Challenges</h2>
      </div>

      {/* Filter chips - always present */}
      <div className="flex flex-wrap gap-2 mb-4">
        {uniqueCategories.map(value => {
          const label = value === 'all' ? 'All' :
                       value === 'daily' ? 'Daily' :
                       value.charAt(0).toUpperCase() + value.slice(1);
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`chip ${filter === value ? 'chip-active' : ''}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content area - list or empty state */}
      {sortedChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="mt-4 text-sm text-slate-400">
            No challenges match the current filters.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Try adjusting the filter or check back later.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="chip chip-active mt-4"
          >
            Show all challenges
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedChallenges.map((challenge) => {
            const isJoined = joinedIds.has(challenge.id);
            const isOpen = openRowId === challenge.id;

            return (
              <SwipeableChallengeRow
                key={challenge.id}
                challengeId={challenge.id}
                onSwipeLeft={() => handleDismiss(challenge.id)}
                onSwipeRight={() => {
                  if (!isJoined) {
                    handleJoin(challenge.id);
                  }
                }}
                onLongPress={() => handleChallengeClick(challenge.id)}
                isOpen={isOpen}
                onOpen={handleOpenRow}
                onClose={handleCloseRow}
              >
                <ChallengeMediaCard
                  challenge={challenge}
                  onChallengeClick={handleChallengeClick}
                />
              </SwipeableChallengeRow>
            );
          })}
        </div>
      )}
    </div>
  );
}