
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob('./pages/**/*.{jsx,tsx}');

createInertiaApp({
    title: (title) => title || 'ACCENTRA',

    resolve: async (name) => {
        const pagePathJsx = `./pages/${name}.jsx`;
        const pagePathTsx = `./pages/${name}.tsx`;

        console.log('Requested page:', name);
        console.log('Available pages:', Object.keys(pages));

        const page = pages[pagePathJsx] || pages[pagePathTsx];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return await page();
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#36534E',
    },
});
