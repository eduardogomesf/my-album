"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query'
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { toast } from 'sonner';

import { TextInput } from "@/app/components/form/text-input";
import { signUp } from "@/app/api/sign-up";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  phoneNumber: z.string().min(10, { message: 'Invalid phone number' }),
  password: z.string().min(8, { message: 'Password must have at least 8 characters' }),
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

  async function handleSignUp({ email, firstName, lastName, password, phoneNumber }: SignUpSchema) {
    try {
      await createAccount({
        email,
        firstName,
        lastName,
        password,
        cellphone: phoneNumber
      })

      toast.success('Your account was created. Please sign-in.')

      router.push('/sign-in')
    } catch (err) {
      toast.error('Something went wrong :(! Try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col items-center max-w-[500px] w-full p-6">
        <h1 className="text-2xl text-gray-950 md:text-3xl	font-bold">
          Sign up
        </h1>
        <p className="mt-3 text-gray-500 font-normal text-md md:text-lg">
          Create your account for free
        </p>

        <form
          className="mt-4 md:mt-8 w-full flex flex-col gap-2 md:gap-3"
          onSubmit={handleSubmit(handleSignUp)}
          noValidate
        >
          <div className="w-full flex flex-col gap-3 md:flex-row md:items-center">
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
            className="md:mt-4 bg-gray-950 rounded-md text-white p-3 hover:bg-gray-800"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </form>

        <span className="text-md font-normal mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-gray-600 hover:underline hover:text-gray-800">
            Sign in
          </Link>
        </span>

      </main>
    </div>
  )
}