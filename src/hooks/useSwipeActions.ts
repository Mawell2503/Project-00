import { useCallback, useRef, useState } from 'react';

interface UseSwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onLongPress?: () => void;
  onDragStart?: (challengeId: string) => void;
  onDragEnd?: () => void;
  challengeId: string;
  threshold?: number; // pixels to trigger swipe
  disabled?: boolean;
}

interface UseSwipeActionsReturn {
  bindProps: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
  };
  offsetX: number;
  isDragging: boolean;
  isOpen: boolean;
  direction: 'left' | 'right' | null;
}

/**
 * Hook for horizontal swipe gestures with optional long-press.
 * Returns pointer event handlers to bind to an element.
 */
export function useSwipeActions({
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  onDragStart,
  onDragEnd,
  challengeId,
  threshold = 64,
  disabled = false,
}: UseSwipeActionsProps): UseSwipeActionsReturn {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [moved, setMoved] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [dragStarted, setDragStarted] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isLeftRef = useRef(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchIdRef = useRef<number | null>(null);

  const startDrag = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    // Only respond to primary pointer (touch/finger/pen or left mouse)
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen' && e.button !== 0) {
      return;
    }
    // Prevent multiple simultaneous gestures
    if (touchIdRef.current !== null && touchIdRef.current !== e.pointerId) {
      return;
    }
    touchIdRef.current = e.pointerId;
    setIsDragging(true);
    setMoved(false);
    setIsOpen(false);
    setDirection(null);
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setOffsetX(0);
    setDragStarted(false);
    // Start long-press timer
    if (onLongPress) {
      const timeout = setTimeout(() => {
        onLongPress();
        setLongPressTimer(null);
      }, 500);
      setLongPressTimer(timeout);
      longPressTimeoutRef.current = timeout;
    }
    // Prevent text selection and enable capture
    const target = e.target as Element;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
  }, [disabled, onLongPress, threshold]);

  const moveDrag = useCallback((e: React.PointerEvent) => {
    if (!isDragging || touchIdRef.current !== e.pointerId) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    // Ignore small movements to avoid accidental drags
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4 && !moved) return;
    setMoved(true);
    // Determine primary axis: if vertical movement > horizontal, abort gesture
    if (Math.abs(dy) > Math.abs(dx)) {
      // Vertical drag likely scrolling; cancel gesture
      endDrag(e as React.PointerEvent);
      return;
    }
    setOffsetX(dx);
    // If we haven't marked drag as started yet, and we have sufficient horizontal movement, mark it
    if (!dragStarted && Math.abs(dx) > 10) {
      setDragStarted(true);
      if (onDragStart) {
        onDragStart(challengeId);
      }
    }
    // Cancel long-press if moved
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
      setLongPressTimer(null);
    }
  }, [challengeId, dragStarted, isDragging, longPressTimeoutRef.current, onDragStart, onLongPress]);

  const endDrag = useCallback((e: React.PointerEvent) => {
    if (!isDragging || touchIdRef.current !== e.pointerId) return;
    touchIdRef.current = null;
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
      setLongPressTimer(null);
    }
    if (!isDragging) return;
    setIsDragging(false);
    const dx = offsetX;
    const absDx = Math.abs(dx);
    // Reset pointer capture
    const target = e.target as Element;
    if (target.releasePointerCapture) {
      try {
        target.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    // If not moved enough, treat as tap/click
    if (absDx < 4) {
      setOffsetX(0);
      setIsDragging(false);
      setDragStarted(false);
      return;
    }
    // Determine direction and trigger action if past threshold
    if (dx < -threshold) {
      setDirection('left');
      setIsOpen(true);
      onSwipeLeft();
    } else if (dx > threshold) {
      setDirection('right');
      setIsOpen(true);
      onSwipeRight();
    } else {
      // Spring back
      setOffsetX(0);
      setIsDragging(false);
    }
    // Mark drag as ended and call onDragEnd
    setDragStarted(false);
    if (onDragEnd) {
      onDragEnd();
    }
  }, [offsetX, onSwipeLeft, onSwipeRight, threshold, onDragEnd]);

  const cancelDrag = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
      setLongPressTimer(null);
    }
    if (isDragging) {
      setIsDragging(false);
      setOffsetX(0);
      setDirection(null);
      setMoved(false);
      setDragStarted(false);
      touchIdRef.current = null;
    }
    if (onDragEnd) {
      onDragEnd();
    }
  }, [isDragging, onDragEnd]);

  const bindProps = {
    onPointerDown: startDrag,
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: cancelDrag,
    onClick: (e: React.MouseEvent) => {
      // Suppress click if a drag occurred
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        setMoved(false);
      }
    },
    style: {
      transform: `translateX(${offsetX}px)`,
      transition: isDragging ? '0s' : '0.2s ease',
    },
  };

  return {
    bindProps,
    offsetX,
    isDragging,
    isOpen,
    direction,
  };
}