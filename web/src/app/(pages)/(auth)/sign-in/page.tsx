'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/app/api/sign-in'
import { Button } from '@/app/components/button'
import { TextInput } from '@/app/components/text-input'
import { SOMETHING_WENT_WRONG } from '@/app/constants/error'

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(2, { message: 'Password is required' }),
})

type SignInSchema = z.infer<typeof signInSchema>

export default function SignIn() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignUp(data: SignInSchema) {
    try {
      await authenticate(data)

      toast.success('Welcome back!')

      router.push('/')
    } catch (err) {
      console.log(err)

      if (isAxiosError(err)) {
        if (err?.response?.status === 401) {
          toast.error('Invalid credentials. Try again.')
          reset({
            email: '',
            password: '',
          })
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
          Sign in
        </h1>
        <p className="text-md mt-3 font-normal text-gray-500 md:text-lg">
          {`We're happy to see you again`}
        </p>

        <form
          className="mt-4 flex w-full flex-col gap-2 md:mt-8 md:gap-3"
          onSubmit={handleSubmit(handleSignUp)}
          noValidate
        >
          <TextInput
            type="email"
            placeholder="m@example.com"
            label="Email"
            labelId="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <TextInput
            type="password"
            placeholder="********"
            label="Password"
            labelId="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button className="py-2" type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>

        <span className="text-md mt-6 font-normal">
          New here? {` `}
          <Link
            href="/sign-up"
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            Create your account
          </Link>
        </span>
      </main>
    </div>
  )
}
