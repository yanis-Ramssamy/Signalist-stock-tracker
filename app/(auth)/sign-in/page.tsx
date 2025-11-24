'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from "@/components/forms/footerLink";
import {useRouter} from "next/navigation";
import {signInWithEmail} from "@/lib/action/auth-actions";
import {toast} from "sonner";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });


    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if(result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@jsmastery.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email est obligatoire', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <InputField
                    name="password"
                    label="Mot de passe"
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Mot de passe est obligatoire', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink text="Pas encore inscrit?" linkText="Créez un compte" href="/sign-up" />
            </form>
        </>
    );
};
export default SignIn;