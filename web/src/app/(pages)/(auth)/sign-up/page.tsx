'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { signUp } from '@/app/api/sign-up'
import { TextInput } from '@/app/components/text-input'
import { SOMETHING_WENT_WRONG } from '@/app/constants/error'

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  phoneNumber: z.string().min(10, { message: 'Invalid phone number' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 characters' }),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export default function SignUp() {
  const router = useRouter()

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutateAsync: createAccount } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp({
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
  }: SignUpSchema) {
    try {
      await createAccount({
        email,
        firstName,
        lastName,
        password,
        cellphone: phoneNumber,
      })

      toast.success('Your account was created. Please sign-in.')

      router.push('/sign-in')
    } catch (err) {
      console.log(err)
      if (isAxiosError(err)) {
        if (err.response?.status === 409) {
          toast.error('Email is already in use. Try another one.')
        } else {
          toast.error(SOMETHING_WENT_WRONG)
        }
      } else {
        toast.error(SOMETHING_WENT_WRONG)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full max-w-[500px] flex-col items-center p-6">
        <h1 className="text-2xl font-bold text-gray-950 md:text-3xl">
          Sign up
        </h1>
        <p className="text-md mt-3 font-normal text-gray-500 md:text-lg">
          Create your account for free
        </p>

        <form
          className="mt-4 flex w-full flex-col gap-2 md:mt-8 md:gap-3"
          onSubmit={handleSubmit(handleSignUp)}
          noValidate
        >
          <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
            <TextInput
              type="text"
              placeholder="John"
              label="First name"
              labelId="first-name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />

            <TextInput
              type="text"
              placeholder="Doe"
              label="Last name"
              labelId="last-name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <TextInput
            type="email"
            placeholder="m@example.com"
            label="Email"
            labelId="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <TextInput
            type="text"
            placeholder="5511999887755 (numbers only)"
            label="Phone number"
            labelId="phone-number"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />

          <TextInput
            type="password"
            placeholder="********"
            label="Password"
            labelId="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <button
            className="rounded-md bg-gray-950 p-3 text-white hover:bg-gray-800 md:mt-4"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </form>

        <span className="text-md mt-6 font-normal">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            Sign in
          </Link>
        </span>
      </main>
    </div>
  )
}
