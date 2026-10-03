import { useCallback, useRef } from 'react';
import { useSwipeActions } from '../../hooks/useSwipeActions';

interface SwipeableChallengeRowProps {
  challengeId: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onLongPress: () => void;
  children: React.ReactNode;
  isOpen: boolean;
  onOpen: (challengeId: string) => void;
  onClose: () => void;
}

export default function SwipeableChallengeRow({
  challengeId,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  children,
  onOpen,
  onClose,
}: SwipeableChallengeRowProps) {
  const { bindProps, offsetX, isDragging, isOpen: swipeIsOpen, direction } =
    useSwipeActions({
      onSwipeLeft,
      onSwipeRight,
      onLongPress,
      onDragStart: onOpen, // Call onOpen when drag starts
      onDragEnd: onClose,  // Call onClose when drag ends (swipe or spring back)
      challengeId,
      // Disable single-pointer guards are handled inside the hook per-row;
      // keep every row swipeable so a drag can open it.
      threshold: 64,
    });

  // Determine animation class based on state
  const animationClass = () => {
    if (!isDragging && swipeIsOpen) {
      // After swipe action triggered, animate out
      if (direction === 'left' && offsetX < -64) {
        return 'animate-slide-out-left';
      }
      if (direction === 'right' && offsetX > 64) {
        return 'animate-slide-out-right';
      }
    }
    // If not dragging and not open, spring back to center
    if (!isDragging && !swipeIsOpen && Math.abs(offsetX) > 0) {
      return 'animate-spring-back';
    }
    return '';
  };

  return (
    <div
      {...bindProps}
      className={`relative overflow-hidden rounded-3xl shadow-[0_10px_36px_rgba(0,0,0,0.4)] ${animationClass()}`}
      style={{
        // Base transform from hook; animation will override via keyframes
        transform: `translateX(${offsetX}px)`,
        // When swiped out, we want to keep the element in the DOM but hidden; animation handles opacity
      }}
    >
      {/* Action rails (rendered behind the card) */}
      {!isDragging &&
        offsetX < 0 &&
        offsetX > -120 && // only show when dragging left
        (
          <div
            className="absolute left-0 top-0 bottom-0 w-64 flex items-center justify-end pr-5 text-right bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-[12px] uppercase tracking-wider pointer-events-none"
            style={{ opacity: Math.min(1, Math.abs(offsetX) / 64) }}
          >
            Dismiss
          </div>
        )}
      {!isDragging &&
        offsetX > 0 &&
        offsetX < 120 && // only show when dragging right
        (
          <div
            className="absolute right-0 top-0 bottom-0 w-64 flex items-center justify-start pl-5 text-left bg-gradient-to-l from-orange-600 to-orange-500 text-white font-bold text-[12px] uppercase tracking-wider pointer-events-none"
            style={{ opacity: Math.min(1, offsetX / 64) }}
          >
            Join
          </div>
        )}

      {/* The card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}