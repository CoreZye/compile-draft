import { useState, type TouchEvent } from 'react';

export const useSwipe = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [isSwiping, setIsSwiping] = useState<boolean>(false);

    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        setIsSwiping(true);
        setDistance(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
        if (touchStart === null) return;

        const currentTouch = e.targetTouches[0].clientX;
        // Calculate real-time distance
        setDistance(touchStart - currentTouch);
    };

    const onTouchEnd = () => {
        setIsSwiping(false);

        if (touchStart !== null) {
            const isLeftSwipe = distance > minSwipeDistance;
            const isRightSwipe = distance < -minSwipeDistance;

            if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
            if (isRightSwipe && onSwipeRight) onSwipeRight();
        }

        // Reset tracking
        setTouchStart(null);
        setDistance(0);
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        distance,    // Positive = moving left, Negative = moving right
        isSwiping    // True while the finger is down
    };
};
