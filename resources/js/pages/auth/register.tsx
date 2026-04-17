import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            
            <div className="mb-6 flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-[#131110]">Join Orion Today</h1>
                <p className="text-sm text-[#828282]">Sign up to access all our product analytics</p>
            </div>



            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <Label htmlFor="name" className="text-[13px] font-semibold text-[#131110]">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                />
                                <InputError message={errors.name} className="mt-0.5" />
                            </div>

                            <div className="flex flex-col gap-1.5 text-left">
                                <Label htmlFor="email" className="text-[13px] font-semibold text-[#131110]">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                />
                                <InputError message={errors.email} className="mt-0.5" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 text-left">
                                    <Label htmlFor="password" className="text-[13px] font-semibold text-[#131110]">Password</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Min 8 chars"
                                        className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                    />
                                    <InputError message={errors.password} className="mt-0.5" />
                                </div>

                                <div className="flex flex-col gap-1.5 text-left">
                                    <Label htmlFor="password_confirmation" className="text-[13px] font-semibold text-[#131110]">Confirm</Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm"
                                        className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-center text-sm">
                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-[#0E3F97] py-6 text-sm font-semibold text-white shadow-md shadow-[#0E3F97]/20 hover:bg-[#0B3682] focus:ring-2 focus:ring-[#0E3F97]/50 focus:ring-offset-2"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4 text-white" />}
                                Create account &rarr;
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
