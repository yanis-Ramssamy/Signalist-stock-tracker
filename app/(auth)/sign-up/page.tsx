'use client'

import { Button } from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/footerLink";

const SignUp = () => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    }, );
    const onSubmit = async (data: SignUpFormData) => {
        try {
           console.log(data);
        } catch (e) {
            console.error(e);

        }
    }

    return (
        <>
        <div className={"form-title"}>Sign Up & Personalize</div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 bg-gray-900 p-8 rounded-xl shadow-md">

                <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Full name is required', minLength: 2 }}
                />
                <InputField
                name="email"
                label="Email"
                placeholder="contact@jsmastery.com"
                register={register}
                error={errors.email}
                validation={{ required: 'Un mail est nécessaire', pattern: /^\w+@\w+\.\w+$/, message: 'Une addresse email est nécessaire' }}
                />

                <InputField
                    name="mot de passe"
                    label="mot de passe"
                    placeholder="Rentrez votre mot de passe"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />


                <CountrySelectField
                    name="Pays"
                    label="Pays"
                    control={control}
                    error={errors.country}
                    required

                />

                <SelectField
                    name="Objectif d'investissement"
                    label="Objectif d'investissement"
                    placeholder="Sélectionner votre objectif"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required


                />
                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Selectionnez votre riskTolerance"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="Industrie de préférence"
                    label="Industrie de préférence"
                    placeholder="Selectionner votrre industrie de préférence"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />
                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-6 py-3 text-base font-semibold tracking-wide">
                    {isSubmitting ? "Création du compte..." : "Commencer votre parcours d'investissement"}
                </Button>


                <FooterLink text="Déja inscrit ?" linkText="Sign in" href="/sign-in" />
            </form>

</>
    )
}
export default SignUp
