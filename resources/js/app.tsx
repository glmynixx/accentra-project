
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import InstallAppButton from './components/pwa/installAppButton';
import AppStartupAnimation from './components/pwa/appStartupAnimation';


import type { ComponentType } from 'react';

type InertiaPageModule = {
    default: ComponentType<any>;
};

const pages = import.meta.glob<InertiaPageModule>(
    './pages/**/*.{jsx,tsx}'
);

void createInertiaApp({
    title: (title) => title || 'ACCENTRA',

    resolve: async (name) => {
        const pagePathJsx = `./pages/${name}.jsx`;
        const pagePathTsx = `./pages/${name}.tsx`;

        const page = pages[pagePathJsx] || pages[pagePathTsx];

        if (!page) {
            console.error('Page not found:', name);
            console.error('Available pages:', Object.keys(pages));
            throw new Error(`Page not found: ${name}`);
        }

        const module = await page();

        if (!module.default) {
            throw new Error(`Default export not found for page: ${name}`);
        }

        return module.default;
    },

    setup({ el, App, props }) {
        if (!el) {
            return;
        }

        createRoot(el).render(
            <>
                <App {...props} />
                <InstallAppButton />
                <AppStartupAnimation />
            </>
        );
    },

    progress: {
        color: '#36534E',
    },
});
