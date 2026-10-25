import { useEffect, useState } from 'react';

export default function AppStartupAnimation() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsVisible(false);
        }
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="app-startup-overlay"
            role="status"
            aria-label="Opening ACCENTRA"
            onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) {
                    setIsVisible(false);
                }
            }}
        >
            <img
                src="/icons/accentra-192.png"
                alt=""
                className="app-startup-icon"
            />
            <span className="app-startup-name">ACCENTRA</span>
        </div>
    );
}
