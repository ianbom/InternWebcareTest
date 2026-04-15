import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRightLeft,
    Bell,
    ChevronDown,
    History,
    House,
    Landmark,
    MoreVertical,
    PiggyBank,
    Plane,
    Plus,
    Shield,
    SlidersHorizontal,
    Wallet,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

const summaryCards = [
    { title: 'Total Income', amount: '$78,000', change: '+ 1.78 %', icon: Wallet, tone: 'positive' },
    { title: 'Total Expense', amount: '$43,000', change: '- 1.78 %', icon: ArrowRightLeft, tone: 'negative' },
    { title: 'Total Savings', amount: '$56,000', change: '+ 1.24 %', icon: PiggyBank, tone: 'positive' },
] as const;

const cashflowData = [
    { month: 'Jan', income: 66, expense: 42 },
    { month: 'Feb', income: 48, expense: 58 },
    { month: 'Mar', income: 54, expense: 54 },
    { month: 'Apr', income: 70, expense: 28 },
    { month: 'May', income: 58, expense: 44 },
    { month: 'Jun', income: 62, expense: 40 },
    { month: 'Jul', income: 45, expense: 36 },
    { month: 'Aug', income: 56, expense: 50 },
    { month: 'Sep', income: 72, expense: 34 },
    { month: 'Oct', income: 60, expense: 46 },
    { month: 'Nov', income: 44, expense: 38 },
    { month: 'Dec', income: 56, expense: 30 },
] as const;

const transactions = [
    {
        name: 'Electricity Bill',
        category: 'Payments',
        date: '2028-03-01',
        time: '04:28:48',
        amount: '$295.81',
        note: 'Payment for monthly electricity bill',
        status: 'Failed',
    },
    {
        name: 'Weekly Groceries',
        category: 'Shopping',
        date: '2028-03-04',
        time: '04:28:48',
        amount: '$204.07',
        note: 'Groceries shopping at local supermarket',
        status: 'Completed',
    },
    {
        name: 'Movie Night',
        category: 'Entertainment',
        date: '2028-02-27',
        time: '04:28:48',
        amount: '$97.84',
        note: 'Tickets for movies and snacks',
        status: 'Pending',
    },
    {
        name: 'Medical Check-up',
        category: 'Health Care',
        date: '2028-02-07',
        time: '04:28:48',
        amount: '$323.33',
        note: 'Routine health check-up and medication',
        status: 'Pending',
    },
    {
        name: 'Dinner at Italian Restaurant',
        category: 'Dining Out',
        date: '2028-02-11',
        time: '04:28:48',
        amount: '$226.25',
        note: 'Dining out with family at local restaurant',
        status: 'Pending',
    },
] as const;

const savingPlans = [
    { title: 'Emergency Fund', icon: AlertTriangle, amount: '$5,000', progress: 50, target: '$10k' },
    { title: 'Vacation Fund', icon: Plane, amount: '$3,000', progress: 60, target: '$5k' },
    { title: 'Home Down Payment', icon: House, amount: '$7,250', progress: 36.25, target: '$20k' },
] as const;

const spendingStats = [
    { label: 'Rent & Living', ratio: 60, amount: '$2,100' },
    { label: 'Investment', ratio: 15, amount: '$525' },
    { label: 'Education', ratio: 12, amount: '$420' },
    { label: 'Food & Drink', ratio: 8, amount: '$280' },
    { label: 'Entertainment', ratio: 5, amount: '$175' },
] as const;

const activityGroups = [
    {
        heading: 'Today',
        items: [
            { name: 'Jamie Smith updated account settings', time: '16:05', avatar: 'JS' },
            { name: 'Alex Johnson logged in', time: '13:05', avatar: 'AJ' },
            { name: 'Morgan Lee added a new savings goal', time: '02:05', avatar: 'ML' },
        ],
    },
    {
        heading: 'Yesterday',
        items: [
            { name: 'Taylor Green reviewed transactions', time: '21:05', avatar: 'TG' },
            { name: 'Wilson Baptist transferred funds', time: '09:05', avatar: 'WB' },
        ],
    },
] as const;

const quickActions = [
    { title: 'Top up', icon: Plus },
    { title: 'Transfer', icon: ArrowRightLeft },
    { title: 'Request', icon: Shield },
    { title: 'History', icon: History },
] as const;

const statusStyles: Record<string, string> = {
    Failed: 'bg-[#EAECEF] text-[#73757A]',
    Completed: 'bg-[#EAECEF] text-[#3D72D1]',
    Pending: 'bg-[#FFFFFF] text-[#1D449C]',
};

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="h-full w-full bg-[#FFFFFF] p-3 text-[#1D449C] sm:p-4 lg:p-5">
                <div className="grid gap-5 xl:grid-cols-[280px_1fr] 2xl:grid-cols-[280px_1fr_280px]">
                    {/* LEFT SIDEBAR */}
                    <aside className="space-y-4">
                        {/* Profile Card */}
                        <section className="rounded-[20px] bg-[#1D449C] p-5 text-[#FFFFFF] shadow-sm">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="grid grid-cols-2 gap-1.5">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <span key={index} className="size-2.5 rounded-[4px] bg-[#3D72D1]" />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-[#C7CADD]">)))</span>
                            </div>
                            <p className="text-2xl lg:text-3xl font-semibold leading-none truncate" title="Andrew Forbist">Andrew Forbist</p>
                            <div className="mt-6 flex flex-col gap-3">
                                <div>
                                    <p className="text-xs text-[#C7CADD] mb-1">Balance Amount</p>
                                    <p className="text-3xl xl:text-4xl font-bold leading-none tracking-tight truncate">
                                        $562,000
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#C7CADD] bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <span>EXP</span>
                                    <span>CVV</span>
                                    <span className="font-semibold text-[#FFFFFF]">11/29</span>
                                    <span className="font-semibold text-[#FFFFFF]">323</span>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="rounded-[20px] bg-[#FFFFFF] p-3 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.18)]">
                            <div className="grid grid-cols-4 gap-2">
                                {quickActions.map(({ title, icon: Icon }) => (
                                    <button
                                        key={title}
                                        type="button"
                                        className="flex flex-col items-center gap-1.5 rounded-[11px] py-2 text-xs font-medium text-[#1D449C] transition-colors duration-200 hover:bg-[#EAECEF]"
                                    >
                                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#EAECEF]">
                                            <Icon className="size-4 text-[#1D449C]" />
                                        </span>
                                        <span className="truncate w-full text-center px-1 text-[10px]">{title}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Daily Limit */}
                        <section className="rounded-[20px] bg-[#FFFFFF] p-4 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.18)]">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Daily limit</h2>
                                <button className="text-[#73757A] hover:bg-[#EAECEF] p-1 rounded-md transition-colors"><MoreVertical className="size-4" /></button>
                            </div>
                            <div className="mb-2 flex flex-col sm:flex-row sm:items-end justify-between text-sm gap-2">
                                <p className="font-medium text-base">
                                    $2.500
                                    <span className="font-normal text-[#73757A] text-xs block sm:inline">
                                        {' '} / $20.000 max
                                    </span>
                                </p>
                                <span className="font-semibold text-[#3D72D1]">12.5%</span>
                            </div>
                            <div className="space-y-2.5 mt-4">
                                <div className="h-1.5 rounded-full bg-[#EAECEF] overflow-hidden">
                                    <div className="h-full w-[21%] rounded-full bg-[#1D449C] relative shadow-[0_0_8px_rgba(29,68,156,0.6)]" />
                                </div>
                                <div className="h-1.5 rounded-full bg-[#EAECEF] overflow-hidden">
                                    <div className="h-full w-[74%] rounded-full bg-[#3D72D1] relative shadow-[0_0_8px_rgba(61,114,209,0.6)]" />
                                </div>
                            </div>
                        </section>

                        {/* Saving Plans */}
                        <section className="rounded-[20px] bg-[#FFFFFF] p-4 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.18)] flex flex-col items-stretch">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-semibold">Saving plans</h2>
                                    <p className="text-xs text-[#73757A]">Total Savings</p>
                                </div>
                                <button
                                    type="button"
                                    className="mt-1 shrink-0 rounded-full bg-[#EAECEF]/50 px-2.5 py-1 text-xs font-medium text-[#1D449C] transition-colors duration-200 hover:bg-[#EAECEF]"
                                >
                                    + Add Plan
                                </button>
                            </div>
                            <p className="mb-4 text-3xl xl:text-4xl font-bold leading-none tracking-tight text-[#1D449C]">
                                $84,500
                            </p>

                            <div className="space-y-3">
                                {savingPlans.map(({ title, icon: Icon, amount, progress, target }) => (
                                    <article
                                        key={title}
                                        className="rounded-[14px] p-3 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] bg-[#EAECEF]/20 hover:bg-[#EAECEF]/50 transition-colors"
                                    >
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-medium w-full">
                                                <span className="inline-flex shrink-0 size-6 items-center justify-center rounded-md bg-[#FFFFFF] shadow-sm text-[#1D449C]">
                                                    <Icon className="size-3.5" />
                                                </span>
                                                <span className="truncate">{title}</span>
                                            </div>
                                            <button className="text-[#73757A] hover:bg-[#EAECEF] p-0.5 rounded-sm transition-colors"><MoreVertical className="size-3.5" /></button>
                                        </div>

                                        <div className="mb-2 h-1.5 w-full rounded-full bg-[#EAECEF] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-[#3D72D1] shadow-[0_0_10px_rgba(61,114,209,0.5)]"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-[#73757A]">
                                            <span className="font-medium text-[#1D449C]">{amount}</span>
                                            <span>{progress}%</span>
                                            <span>
                                                Target: <strong className="font-semibold text-[#1D449C]">{target}</strong>
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-[11px] text-[#73757A]">
                            <span className="text-[#1D449C] font-semibold tracking-wide">Copyright &copy; 2024 Peterdraw</span>
                            <div className="flex gap-3">
                                <button type="button" className="hover:text-[#1D449C] transition-colors hover:underline">Privacy Policy</button>
                                <button type="button" className="hover:text-[#1D449C] transition-colors hover:underline">Terms</button>
                                <button type="button" className="hover:text-[#1D449C] transition-colors hover:underline">Contact</button>
                            </div>
                        </footer>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="space-y-5 min-w-0">
                        {/* Summary Cards */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            {summaryCards.map(({ title, amount, change, icon: Icon, tone }) => (
                                <article
                                    key={title}
                                    className="rounded-[20px] bg-[#FFFFFF] p-5 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#EAECEF] text-[#1D449C]">
                                            <Icon className="size-5" />
                                        </span>
                                        <button className="text-[#73757A] hover:bg-[#EAECEF] p-1 rounded-md transition-colors"><MoreVertical className="size-4" /></button>
                                    </div>
                                    
                                    <div className="flex items-end justify-between flex-wrap gap-2 mt-2">
                                        <div>
                                            <p className="text-3xl xl:text-4xl font-bold leading-none tracking-tight text-[#1D449C]">
                                                {amount}
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-[#73757A]">{title}</p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone === 'positive'
                                                    ? 'bg-[#EAECEF] text-[#3D72D1] shadow-sm'
                                                    : 'bg-red-50 text-red-600 shadow-sm'
                                                }`}
                                        >
                                            {change}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Cashflow Chart */}
                        <article className="rounded-[20px] bg-[#FFFFFF] p-5 lg:p-6 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)]">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold tracking-tight text-[#1D449C]">
                                    Cashflow
                                </h2>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#EAECEF] px-3 py-1.5 text-xs font-semibold text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] hover:bg-[#C7CADD] transition-colors"
                                >
                                    This Year
                                    <ChevronDown className="size-3.5" />
                                </button>
                            </div>

                            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-[#73757A] mb-1">Total Balance</p>
                                    <p className="text-4xl font-bold leading-none tracking-tight text-[#1D449C]">
                                        $562,000
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium text-[#73757A] bg-[#EAECEF]/40 px-3 py-1.5 rounded-lg border border-[#EAECEF]">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="size-2.5 rounded-full bg-[#1D449C] shadow-[0_0_5px_rgba(29,68,156,0.6)]" />
                                        Income
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <span className="size-2.5 rounded-full bg-[#3D72D1] shadow-[0_0_5px_rgba(61,114,209,0.6)]" />
                                        Expense
                                    </span>
                                </div>
                            </div>

                            <div className="relative rounded-[16px] bg-[#EAECEF]/20 p-4 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.12)]">
                                {/* Example Tooltip - Hidden on small screens to prevent overlap */}
                                <div className="hidden sm:block pointer-events-none w-max absolute left-[36%] top-[10%] z-10 rounded-xl bg-[#FFFFFF] p-2.5 text-xs text-[#1D449C] shadow-lg border border-gray-100">
                                    <p className="mb-2 font-bold tracking-tight">June 2029</p>
                                    <div className="space-y-1">
                                        <p className="flex justify-between gap-4"><span className="text-[#73757A]">Income</span> <span className="font-semibold">$6,000</span></p>
                                        <p className="flex justify-between gap-4"><span className="text-[#73757A]">Expense</span> <span className="font-semibold">$4,000</span></p>
                                    </div>
                                </div>

                                <div className="relative h-[200px] mt-2">
                                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#EAECEF] border-b border-[#C7CADD]/50" />
                                    <div className="grid h-full grid-cols-12 gap-1 sm:gap-2">
                                        {cashflowData.map(({ month, income, expense }) => (
                                            <div key={month} className="flex flex-col items-center justify-end h-full group">
                                                <div className="relative h-[160px] w-full flex items-center justify-center transition-transform hover:-translate-y-1">
                                                    <span
                                                        className="absolute bottom-1/2 w-[8px] sm:w-[12px] -translate-x-[calc(50%+1px)] rounded-t-md bg-[#1D449C] transition-all origin-bottom"
                                                        style={{ height: `${income}%` }}
                                                    />
                                                    <span
                                                        className="absolute top-1/2 w-[8px] sm:w-[12px] translate-x-[calc(50%+1px)] rounded-b-md bg-[#3D72D1] transition-all origin-top"
                                                        style={{ height: `${expense}%` }}
                                                    />
                                                </div>
                                                <span className="mt-3 text-[10px] font-medium text-[#73757A] group-hover:text-[#1D449C] transition-colors">{month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Recent Transactions */}
                        <article className="rounded-[20px] bg-[#FFFFFF] p-5 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] overflow-hidden">
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold tracking-tight text-[#1D449C]">
                                    Recent Transactions
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#EAECEF] px-3 py-1.5 text-xs font-semibold text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] hover:bg-[#C7CADD] transition-colors"
                                    >
                                        This Month
                                        <ChevronDown className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex size-8 items-center justify-center rounded-[10px] bg-[#EAECEF] text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] hover:bg-[#C7CADD] transition-colors"
                                    >
                                        <SlidersHorizontal className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-[14px] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] border border-[#EAECEF]">
                                <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
                                    <thead className="bg-[#EAECEF]/60 text-[#73757A] border-b border-[#EAECEF]">
                                        <tr>
                                            <th className="px-4 py-3.5 font-semibold tracking-wide">Transaction Name</th>
                                            <th className="px-4 py-3.5 font-semibold tracking-wide">Date &amp; Time</th>
                                            <th className="px-4 py-3.5 font-semibold tracking-wide">Amount</th>
                                            <th className="px-4 py-3.5 font-semibold tracking-wide w-[200px]">Note</th>
                                            <th className="px-4 py-3.5 font-semibold tracking-wide">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EAECEF] text-[#1D449C]">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.name} className="hover:bg-[#EAECEF]/20 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="font-bold">{transaction.name}</p>
                                                    <p className="text-[#73757A] text-xs mt-0.5">{transaction.category}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">{transaction.date}</p>
                                                    <p className="text-[#73757A] text-xs mt-0.5">{transaction.time}</p>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-base">
                                                    {transaction.amount}
                                                </td>
                                                <td className="px-4 py-3 text-[#73757A] text-xs text-wrap min-w-[200px]">
                                                    <p className="line-clamp-2">{transaction.note}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[transaction.status]}`}
                                                    >
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </div>

                    {/* RIGHT SIDEBAR (Only visible on 2xl screens by default, otherwise stacked if adjusting classes) */}
                    <aside className="space-y-4">
                        <section className="rounded-[20px] bg-[#FFFFFF] p-5 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)]">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-[#1D449C]">
                                    Statistic
                                </h2>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg hover:bg-[#EAECEF] px-2 py-1 text-xs font-medium text-[#1D449C] transition-colors"
                                >
                                    This Month
                                    <ChevronDown className="size-3.5" />
                                </button>
                            </div>

                            <div className="mb-6 rounded-[16px] border border-[#EAECEF] bg-[#EAECEF]/20 p-4 shadow-sm">
                                <div className="mb-2 flex justify-between text-xs font-medium">
                                    <span className="text-[#73757A]">Income <span className="text-[#1D449C]">$4.8k</span></span>
                                    <span className="text-[#1D449C]">Expense <span className="font-bold">$3.5k</span></span>
                                </div>
                                
                                {/* Adjusted size to prevent overflow in smaller sidebars and maintain aspect ratio */}
                                <div className="relative mx-auto mt-4 w-full max-w-[170px] aspect-square rounded-full bg-[conic-gradient(#1D449C_0deg,#1D449C_216deg,#3D72D1_216deg,#3D72D1_270deg,#C7CADD_270deg,#C7CADD_360deg)] p-[15%] shadow-md">
                                    <div className="absolute inset-[24px] rounded-full bg-[#FFFFFF] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.1),0_0_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-[#73757A] mb-1">Expense</span>
                                        <span className="text-3xl font-bold leading-none tracking-tight text-[#1D449C]">
                                            $3.5k
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3.5 text-sm">
                                {spendingStats.map(({ label, ratio, amount }) => (
                                    <div key={label} className="flex items-center justify-between group">
                                        <span className="inline-flex items-center gap-3">
                                            <span className="inline-flex min-w-[36px] justify-center rounded-[8px] bg-[#EAECEF] px-1.5 py-1 text-[11px] font-bold text-[#1D449C] group-hover:bg-[#1D449C] group-hover:text-white transition-colors">
                                                {ratio}%
                                            </span>
                                            <span className="font-medium text-[#73757A] group-hover:text-[#1D449C] transition-colors">{label}</span>
                                        </span>
                                        <span className="font-bold text-[#1D449C]">{amount}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[20px] bg-[#FFFFFF] p-5 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)]">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-[#1D449C]">
                                    Activity
                                </h2>
                                <button className="text-[#73757A] hover:bg-[#EAECEF] p-1 rounded-md transition-colors"><MoreVertical className="size-4" /></button>
                            </div>

                            <div className="space-y-6">
                                {activityGroups.map((group) => (
                                    <section key={group.heading}>
                                        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#73757A]">
                                            {group.heading}
                                        </h3>
                                        <div className="space-y-4">
                                            {group.items.map((item) => (
                                                <article key={item.name} className="flex items-start gap-3 group">
                                                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAECEF] text-[11px] font-bold text-[#1D449C] group-hover:bg-[#1D449C] group-hover:text-white transition-colors">
                                                        {item.avatar}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium leading-snug text-[#1D449C] break-words">
                                                            {item.name}
                                                        </p>
                                                        <p className="mt-1 text-xs font-medium text-[#73757A]">
                                                            {item.time}
                                                        </p>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {[Landmark, Shield, Bell].map((Icon, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="inline-flex size-10 items-center justify-center rounded-full bg-[#FFFFFF] text-[#73757A] shadow-[inset_0_0_0_1px_rgba(115,117,122,0.2)] hover:bg-[#EAECEF] hover:text-[#1D449C] transition-all"
                                >
                                    <Icon className="size-[18px]" />
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
