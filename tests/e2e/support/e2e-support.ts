import { expect, Page, TestInfo } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, '../../..');

function timestamp(): string {
    return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

const currentRunFile = path.join(root, '.e2e-current-run');

function resolveRunId(): string {
    if (process.env.E2E_RUN_ID) {
        fs.writeFileSync(currentRunFile, process.env.E2E_RUN_ID);
        return process.env.E2E_RUN_ID;
    }

    if (fs.existsSync(currentRunFile)) {
        const existing = fs.readFileSync(currentRunFile, 'utf8').trim();
        if (existing) {
            return existing;
        }
    }

    const next = `e2e-${timestamp()}`;
    fs.writeFileSync(currentRunFile, next);
    return next;
}

export const runId = resolveRunId();
const suffix = runId.replace(/\D/g, '').slice(-6).padStart(6, '0');
export const artifactDir = path.join(root, 'test-results/e2e-internwebcare', runId);

export type CandidateKind = 'approve' | 'reject';

export type Candidate = {
    kind: CandidateKind;
    name: string;
    email: string;
    password: string;
    phone: string;
    position: string;
    expectedFinalStatus: 'approved' | 'rejected';
    essayScore: string;
    projectScore: string;
    projectNotes: string;
    adminNotes: string;
    projectFixture: string;
};

export const state = {
    runId,
    artifactDir,
    storage: {
        admin: path.join(artifactDir, 'storage-states/admin.storageState.json'),
        approve: path.join(artifactDir, 'storage-states/candidate-approve.storageState.json'),
        reject: path.join(artifactDir, 'storage-states/candidate-reject.storageState.json'),
    },
    fixtures: {
        cvPath: path.join(artifactDir, 'fixtures/cv-e2e.pdf'),
        projectApprovePath: path.join(artifactDir, 'fixtures/project-approve.pdf'),
        projectRejectPath: path.join(artifactDir, 'fixtures/project-reject.pdf'),
    },
    candidates: {
        approve: {
            kind: 'approve',
            name: `E2E Approve Candidate ${runId}`,
            email: `candidate.approve.${runId}@example.test`,
            password: 'Password123!',
            phone: `081111${suffix}`,
            position: 'Web Developer',
            expectedFinalStatus: 'approved',
            essayScore: '1',
            projectScore: '90',
            projectNotes: 'Project submission E2E untuk approval.',
            adminNotes: `Approved by E2E test run ${runId}.`,
            projectFixture: path.join(artifactDir, 'fixtures/project-approve.pdf'),
        } satisfies Candidate,
        reject: {
            kind: 'reject',
            name: `E2E Reject Candidate ${runId}`,
            email: `candidate.reject.${runId}@example.test`,
            password: 'Password123!',
            phone: `082222${suffix}`,
            position: 'Graphic Designer',
            expectedFinalStatus: 'rejected',
            essayScore: '0',
            projectScore: '35',
            projectNotes: 'Project submission E2E untuk rejection.',
            adminNotes: `Rejected by E2E test run ${runId}.`,
            projectFixture: path.join(artifactDir, 'fixtures/project-reject.pdf'),
        } satisfies Candidate,
    },
};

const reportRows: Array<{ scenario: string; status: 'PASS' | 'FAIL'; detail: string }> = [];
const dbRows: Array<{ assertion: string; status: 'PASS' | 'FAIL'; detail: string }> = [];
const bugs: Array<{ severity: string; page: string; expected: string; actual: string; evidence: string }> = [];

export function addScenario(scenario: string, status: 'PASS' | 'FAIL', detail: string): void {
    reportRows.push({ scenario, status, detail });
}

export function addDbAssertion(assertion: string, status: 'PASS' | 'FAIL', detail: string): void {
    dbRows.push({ assertion, status, detail });
}

export function addBug(severity: string, page: string, expected: string, actual: string, evidence: string): void {
    bugs.push({ severity, page, expected, actual, evidence });
}

export function ensurePdfFixture(filePath: string, title: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (fs.existsSync(filePath)) {
        return;
    }

    const body = `BT /F1 18 Tf 72 720 Td (${title}) Tj ET`;
    const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length ${body.length} >> stream
${body}
endstream endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000311 00000 n 
trailer << /Root 1 0 R /Size 6 >>
startxref
${420 + body.length}
%%EOF
`;
    fs.writeFileSync(filePath, pdf);
}

export function dbJson<T>(php: string): T {
    const output = execFileSync('php', ['artisan', 'tinker', '--execute', php], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

    const objectStart = output.indexOf('{');
    const arrayStart = output.indexOf('[');
    const jsonStart = objectStart >= 0 && arrayStart >= 0
        ? Math.min(objectStart, arrayStart)
        : Math.max(objectStart, arrayStart);
    const jsonEnd = Math.max(output.lastIndexOf('}'), output.lastIndexOf(']'));
    if (jsonStart < 0) {
        throw new Error(`No JSON returned from tinker: ${output}`);
    }

    return JSON.parse(output.slice(jsonStart, jsonEnd + 1)) as T;
}

export function dbExec(php: string): void {
    execFileSync('php', ['artisan', 'tinker', '--execute', php], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    });
}

export async function attachBrowserDiagnostics(page: Page, testInfo: TestInfo, errors: string[], consoleErrors: string[]): Promise<void> {
    const body = await page.locator('body').innerText().catch(() => '');
    await testInfo.attach('browser-diagnostics', {
        body: JSON.stringify({
            url: page.url(),
            title: await page.title().catch(() => ''),
            errors,
            consoleErrors,
            bodySnippet: body.replace(/\s+/g, ' ').slice(0, 1000),
        }, null, 2),
        contentType: 'application/json',
    });
}

export async function assertNoBrowserErrors(errors: string[], consoleErrors: string[]): Promise<void> {
    const filteredConsoleErrors = consoleErrors.filter((message) => {
        return !message.includes('Failed to load resource: the server responded with a status of 404');
    });

    expect(errors, `page errors: ${errors.join('\n')}`).toEqual([]);
    expect(filteredConsoleErrors, `console errors: ${filteredConsoleErrors.join('\n')}`).toEqual([]);
}

export async function login(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await Promise.all([
        page.waitForURL(/dashboard|applications|email\/verify|two-factor-challenge/, { timeout: 30_000 }),
        page.getByRole('button', { name: /Masuk/ }).click(),
    ]);
}

export async function logout(page: Page): Promise<void> {
    await page.goto('/dashboard').catch(() => undefined);
    const logoutButton = page.getByRole('menuitem', { name: /Log out|Logout|Keluar/i });
    if (await logoutButton.count()) {
        await logoutButton.first().click();
        return;
    }
    await page.context().clearCookies();
}

export function userSnapshot(email: string) {
    return dbJson<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        cv_path: string | null;
        role: string;
        applications_count: number;
    }>(`
        $user = App\\Models\\User::where('email', '${email.replace(/'/g, "\\'")}')->withCount('applications')->firstOrFail();
        echo json_encode([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'cv_path' => $user->cv_path,
            'role' => $user->role,
            'applications_count' => $user->applications_count,
        ]);
    `);
}

export function applicationSnapshot(email: string) {
    return dbJson<{
        id: number;
        status: string;
        candidate_id: number;
        position_title: string;
        assessment_title: string;
        cv_snapshot: string | null;
        started_at: string | null;
        expires_at: string | null;
        submitted_at: string | null;
        total_score: string | null;
        reviewed_by: number | null;
        reviewed_at: string | null;
        admin_notes: string | null;
        questions_count: number;
        answers_count: number;
        mcq_answers_count: number;
        essay_answers_count: number;
        essay_scored_count: number;
        project_tasks_count: number;
        project_submissions_count: number;
        project_submitted_count: number;
        project_reviewed_count: number;
        project_files_count: number;
        project_score_notes_count: number;
    }>(`
        $candidate = App\\Models\\User::where('email', '${email.replace(/'/g, "\\'")}')->firstOrFail();
        $application = App\\Models\\Application::where('candidate_id', $candidate->id)
            ->with(['position', 'assessment.questions', 'assessment.projectTasks', 'answers.question', 'projectSubmissions'])
            ->latest('id')
            ->firstOrFail();
        echo json_encode([
            'id' => $application->id,
            'status' => $application->status,
            'candidate_id' => $application->candidate_id,
            'position_title' => $application->position?->title,
            'assessment_title' => $application->assessment?->title,
            'cv_snapshot' => $application->cv_snapshot,
            'started_at' => optional($application->started_at)->toIso8601String(),
            'expires_at' => optional($application->expires_at)->toIso8601String(),
            'submitted_at' => optional($application->submitted_at)->toIso8601String(),
            'total_score' => $application->total_score === null ? null : (string) $application->total_score,
            'reviewed_by' => $application->reviewed_by,
            'reviewed_at' => optional($application->reviewed_at)->toIso8601String(),
            'admin_notes' => $application->admin_notes,
            'questions_count' => $application->assessment->questions->count(),
            'answers_count' => $application->answers->count(),
            'mcq_answers_count' => $application->answers->filter(fn ($answer) => $answer->question?->type === 'multiple_choice' && $answer->score !== null)->count(),
            'essay_answers_count' => $application->answers->filter(fn ($answer) => $answer->question?->type === 'essay' && filled($answer->answer_text))->count(),
            'essay_scored_count' => $application->answers->filter(fn ($answer) => $answer->question?->type === 'essay' && $answer->score !== null && $answer->scored_by !== null && $answer->scored_at !== null)->count(),
            'project_tasks_count' => $application->assessment->projectTasks->count(),
            'project_submissions_count' => $application->projectSubmissions->count(),
            'project_submitted_count' => $application->projectSubmissions->where('status', 'submitted')->count(),
            'project_reviewed_count' => $application->projectSubmissions->where('status', 'reviewed')->count(),
            'project_files_count' => $application->projectSubmissions->filter(fn ($submission) => filled($submission->file_path) && Illuminate\\Support\\Facades\\Storage::disk('public')->exists($submission->file_path))->count(),
            'project_score_notes_count' => $application->projectSubmissions->filter(fn ($submission) => filled($submission->score_notes) && $submission->scored_by !== null && $submission->scored_at !== null)->count(),
        ]);
    `);
}

export function assessmentQuestions(email: string) {
    return dbJson<Array<{
        id: number;
        type: 'multiple_choice' | 'essay';
        question_text: string;
        options: string[];
        order_index: number;
    }>>(`
        $candidate = App\\Models\\User::where('email', '${email.replace(/'/g, "\\'")}')->firstOrFail();
        $application = App\\Models\\Application::where('candidate_id', $candidate->id)->latest('id')->firstOrFail();
        $questions = App\\Models\\Question::where('assessment_id', $application->assessment_id)
            ->orderBy('order_index')
            ->get()
            ->map(function ($question) {
                $options = $question->options;
                if (is_string($options)) {
                    $options = json_decode($options, true) ?: [];
                }
                return [
                    'id' => $question->id,
                    'type' => $question->type,
                    'question_text' => $question->question_text,
                    'options' => is_array($options) ? array_values($options) : [],
                    'order_index' => $question->order_index,
                ];
            })
            ->values();
        echo json_encode($questions);
    `);
}

export function writeReport(startedAt: string, endedAt: string): string {
    const reportPath = path.join(artifactDir, 'report.md');
    const verdict = reportRows.every((row) => row.status === 'PASS') && dbRows.every((row) => row.status === 'PASS') && bugs.length === 0
        ? 'PASS'
        : 'FAIL';

    const md = [
        `# InternWebcare E2E Test Report`,
        ``,
        `## Metadata`,
        ``,
        `| Field | Value |`,
        `| --- | --- |`,
        `| Verdict | ${verdict} |`,
        `| Run ID | ${runId} |`,
        `| Base URL | ${process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000'} |`,
        `| Browser | Chrome via Playwright |`,
        `| Started | ${startedAt} |`,
        `| Ended | ${endedAt} |`,
        ``,
        `## Test Accounts`,
        ``,
        `| Role | Email | Position | Expected Final Status |`,
        `| --- | --- | --- | --- |`,
        `| Admin | admin@gmail.com | - | - |`,
        `| Candidate approve | ${state.candidates.approve.email} | ${state.candidates.approve.position} | approved |`,
        `| Candidate reject | ${state.candidates.reject.email} | ${state.candidates.reject.position} | rejected |`,
        ``,
        `## Scenario Results`,
        ``,
        `| Scenario | Status | Detail |`,
        `| --- | --- | --- |`,
        ...reportRows.map((row) => `| ${row.scenario} | ${row.status} | ${row.detail.replace(/\|/g, '\\|')} |`),
        ``,
        `## Database Assertions`,
        ``,
        `| Assertion | Status | Detail |`,
        `| --- | --- | --- |`,
        ...dbRows.map((row) => `| ${row.assertion} | ${row.status} | ${row.detail.replace(/\|/g, '\\|')} |`),
        ``,
        `## Artifacts`,
        ``,
        `| Artifact | Path |`,
        `| --- | --- |`,
        `| Artifact directory | ${artifactDir} |`,
        `| CV fixture | ${state.fixtures.cvPath} |`,
        `| Approval project fixture | ${state.fixtures.projectApprovePath} |`,
        `| Rejection project fixture | ${state.fixtures.projectRejectPath} |`,
        `| HTML report | ${path.join(root, 'playwright-report/e2e-internwebcare/index.html')} |`,
        ``,
        `## Bug List`,
        ``,
        bugs.length
            ? `| Severity | Page | Expected | Actual | Evidence |\n| --- | --- | --- | --- | --- |\n${bugs.map((bug) => `| ${bug.severity} | ${bug.page} | ${bug.expected} | ${bug.actual} | ${bug.evidence} |`).join('\n')}`
            : `No bugs recorded by the automated suite.`,
        ``,
    ].join('\n');

    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, md);
    return reportPath;
}
