import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob('./pages/**/*.{jsx,tsx}');

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

        return await page();
    },

    setup({ el, App, props }) {
        if (!el) {
            return <App {...props} />;
        }

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#36534E',
    },
});
