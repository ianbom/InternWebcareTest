import { chromium, expect, request } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dbJson, ensurePdfFixture, runId, state } from './support/e2e-support';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

async function globalSetup() {
    const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000';
    const artifactDir = path.join(root, 'test-results/e2e-internwebcare', runId);

    fs.mkdirSync(artifactDir, { recursive: true });
    fs.mkdirSync(path.join(artifactDir, 'storage-states'), { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'run-state.json'), JSON.stringify(state, null, 2));

    ensurePdfFixture(state.fixtures.cvPath, 'E2E CV fixture');
    ensurePdfFixture(state.fixtures.projectApprovePath, 'E2E approval project fixture');
    ensurePdfFixture(state.fixtures.projectRejectPath, 'E2E rejection project fixture');

    const api = await request.newContext({ baseURL });
    const home = await api.get('/');
    expect(home.status(), 'home page should be reachable').toBe(200);
    await api.dispose();

    const readiness = dbJson<{
        admin: { id: number; role: string; password_ok: boolean } | null;
        positions: Array<{
            id: number;
            title: string;
            assessment_id: number | null;
            questions_count: number;
            mcq_count: number;
            essay_count: number;
            project_tasks_count: number;
        }>;
    }>(`
        $admin = App\\Models\\User::where('email', 'admin@gmail.com')->first();
        $positions = App\\Models\\Position::query()
            ->whereIn('title', ['Web Developer', 'Graphic Designer'])
            ->where('is_active', true)
            ->with(['assessments.questions', 'assessments.projectTasks'])
            ->orderBy('title')
            ->get()
            ->map(function ($position) {
                $assessment = $position->assessments->sortBy('id')->first();
                return [
                    'id' => $position->id,
                    'title' => $position->title,
                    'assessment_id' => $assessment?->id,
                    'questions_count' => $assessment ? $assessment->questions->count() : 0,
                    'mcq_count' => $assessment ? $assessment->questions->where('type', 'multiple_choice')->count() : 0,
                    'essay_count' => $assessment ? $assessment->questions->where('type', 'essay')->count() : 0,
                    'project_tasks_count' => $assessment ? $assessment->projectTasks->count() : 0,
                ];
            })
            ->values();
        echo json_encode([
            'admin' => $admin ? [
                'id' => $admin->id,
                'role' => $admin->role,
                'password_ok' => Illuminate\\Support\\Facades\\Hash::check('admin123', $admin->password),
            ] : null,
            'positions' => $positions,
        ]);
    `);

    expect(readiness.admin, 'admin seed should exist').not.toBeNull();
    expect(readiness.admin?.role, 'admin role should be admin').toBe('admin');
    expect(readiness.admin?.password_ok, 'admin password should match plan').toBe(true);
    expect(readiness.positions, 'target positions should exist').toHaveLength(2);
    for (const position of readiness.positions) {
        expect(position.assessment_id, `${position.title} should have an assessment`).not.toBeNull();
        expect(position.questions_count, `${position.title} should have five questions`).toBeGreaterThanOrEqual(5);
        expect(position.mcq_count, `${position.title} should have MCQs`).toBeGreaterThanOrEqual(3);
        expect(position.essay_count, `${position.title} should have essays`).toBeGreaterThanOrEqual(2);
        expect(position.project_tasks_count, `${position.title} should have a project task`).toBeGreaterThanOrEqual(1);
    }

    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ baseURL });
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('admin@gmail.com');
    await page.locator('input[name="password"]').fill('admin123');
    await Promise.all([
        page.waitForURL(/applications|dashboard/, { timeout: 30_000 }),
        page.getByRole('button', { name: /Masuk/ }).click(),
    ]);
    await page.context().storageState({ path: state.storage.admin });
    await browser.close();
}

export default globalSetup;
