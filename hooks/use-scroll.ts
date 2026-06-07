import { useState, useEffect } from "react";

export function useScroll() {
    const [ scrolled, setScrolled ] = useState(false);
    const [ direction, setDirection ] = useState<"up" | "down">("up");
    const [ lastScrollY, setLastScrollY ] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if we have scrolled past the very top
            setScrolled(currentScrollY > 50);

            // Determine scroll direction for auto-hiding
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setDirection("down");
            } else {
                setDirection("up");
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ lastScrollY ]);

    return { scrolled, direction };
}