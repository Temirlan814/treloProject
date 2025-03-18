import { useEffect, useState, useRef, RefObject } from "react";

export interface IUseScroll {
    position: number;
    isScrollAllowed: boolean;
}

const BOUND_WIDTH = 50; // Зона у края экрана, где активируется скролл

function getScrollDirection({
                                position,
                                leftBounds = -Infinity,
                                rightBounds = Infinity
                            }: {
    position: number | undefined;
    leftBounds: number | undefined;
    rightBounds: number | undefined;
}): "left" | "right" | "stable" {
    if (position === undefined) {
        return "stable";
    }
    if (position < leftBounds + BOUND_WIDTH) {
        return "left";
    }
    if (position > rightBounds - BOUND_WIDTH) {
        return "right";
    }
    return "stable";
}

export const useHorizontalScroll = (ref: RefObject<HTMLElement | null>) => {
    const [config, setConfig] = useState<Partial<IUseScroll>>({
        position: 0,
        isScrollAllowed: false
    });

    const scrollTimer = useRef<number | null>(null);
    const scrollSpeed = 10; // Скорость скролла
    const { position, isScrollAllowed } = config;

    useEffect(() => {
        if (!ref.current) return;

        const bounds = ref.current.getBoundingClientRect();
        const direction = getScrollDirection({
            position,
            leftBounds: bounds.left,
            rightBounds: bounds.right
        });

        if (direction !== "stable" && isScrollAllowed) {
            scrollTimer.current = setInterval(() => {
                ref.current?.scrollBy(scrollSpeed * (direction === "left" ? -1 : 1), 0);
            }, 10);
        }

        return () => {
            if (scrollTimer.current) {
                clearInterval(scrollTimer.current);
            }
        };
    }, [isScrollAllowed, position, ref, scrollSpeed]);

    return { updatePosition: setConfig };
};
