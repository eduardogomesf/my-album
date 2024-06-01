"use client"

import { TextInput } from "@/app/components/form/text-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "@/app/api/sign-in";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { SOMETHING_WENT_WRONG } from "../../constants/error";

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
            password: ''
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
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col items-center max-w-[500px] w-full p-6">
        <h1 className="text-2xl text-gray-950 md:text-3xl	font-bold">
          Sign in
        </h1>
        <p className="mt-3 text-gray-500 font-normal text-md md:text-lg">
          {`We're happy to see you again`}
        </p>

        <form
          className="mt-4 md:mt-8 w-full flex flex-col gap-2 md:gap-3"
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

          <button
            className="md:mt-4 bg-gray-950 rounded-md text-white p-3 hover:bg-gray-800"
            type="submit"
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </form>

        <span className="text-md font-normal mt-6">
          New here? Create your account{' '}
          <Link href="/sign-in" className="text-gray-600 hover:underline hover:text-gray-800">
            Sign in
          </Link>
        </span>

      </main>
    </div>
  )
}