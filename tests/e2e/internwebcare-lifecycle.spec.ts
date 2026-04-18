import { expect, test } from '@playwright/test';
import {
    addDbAssertion,
    addScenario,
    applicationSnapshot,
    assessmentQuestions,
    assertNoBrowserErrors,
    attachBrowserDiagnostics,
    Candidate,
    state,
    userSnapshot,
    writeReport,
} from './support/e2e-support';

const startedAt = new Date().toISOString();

test.describe.configure({ mode: 'serial' });

test.afterAll(async () => {
    const reportPath = writeReport(startedAt, new Date().toISOString());
    console.log(`E2E Markdown report: ${reportPath}`);
});

test.beforeEach(async ({ page }, testInfo) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });

    testInfo.attachments.push({
        name: 'e2e-error-buckets',
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify({ pageErrors, consoleErrors })),
    });
    (testInfo as typeof testInfo & { pageErrors: string[]; consoleErrors: string[] }).pageErrors = pageErrors;
    (testInfo as typeof testInfo & { pageErrors: string[]; consoleErrors: string[] }).consoleErrors = consoleErrors;
});

test.afterEach(async ({ page }, testInfo) => {
    const buckets = testInfo as typeof testInfo & { pageErrors?: string[]; consoleErrors?: string[] };
    await attachBrowserDiagnostics(page, testInfo, buckets.pageErrors ?? [], buckets.consoleErrors ?? []);

    if (testInfo.status !== testInfo.expectedStatus) {
        addScenario(testInfo.title, 'FAIL', `Failed at ${page.url()}`);
    }
});

async function registerCandidate(page, candidate: Candidate, storagePath: string): Promise<void> {
    await page.goto('/register');
    await page.locator('input[name="name"]').fill(candidate.name);
    await page.locator('input[name="email"]').fill(candidate.email);
    await page.locator('input[name="password"]').fill(candidate.password);
    await page.locator('input[name="password_confirmation"]').fill(candidate.password);
    await Promise.all([
        page.waitForURL(/dashboard|email\/verify/, { timeout: 30_000 }),
        page.getByRole('button', { name: /Buat akun/ }).click(),
    ]);

    await expect(page.locator('body')).toContainText(/Dashboard/);
    await expect(page.locator('body')).toContainText(/Posisi Magang/);
    await expect(page.locator('body')).toContainText(/Assesment/);
    await expect(page.locator('body')).toContainText(/Profil/);
    await page.context().storageState({ path: storagePath });

    const user = userSnapshot(candidate.email);
    expect(user.role).toBe('candidate');
    expect(user.name).toBe(candidate.name);
    expect(user.phone).toBeNull();
    expect(user.cv_path).toBeNull();
    expect(user.applications_count).toBe(0);
    addDbAssertion(`${candidate.kind} register user`, 'PASS', `${candidate.email} role=${user.role}`);
    addScenario(`${candidate.kind} register`, 'PASS', `Registered ${candidate.email}`);
}

async function completeProfile(page, candidate: Candidate): Promise<void> {
    await page.goto('/settings/profile');
    await page.locator('input[name="name"]').fill(candidate.name);
    await page.locator('input[name="email"]').fill(candidate.email);
    await page.locator('input[name="phone"]').fill(candidate.phone);
    await page.locator('input[name="cv"]').setInputFiles(state.fixtures.cvPath);
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByRole('button', { name: /^Save$/ })).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/The .* field|must be|invalid/i);

    await expect.poll(() => userSnapshot(candidate.email).cv_path).not.toBeNull();
    const user = userSnapshot(candidate.email);
    expect(user.phone).toBe(candidate.phone);
    expect(user.cv_path).toBeTruthy();
    addDbAssertion(`${candidate.kind} profile`, 'PASS', `phone=${user.phone}, cv=${user.cv_path}`);
    addScenario(`${candidate.kind} profile completion`, 'PASS', `Profile completed for ${candidate.email}`);
}

async function applyToPosition(page, candidate: Candidate): Promise<void> {
    await page.goto('/positions');
    await page.locator('input[placeholder="Cari posisi..."]').fill(candidate.position);
    const card = page.locator('.group').filter({ hasText: candidate.position }).first();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: /Daftar Sekarang/ }).click();
    await expect(page.getByRole('dialog')).toContainText(candidate.position);
    await page.getByRole('button', { name: /Lanjut Daftar/ }).click();
    await expect(page.getByText(/Anda sedang dalam proses seleksi/)).toBeVisible();

    const application = applicationSnapshot(candidate.email);
    const user = userSnapshot(candidate.email);
    expect(application.status).toBe('pending');
    expect(application.candidate_id).toBe(user.id);
    expect(application.position_title).toBe(candidate.position);
    expect(application.cv_snapshot).toBe(user.cv_path);
    expect(application.project_submissions_count).toBe(application.project_tasks_count);
    expect(application.project_submitted_count).toBe(0);
    addDbAssertion(`${candidate.kind} application pending`, 'PASS', `application=${application.id}, project submissions=${application.project_submissions_count}`);
    addScenario(`${candidate.kind} apply position`, 'PASS', `${candidate.position} application=${application.id}`);
}

async function startAssessment(page, candidate: Candidate): Promise<void> {
    await page.goto('/my-assesment');
    await expect(page.locator('body')).toContainText(candidate.position);
    await page.getByRole('button', { name: /Mulai Quiz/ }).click();
    await expect(page.getByText(/Peraturan Assessment/)).toBeVisible();
    await Promise.all([
        page.waitForURL(/\/assesment\/\d+\/take/, { timeout: 30_000 }),
        page.getByRole('button', { name: /Mulai Quiz Sekarang/ }).click(),
    ]);
    await expect(page.getByText(/Question Map/)).toBeVisible();
    await expect(page.getByText(/Pilihan Ganda/)).toBeVisible();

    const application = applicationSnapshot(candidate.email);
    expect(application.status).toBe('in_progress');
    expect(application.started_at).toBeTruthy();
    expect(application.expires_at).toBeTruthy();
    addDbAssertion(`${candidate.kind} assessment started`, 'PASS', `started=${application.started_at}`);
    addScenario(`${candidate.kind} start assessment`, 'PASS', `Assessment started for application=${application.id}`);
}

async function answerAndSubmitQuiz(page, candidate: Candidate): Promise<void> {
    const questions = assessmentQuestions(candidate.email);
    const mcqQuestions = questions.filter((question) => question.type === 'multiple_choice');
    const essayQuestions = questions.filter((question) => question.type === 'essay');
    const answerIndexes = [0, 1, 2];

    for (let i = 0; i < mcqQuestions.length; i += 1) {
        const question = mcqQuestions[i];
        const optionText = question.options[answerIndexes[i] ?? 0] ?? question.options[0];
        await page.getByRole('button', { name: new RegExp(optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).click();

        if (i < mcqQuestions.length - 1) {
            await page.getByRole('button', { name: /Next|Go to Essay Phase/ }).click();
        } else {
            await page.getByRole('button', { name: /Go to Essay Phase/ }).click();
        }
    }

    for (let i = 0; i < essayQuestions.length; i += 1) {
        await page.locator('textarea').fill(`Jawaban essay E2E untuk candidate ${candidate.kind} soal ${i + 1}.`);
        if (i < essayQuestions.length - 1) {
            await page.getByRole('button', { name: /^Next$/ }).click();
        }
    }

    await page.getByRole('button', { name: /Submit Assesment/ }).click();
    const dialog = page.getByRole('dialog', { name: /Submit Jawaban/ });
    if (await dialog.count()) {
        await dialog.getByRole('button', { name: /Ya, Kumpulkan/ }).click();
    }
    await page.waitForURL(/my-assesment/, { timeout: 30_000 });

    await expect.poll(() => applicationSnapshot(candidate.email).status).toBe('submitted');
    const application = applicationSnapshot(candidate.email);
    expect(application.answers_count).toBe(application.questions_count);
    expect(application.mcq_answers_count).toBeGreaterThanOrEqual(3);
    expect(application.essay_answers_count).toBeGreaterThanOrEqual(2);
    expect(application.total_score).not.toBeNull();
    addDbAssertion(`${candidate.kind} quiz submitted`, 'PASS', `answers=${application.answers_count}, score=${application.total_score}`);
    addScenario(`${candidate.kind} quiz submit`, 'PASS', `Application ${application.id} is submitted`);
}

async function uploadProject(page, candidate: Candidate): Promise<void> {
    await page.goto('/my-assesment');
    await expect(page.locator('body')).toContainText(/Tahap 2|Project|Proyek/);
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
        await fileInputs.nth(i).setInputFiles(candidate.projectFixture);
    }
    const notesFields = page.locator('textarea, input[placeholder*="catatan"], input[placeholder*="link"]');
    const notesCount = await notesFields.count();
    for (let i = 0; i < notesCount; i += 1) {
        await notesFields.nth(i).fill(candidate.projectNotes);
    }

    const submitButtons = page.getByRole('button', { name: /Kirim Project/ });
    const submitCount = await submitButtons.count();
    for (let i = 0; i < submitCount; i += 1) {
        if (await submitButtons.nth(i).isEnabled()) {
            await submitButtons.nth(i).click();
            await page.waitForLoadState('networkidle').catch(() => undefined);
        }
    }

    await expect.poll(() => applicationSnapshot(candidate.email).status).toBe('under_review');
    const application = applicationSnapshot(candidate.email);
    expect(application.project_submitted_count).toBe(application.project_submissions_count);
    expect(application.project_files_count).toBe(application.project_submissions_count);
    addDbAssertion(`${candidate.kind} project uploaded`, 'PASS', `files=${application.project_files_count}`);
    addScenario(`${candidate.kind} project upload`, 'PASS', `Application ${application.id} is under_review`);
}

async function runCandidateFlow(page, candidate: Candidate, storagePath: string): Promise<void> {
    await registerCandidate(page, candidate, storagePath);
    await completeProfile(page, candidate);
    await applyToPosition(page, candidate);
    await startAssessment(page, candidate);
    await answerAndSubmitQuiz(page, candidate);
    await uploadProject(page, candidate);
}

async function openAdminApplication(page, candidate: Candidate): Promise<void> {
    await page.goto('/applications');
    await page.locator('input[placeholder*="Search"]').fill(candidate.email);
    await page.getByRole('button', { name: /Apply/ }).click();
    await expect(page.locator('table')).toContainText(candidate.email);
    await expect(page.locator('table')).toContainText(candidate.position);
    await expect(page.locator('table')).toContainText(/Under Review/);
    await page.getByRole('link', { name: /Detail/ }).first().click();
    await expect(page.locator('body')).toContainText(candidate.name);
    await expect(page.locator('body')).toContainText(candidate.email);
    await expect(page.locator('body')).toContainText(candidate.phone);
    await expect(page.locator('body')).toContainText(/MCQ Answers/);
    await expect(page.locator('body')).toContainText(/Essay Answers/);
    await expect(page.locator('body')).toContainText(/Project Submissions/);
    await expect(page.locator('body')).toContainText(candidate.projectNotes);
    addScenario(`admin detail ${candidate.kind}`, 'PASS', `Admin opened ${candidate.email}`);
}

async function reviewApplication(page, candidate: Candidate): Promise<void> {
    await openAdminApplication(page, candidate);

    const essayScoreInputs = page.locator('section').filter({ hasText: /Essay Answers/ }).locator('input[type="number"]');
    for (let i = 0; i < await essayScoreInputs.count(); i += 1) {
        await essayScoreInputs.nth(i).fill(candidate.essayScore);
    }

    const projectSection = page.locator('section').filter({ hasText: /Project Submissions/ });
    const projectScoreInputs = projectSection.locator('input[type="number"]');
    for (let i = 0; i < await projectScoreInputs.count(); i += 1) {
        await projectScoreInputs.nth(i).fill(candidate.projectScore);
    }
    const projectNotesFields = projectSection.locator('textarea');
    for (let i = 0; i < await projectNotesFields.count(); i += 1) {
        await projectNotesFields.nth(i).fill(
            candidate.kind === 'approve'
                ? 'Project memenuhi kriteria E2E approval.'
                : 'Project belum memenuhi kriteria E2E rejection.',
        );
    }

    await page.locator('select').filter({ hasText: /Under Review|Approved|Rejected/ }).last().selectOption(candidate.expectedFinalStatus);
    await page.locator('textarea').filter({ hasText: '' }).last().fill(candidate.adminNotes);
    await page.getByRole('button', { name: /Save Review/ }).last().click();
    await expect(page.locator('body')).toContainText(candidate.expectedFinalStatus === 'approved' ? 'Approved' : 'Rejected');

    await expect.poll(() => applicationSnapshot(candidate.email).status).toBe(candidate.expectedFinalStatus);
    const application = applicationSnapshot(candidate.email);
    expect(application.reviewed_by).toBeTruthy();
    expect(application.reviewed_at).toBeTruthy();
    expect(application.admin_notes).toBe(candidate.adminNotes);
    expect(application.essay_scored_count).toBeGreaterThanOrEqual(2);
    expect(application.project_reviewed_count).toBe(application.project_submissions_count);
    expect(application.project_score_notes_count).toBe(application.project_submissions_count);
    addDbAssertion(`admin ${candidate.expectedFinalStatus} ${candidate.kind}`, 'PASS', `reviewed_by=${application.reviewed_by}`);
    addScenario(`admin ${candidate.expectedFinalStatus}`, 'PASS', `${candidate.email} -> ${candidate.expectedFinalStatus}`);
}

async function assertCandidateFinalState(page, candidate: Candidate): Promise<void> {
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(candidate.email);
    await page.locator('input[name="password"]').fill(candidate.password);
    await Promise.all([
        page.waitForURL(/dashboard|my-assesment/, { timeout: 30_000 }),
        page.getByRole('button', { name: /Masuk/ }).click(),
    ]);
    await page.goto('/my-assesment');
    await expect(page.locator('body')).toContainText(candidate.position);
    await expect(page.locator('body')).toContainText(candidate.expectedFinalStatus === 'approved' ? /diterima|approved|selamat/i : /rejected|ditolak|belum/i);
    await expect(page.locator('body')).toContainText(/disembunyikan|final/i);
    addScenario(`candidate final ${candidate.kind}`, 'PASS', `${candidate.email} sees ${candidate.expectedFinalStatus}`);
}

test('candidate approve lifecycle reaches under review', async ({ page }, testInfo) => {
    await runCandidateFlow(page, state.candidates.approve, state.storage.approve);
    const buckets = testInfo as typeof testInfo & { pageErrors?: string[]; consoleErrors?: string[] };
    await assertNoBrowserErrors(buckets.pageErrors ?? [], buckets.consoleErrors ?? []);
});

test('candidate reject lifecycle reaches under review', async ({ page }, testInfo) => {
    await runCandidateFlow(page, state.candidates.reject, state.storage.reject);
    const buckets = testInfo as typeof testInfo & { pageErrors?: string[]; consoleErrors?: string[] };
    await assertNoBrowserErrors(buckets.pageErrors ?? [], buckets.consoleErrors ?? []);
});

test('admin reviews one application as approved and one as rejected', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ storageState: state.storage.admin });
    const page = await context.newPage();
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });

    await page.goto('/applications');
    await expect(page.locator('body')).toContainText(/Application Queue/);
    await reviewApplication(page, state.candidates.approve);
    await reviewApplication(page, state.candidates.reject);
    await attachBrowserDiagnostics(page, testInfo, pageErrors, consoleErrors);
    await assertNoBrowserErrors(pageErrors, consoleErrors);
    await context.close();
});

test('candidates see final application states', async ({ browser }, testInfo) => {
    for (const candidate of [state.candidates.approve, state.candidates.reject]) {
        const context = await browser.newContext();
        const page = await context.newPage();
        const pageErrors: string[] = [];
        const consoleErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') {
                consoleErrors.push(message.text());
            }
        });
        await assertCandidateFinalState(page, candidate);
        await attachBrowserDiagnostics(page, testInfo, pageErrors, consoleErrors);
        await assertNoBrowserErrors(pageErrors, consoleErrors);
        await context.close();
    }
});
