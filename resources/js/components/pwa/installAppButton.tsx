import { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';

type InstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
};

export default function InstallAppButton() {
    const [installPrompt, setInstallPrompt] =
        useState<InstallPromptEvent | null>(null);
    const [isIos, setIsIos] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isSecureContext, setIsSecureContext] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            ('standalone' in navigator &&
                (navigator as Navigator & { standalone?: boolean }).standalone);

        setIsInstalled(Boolean(isStandalone));
        setIsSecureContext(window.isSecureContext);

        const isAppleMobile =
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIos(isAppleMobile);

        const handleInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as InstallPromptEvent);
        };
        const handleInstalled = () => {
            setInstallPrompt(null);
            setIsInstalled(true);
        };
        const handleDisplayModeChange = (event: MediaQueryListEvent) =>
            setIsInstalled(event.matches);
        const displayMode = window.matchMedia('(display-mode: standalone)');
        let hadController = Boolean(navigator.serviceWorker?.controller);
        let registration: ServiceWorkerRegistration | undefined;
        let updateCheck: number | undefined;
        let checkForUpdates: (() => void) | undefined;
        let handleVisibilityChange: (() => void) | undefined;
        let handleUpdateFound: (() => void) | undefined;

        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);
        displayMode.addEventListener('change', handleDisplayModeChange);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { updateViaCache: 'none' })
                .then((serviceWorkerRegistration) => {
                    registration = serviceWorkerRegistration;

                    if (navigator.onLine) {
                        void serviceWorkerRegistration
                            .update()
                            .catch((error: unknown) => {
                                console.error(
                                    'Unable to check for ACCENTRA app updates.',
                                    error,
                                );
                            });
                    }

                    checkForUpdates = () => {
                        if (!navigator.onLine) {
                            return;
                        }

                        void serviceWorkerRegistration
                            .update()
                            .catch((error: unknown) => {
                                console.error(
                                    'Unable to check for ACCENTRA app updates.',
                                    error,
                                );
                            });
                    };

                    handleVisibilityChange = () => {
                        if (document.visibilityState === 'visible') {
                            checkForUpdates?.();
                        }
                    };

                    window.addEventListener('online', checkForUpdates);
                    document.addEventListener(
                        'visibilitychange',
                        handleVisibilityChange,
                    );

                    updateCheck = window.setInterval(
                        checkForUpdates,
                        60 * 60 * 1000,
                    );

                    handleUpdateFound = () => {
                        const installingWorker =
                            serviceWorkerRegistration.installing;

                        installingWorker?.addEventListener(
                            'statechange',
                            () => {
                                if (
                                    installingWorker.state === 'installed' &&
                                    navigator.serviceWorker.controller
                                ) {
                                    installingWorker.postMessage({
                                        type: 'SKIP_WAITING',
                                    });
                                }
                            },
                        );
                    };

                    registration.addEventListener(
                        'updatefound',
                        handleUpdateFound,
                    );
                })
                .catch((error: unknown) => {
                    console.error(
                        'Unable to register the ACCENTRA app worker.',
                        error,
                    );
                });
        }

        const handleControllerChange = () => {
            if (hadController) {
                window.location.reload();
                return;
            }

            hadController = true;
        };

        navigator.serviceWorker?.addEventListener(
            'controllerchange',
            handleControllerChange,
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleInstallPrompt,
            );
            window.removeEventListener('appinstalled', handleInstalled);
            displayMode.removeEventListener('change', handleDisplayModeChange);
            navigator.serviceWorker?.removeEventListener(
                'controllerchange',
                handleControllerChange,
            );
            if (checkForUpdates) {
                window.removeEventListener('online', checkForUpdates);
            }
            if (handleVisibilityChange) {
                document.removeEventListener(
                    'visibilitychange',
                    handleVisibilityChange,
                );
            }
            if (updateCheck !== undefined) {
                window.clearInterval(updateCheck);
            }
            if (registration && handleUpdateFound) {
                registration.removeEventListener(
                    'updatefound',
                    handleUpdateFound,
                );
            }
        };
    }, []);

    const installApp = async () => {
        if (!installPrompt) {
            return;
        }

        try {
            await installPrompt.prompt();
            await installPrompt.userChoice;
            setInstallPrompt(null);
            setShowInstructions(true);
        } catch (error) {
            console.error('Unable to install the ACCENTRA app.', error);
        }
    };

    if (isInstalled) {
        return null;
    }

    const toggleInstructions = () => setShowInstructions((showing) => !showing);

    return (
        <div className="fixed right-4 bottom-4 z-50">
            {showInstructions && (
                <div
                    className="mb-2 max-w-72 rounded-xl bg-white p-4 text-sm text-[#142A43] shadow-lg"
                    role="status"
                >
                    {!isSecureContext ? (
                        <>
                            <p className="font-semibold">
                                A secure connection is required
                            </p>
                            <p className="mt-1">
                                Open ACCENTRA over HTTPS to install it. A
                                regular HTTP address on your local network
                                cannot show the install option.
                            </p>
                        </>
                    ) : isIos ? (
                        <>
                            <p className="font-semibold">Install on iPhone</p>
                            <p className="mt-1">
                                In Safari, tap Share, then choose “Add to Home
                                Screen”.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold">
                                Install from your browser
                            </p>
                            <p className="mt-1">
                                In Chrome, open the ⋮ menu and tap “Install app”
                                or “Add to Home screen”.
                            </p>
                            <p className="mt-1">
                                If that option is missing, open this site in
                                Chrome over HTTPS.
                            </p>
                        </>
                    )}
                </div>
            )}
            <button
                type="button"
                onClick={installPrompt ? installApp : toggleInstructions}
                className="inline-flex items-center gap-2 rounded-full bg-[#142A43] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1F3A5B]"
                aria-expanded={showInstructions}
            >
                {isIos ? <Share size={17} /> : <Download size={17} />}
                {isIos ? 'Add to Home Screen' : 'Download ACCENTRA App'}
            </button>
        </div>
    );
}
