import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig, lazyPlugins, loadEnv } from 'vite-plus';

export default defineConfig(({ mode }) => {
    const { APP_URL, VITE_DEV_SERVER_URL } = loadEnv(
        mode,
        process.cwd(),
        '',
    );
    const appHost = APP_URL ? new URL(APP_URL).hostname : 'localhost';
    const devServerUrl = VITE_DEV_SERVER_URL
        ? new URL(VITE_DEV_SERVER_URL)
        : null;

    return {
        plugins: lazyPlugins(() => [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
                fonts: [
                    bunny('Instrument Sans', {
                        weights: [400, 500, 600],
                    }),
                ],
            }),
            inertia(),
            react(),
            babel({
                presets: [reactCompilerPreset()],
            }),
            tailwindcss(),
            wayfinder({
                formVariants: true,
            }),
        ]),
        server: {
            host: '0.0.0.0',
            ...(devServerUrl
                ? {
                      origin: devServerUrl.origin,
                      allowedHosts: ['.devtunnels.ms'],
                  }
                : {}),
            hmr: {
                ...(devServerUrl
                    ? {
                          host: devServerUrl.hostname,
                          protocol:
                              devServerUrl.protocol === 'https:'
                                  ? 'wss'
                                  : 'ws',
                          clientPort:
                              Number(devServerUrl.port) ||
                              (devServerUrl.protocol === 'https:' ? 443 : 80),
                      }
                    : { host: appHost }),
            },
            watch: {
                ignored: [
                    '**/.agents/**',
                    '**/.claude/**',
                    '**/.cursor/**',
                    '**/.junie/**',
                    '**/vendor/**',
                ],
            },
        },
        lint: {
            ignorePatterns: [
                'vendor/**',
                'node_modules/**',
                'public/**',
                'bootstrap/ssr/**',
                'tailwind.config.js',
                'resources/js/actions/**',
                'resources/js/components/ui/*',
                'resources/js/routes/**',
                'resources/js/wayfinder/**',
            ],
            options: {
                denyWarnings: true,
                typeAware: true,
            },
        },
        fmt: {
            printWidth: 80,
            tabWidth: 4,
            singleQuote: true,
            semi: true,
            singleAttributePerLine: false,
            htmlWhitespaceSensitivity: 'css',
            ignorePatterns: [
                '.github/**',
                'composer.json',
                'resources/js/components/ui/*',
                'resources/views/mail/*',
            ],
            sortTailwindcss: {
                functions: ['clsx', 'cn', 'cva'],
                stylesheet: 'resources/css/app.css',
            },
        },
    };
});
