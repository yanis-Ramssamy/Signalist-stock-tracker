'use server'

import { auth } from '@/lib/better-auth/auth'
import { inngest } from '@/lib/inngest/client'
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
  try {
    const res: any = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

    // Basic sanity checks on the response; Better Auth may throw on error, but guard anyway
    const errorMessage = (res?.error as string) || (res?.message as string) || undefined
    const status = (res?.status as string) || undefined
    const statusCode = (res?.statusCode as number) || undefined

    if (!res || errorMessage || status === 'error' || (typeof statusCode === 'number' && statusCode >= 400)) {
      const msg = errorMessage || `Sign up failed${statusCode ? ` (${statusCode})` : ''}`
      return { success: false, error: msg }
    }

    // Fire-and-forget user created event with profile preferences
    await inngest.send({
      name: 'app/user.created',
      data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry },
    })

    return { success: true, data: res }
  } catch (e: any) {
    // Surface detailed error info for the client toast
    const status = e?.status || e?.statusCode
    const bodyMsg = e?.body?.message || e?.body?.error
    const msg = bodyMsg || e?.message || 'Sign up failed'
    const formatted = status ? `${msg} (${status})` : msg
    console.log('Sign up failed', e)
    return { success: false, error: formatted }
  }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}