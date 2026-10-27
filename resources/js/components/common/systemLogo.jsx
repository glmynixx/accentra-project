import { usePage } from "@inertiajs/react";

const FALLBACK_LOGO = "/favicon.svg";

export default function SystemLogo({ className = "h-full w-full object-contain" }) {
    const { branding = {} } = usePage().props;

    return (
        <img
            src={branding.logoUrl || FALLBACK_LOGO}
            alt="System logo"
            className={className}
            onError={(event) => {
                if (event.currentTarget.getAttribute("src") !== FALLBACK_LOGO) {
                    event.currentTarget.src = FALLBACK_LOGO;
                }
            }}
        />
    );
}
