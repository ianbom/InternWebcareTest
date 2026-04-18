import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120_000,
    expect: {
        timeout: 15_000,
    },
    fullyParallel: false,
    workers: 1,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report/e2e-internwebcare', open: 'never' }],
    ],
    globalSetup: './tests/e2e/global-setup.ts',
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 20_000,
        navigationTimeout: 30_000,
    },
    projects: [
        {
            name: 'chrome',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
            },
        },
    ],
});
