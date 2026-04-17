import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Masuk" />

            <div className="mb-6 flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-[#131110]">Selamat Datang Kembali!</h1>
                <p className="text-sm text-[#828282]">Silakan masuk untuk melanjutkan ke program magang Anda</p>
            </div>



            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <Label htmlFor="email" className="text-[13px] font-semibold text-[#131110]">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="johndoe@mail.com"
                                    className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                />
                                <InputError message={errors.email} className="mt-0.5" />
                            </div>

                            <div className="flex flex-col gap-1.5 text-left">
                                <Label htmlFor="password" className="text-[13px] font-semibold text-[#131110]">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="minimum 8 character"
                                    className="rounded-xl border-[#E7E3DA] py-5 px-3.5 shadow-sm transition-all focus-visible:border-[#0E3F97]/50 focus-visible:ring-[#0E3F97]/20"
                                />
                                <InputError message={errors.password} className="mt-0.5" />
                            </div>

                            <div className="flex items-center space-x-3 mt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-[4px] border-gray-300 text-[#0E3F97] data-[state=checked]:bg-[#0E3F97] data-[state=checked]:border-[#0E3F97]"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-[#828282]">Ingat saya</Label>
                            </div>
                        </div>

                        <div className="mt-2 text-center text-sm">
                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-[#0E3F97] py-6 text-sm font-semibold text-white shadow-md shadow-[#0E3F97]/20 hover:bg-[#0B3682] focus:ring-2 focus:ring-[#0E3F97]/50 focus:ring-offset-2"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4 text-white" />}
                                Masuk &rarr;
                            </Button>
                        </div>
                        
                        {canResetPassword && (
                            <div className="mt-2 text-center text-sm">
                                <TextLink
                                    href={request()}
                                    className="font-bold underline decoration-[#131110]/30 underline-offset-4 transition-colors hover:decoration-[#131110] text-[#131110]"
                                    tabIndex={5}
                                >
                                    Lupa kata sandi?
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke akun Anda',
    description: 'Masukkan email dan kata sandi Anda di bawah ini untuk masuk',
};
