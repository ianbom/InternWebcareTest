import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit3,
    FileCode2,
    ListChecks,
    Plus,
    Timer,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FieldError } from '@/pages/shared/FieldError';
import { list as assessmentsList } from '@/routes/assessments';
import {
    store as taskStore,
    update as taskUpdate,
} from '@/routes/assessments/project-tasks';
import {
    store as questionStore,
    update as questionUpdate,
} from '@/routes/assessments/questions';
import type {
    AssessmentDetail,
    AssessmentProjectTask,
    AssessmentQuestion,
    ProjectTaskFormData,
    QuestionFormData,
    QuestionType,
} from '@/types';
import { AssessmentEmptyState } from './components/admin/AssessmentEmptyState';
import { formatDateTime } from './utils/assessment-format';

const EMPTY_QUESTION: QuestionFormData = {
    type: 'multiple_choice',
    question_text: '',
    options: ['', ''],
    correct_answer: '',
    point_value: '1',
    order_index: '1',
};

const EMPTY_TASK: ProjectTaskFormData = {
    title: '',
    description: '',
    deadline_hours: '24',
};

function formError(
    errors: Record<string, string | undefined>,
    key: string,
): string | undefined {
    return errors[key];
}

export default function AssessmentShow({
    assessment,
    position,
    questions,
    project_tasks,
}: AssessmentDetail) {
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] =
        useState<AssessmentQuestion | null>(null);
    const [editingTask, setEditingTask] =
        useState<AssessmentProjectTask | null>(null);

    const questionForm = useForm<QuestionFormData>(EMPTY_QUESTION);
    const taskForm = useForm<ProjectTaskFormData>(EMPTY_TASK);
    const questionErrors = questionForm.errors as Record<
        string,
        string | undefined
    >;

    const openCreateQuestion = () => {
        setEditingQuestion(null);
        questionForm.clearErrors();
        questionForm.setData({
            ...EMPTY_QUESTION,
            order_index: String(questions.length + 1),
        });
        setQuestionDialogOpen(true);
    };

    const openEditQuestion = (question: AssessmentQuestion) => {
        setEditingQuestion(question);
        questionForm.clearErrors();
        questionForm.setData({
            type: question.type,
            question_text: question.question_text,
            options: question.options.length > 0 ? question.options : ['', ''],
            correct_answer: question.correct_answer ?? '',
            point_value: String(question.point_value),
            order_index: String(question.order_index),
        });
        setQuestionDialogOpen(true);
    };

    const closeQuestionDialog = () => {
        setQuestionDialogOpen(false);
        setEditingQuestion(null);
        questionForm.clearErrors();
        questionForm.setData({ ...EMPTY_QUESTION });
    };

    const setQuestionType = (type: QuestionType) => {
        questionForm.setData({
            ...questionForm.data,
            type,
            options:
                type === 'multiple_choice' &&
                questionForm.data.options.length < 2
                    ? ['', '']
                    : questionForm.data.options,
            correct_answer:
                type === 'essay' ? '' : questionForm.data.correct_answer,
        });
    };

    const setOption = (index: number, value: string) => {
        questionForm.setData(
            'options',
            questionForm.data.options.map((option, optionIndex) =>
                optionIndex === index ? value : option,
            ),
        );
    };

    const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: closeQuestionDialog,
        };

        if (editingQuestion) {
            questionForm.put(
                questionUpdate.url({
                    assessment: assessment.id,
                    question: editingQuestion.id,
                }),
                options,
            );

            return;
        }

        questionForm.post(questionStore.url(assessment.id), options);
    };

    const openCreateTask = () => {
        setEditingTask(null);
        taskForm.clearErrors();
        taskForm.setData({ ...EMPTY_TASK });
        setTaskDialogOpen(true);
    };

    const openEditTask = (task: AssessmentProjectTask) => {
        setEditingTask(task);
        taskForm.clearErrors();
        taskForm.setData({
            title: task.title,
            description: task.description,
            deadline_hours: String(task.deadline_hours),
        });
        setTaskDialogOpen(true);
    };

    const closeTaskDialog = () => {
        setTaskDialogOpen(false);
        setEditingTask(null);
        taskForm.clearErrors();
        taskForm.setData({ ...EMPTY_TASK });
    };

    const submitTask = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: closeTaskDialog,
        };

        if (editingTask) {
            taskForm.put(
                taskUpdate.url({
                    assessment: assessment.id,
                    projectTask: editingTask.id,
                }),
                options,
            );

            return;
        }

        taskForm.post(taskStore.url(assessment.id), options);
    };

    return (
        <>
            <Head title={`Assessment - ${assessment.title}`} />
            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full bg-white"
                    >
                        <Link href={assessmentsList.url()}>
                            <ArrowLeft className="size-4" />
                            Back to Assessments
                        </Link>
                    </Button>

                    <section className="overflow-hidden rounded-[32px] bg-[#102B5C] text-white shadow-[0_28px_80px_rgba(16,43,92,0.24)]">
                        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
                            <div>
                                <p className="text-xs font-bold tracking-[0.28em] text-[#8FB4FF] uppercase">
                                    Assessment Detail
                                </p>
                                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                    {assessment.title}
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                                    Untuk posisi {position.title}. Kelola bank
                                    soal dan project task dari halaman ini.
                                </p>
                            </div>
                            <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-white/15 p-3">
                                        <Timer className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100">
                                            Duration
                                        </p>
                                        <p className="text-4xl font-black">
                                            {assessment.duration_minutes}m
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <p className="text-blue-100">
                                            Questions
                                        </p>
                                        <p className="mt-1 text-2xl font-black">
                                            {questions.length}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <p className="text-blue-100">
                                            Project tasks
                                        </p>
                                        <p className="mt-1 text-2xl font-black">
                                            {project_tasks.length}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs leading-5 text-blue-100">
                                    Updated {formatDateTime(assessment.updated_at)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
                        <Card className="rounded-[28px] border-[#DCE3F2] shadow-[0_18px_60px_rgba(16,43,92,0.08)]">
                            <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#102B5C]">
                                        <ListChecks className="size-6 text-[#1D449C]" />
                                        Questions
                                    </CardTitle>
                                    <CardDescription>
                                        Tambah atau edit MCQ dan essay question.
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={openCreateQuestion}
                                    className="rounded-full bg-[#1D449C] font-bold hover:bg-[#17377E]"
                                >
                                    <Plus className="size-4" />
                                    Add Question
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {questions.map((question) => (
                                    <article
                                        key={question.id}
                                        className="rounded-3xl border border-[#E7ECF6] bg-[#F9FBFF] p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <Badge className="rounded-full bg-[#102B5C] text-white hover:bg-[#102B5C]">
                                                        #{question.order_index}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full capitalize"
                                                    >
                                                        {question.type.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full"
                                                    >
                                                        {question.point_value}{' '}
                                                        pts
                                                    </Badge>
                                                </div>
                                                <p className="text-sm leading-6 whitespace-pre-line text-[#102B5C]">
                                                    {question.question_text}
                                                </p>
                                                {question.type ===
                                                    'multiple_choice' && (
                                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                        {question.options.map(
                                                            (option, index) => (
                                                                <div
                                                                    key={`${option}-${index}`}
                                                                    className="rounded-2xl bg-white px-3 py-2 text-sm text-[#526078]"
                                                                >
                                                                    {option}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    openEditQuestion(question)
                                                }
                                                className="rounded-full"
                                            >
                                                <Edit3 className="size-4" />
                                                Edit
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                                {questions.length === 0 && (
                                    <AssessmentEmptyState text="Belum ada question. Tambahkan item pertama." />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-[#DCE3F2] shadow-[0_18px_60px_rgba(16,43,92,0.08)]">
                            <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#102B5C]">
                                        <FileCode2 className="size-6 text-[#1D449C]" />
                                        Project Tasks
                                    </CardTitle>
                                    <CardDescription>
                                        Tambah atau edit tugas project untuk
                                        assessment ini.
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={openCreateTask}
                                    className="rounded-full bg-[#1D449C] font-bold hover:bg-[#17377E]"
                                >
                                    <Plus className="size-4" />
                                    Add Task
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {project_tasks.map((task) => (
                                    <article
                                        key={task.id}
                                        className="rounded-3xl border border-[#E7ECF6] bg-[#F9FBFF] p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <Badge className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">
                                                        {task.deadline_hours}{' '}
                                                        jam
                                                    </Badge>
                                                </div>
                                                <h3 className="font-black text-[#102B5C]">
                                                    {task.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 whitespace-pre-line text-[#526078]">
                                                    {task.description}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    openEditTask(task)
                                                }
                                                className="rounded-full"
                                            >
                                                <Edit3 className="size-4" />
                                                Edit
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                                {project_tasks.length === 0 && (
                                    <AssessmentEmptyState text="Belum ada project task. Tambahkan tugas pertama." />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog
                open={questionDialogOpen}
                onOpenChange={(open) =>
                    open ? setQuestionDialogOpen(true) : closeQuestionDialog()
                }
            >
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[28px]">
                    <form onSubmit={submitQuestion} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#102B5C]">
                                {editingQuestion
                                    ? 'Edit Question'
                                    : 'Create Question'}
                            </DialogTitle>
                            <DialogDescription>
                                MCQ wajib memiliki minimal dua opsi dan correct
                                answer.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={questionForm.data.type}
                                    onValueChange={(value) =>
                                        setQuestionType(value as QuestionType)
                                    }
                                >
                                    <SelectTrigger className="h-11 rounded-2xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="multiple_choice">
                                            Multiple Choice
                                        </SelectItem>
                                        <SelectItem value="essay">
                                            Essay
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    message={questionForm.errors.type}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="question-point">
                                        Point
                                    </Label>
                                    <Input
                                        id="question-point"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={questionForm.data.point_value}
                                        onChange={(event) =>
                                            questionForm.setData(
                                                'point_value',
                                                event.target.value,
                                            )
                                        }
                                        className="rounded-2xl"
                                    />
                                    <FieldError
                                        message={
                                            questionForm.errors.point_value
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="question-order">
                                        Order
                                    </Label>
                                    <Input
                                        id="question-order"
                                        type="number"
                                        min="1"
                                        value={questionForm.data.order_index}
                                        onChange={(event) =>
                                            questionForm.setData(
                                                'order_index',
                                                event.target.value,
                                            )
                                        }
                                        className="rounded-2xl"
                                    />
                                    <FieldError
                                        message={
                                            questionForm.errors.order_index
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question-text">Question Text</Label>
                            <Textarea
                                id="question-text"
                                value={questionForm.data.question_text}
                                onChange={(event) =>
                                    questionForm.setData(
                                        'question_text',
                                        event.target.value,
                                    )
                                }
                                className="min-h-32 rounded-2xl"
                                placeholder="Tuliskan pertanyaan..."
                            />
                            <FieldError
                                message={questionForm.errors.question_text}
                            />
                        </div>

                        {questionForm.data.type === 'multiple_choice' && (
                            <div className="space-y-3 rounded-3xl border border-[#E7ECF6] bg-[#F9FBFF] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <Label>Options</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            questionForm.setData('options', [
                                                ...questionForm.data.options,
                                                '',
                                            ])
                                        }
                                        className="rounded-full"
                                    >
                                        <Plus className="size-4" />
                                        Add Option
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    {questionForm.data.options.map(
                                        (option, index) => (
                                            <Input
                                                key={index}
                                                value={option}
                                                onChange={(event) =>
                                                    setOption(
                                                        index,
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder={`Option ${index + 1}`}
                                                className="rounded-2xl bg-white"
                                            />
                                        ),
                                    )}
                                </div>
                                <FieldError
                                    message={
                                        questionForm.errors.options ??
                                        formError(questionErrors, 'options.0')
                                    }
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="correct-answer">
                                        Correct Answer
                                    </Label>
                                    <Input
                                        id="correct-answer"
                                        value={questionForm.data.correct_answer}
                                        onChange={(event) =>
                                            questionForm.setData(
                                                'correct_answer',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Isi persis dengan salah satu opsi"
                                        className="rounded-2xl bg-white"
                                    />
                                    <FieldError
                                        message={
                                            questionForm.errors.correct_answer
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeQuestionDialog}
                                disabled={questionForm.processing}
                                className="rounded-full"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={questionForm.processing}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                            >
                                {questionForm.processing
                                    ? 'Saving...'
                                    : 'Save Question'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={taskDialogOpen}
                onOpenChange={(open) =>
                    open ? setTaskDialogOpen(true) : closeTaskDialog()
                }
            >
                <DialogContent className="max-w-2xl rounded-[28px]">
                    <form onSubmit={submitTask} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#102B5C]">
                                {editingTask
                                    ? 'Edit Project Task'
                                    : 'Create Project Task'}
                            </DialogTitle>
                            <DialogDescription>
                                Deadline dihitung dalam jam sejak kandidat apply
                                position.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="task-title">Title</Label>
                                <Input
                                    id="task-title"
                                    value={taskForm.data.title}
                                    onChange={(event) =>
                                        taskForm.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    className="rounded-2xl"
                                    placeholder="Build mini landing page"
                                />
                                <FieldError message={taskForm.errors.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="task-description"
                                    value={taskForm.data.description}
                                    onChange={(event) =>
                                        taskForm.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-32 rounded-2xl"
                                    placeholder="Tuliskan instruksi project task..."
                                />
                                <FieldError
                                    message={taskForm.errors.description}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task-deadline">
                                    Deadline Hours
                                </Label>
                                <Input
                                    id="task-deadline"
                                    type="number"
                                    min="1"
                                    value={taskForm.data.deadline_hours}
                                    onChange={(event) =>
                                        taskForm.setData(
                                            'deadline_hours',
                                            event.target.value,
                                        )
                                    }
                                    className="rounded-2xl"
                                />
                                <FieldError
                                    message={taskForm.errors.deadline_hours}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeTaskDialog}
                                disabled={taskForm.processing}
                                className="rounded-full"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={taskForm.processing}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                            >
                                {taskForm.processing
                                    ? 'Saving...'
                                    : 'Save Project Task'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
