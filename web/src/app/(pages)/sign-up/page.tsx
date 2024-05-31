import { TextInput } from "@/app/components/form/text-input";

export default function SignUp() {
  return (
    <div className="h-screen flex items-center justify-center">
      <main className="flex flex-col items-center max-w-[500px] w-full p-6">
        <h1 className="text-2xl text-gray-950 md:text-3xl	font-bold">Sign up</h1>
        <p className="mt-3 text-gray-500 font-normal text-md md:text-lg">Create your account for free</p>

        <form className="mt-8 w-full flex flex-col gap-3">
          <div className="w-full flex flex-col gap-3 md:flex-row md:items-center">
            <TextInput
              type="text"
              placeholder="John"
              label="First name"
              labelId="first-name"
            />

            <TextInput
              type="text"
              placeholder="Doe"
              label="Last name"
              labelId="last-name"
            />
          </div>

          <TextInput
            type="email"
            placeholder="m@example.com"
            label="Email"
            labelId="email"
          />

          <TextInput
            type="tel"
            placeholder="5511999887755 (numbers only)"
            label="Phone number"
            labelId="phone-number"
          />

          <TextInput
            type="password"
            placeholder="********"
            label="Password"
            labelId="password"
          />

          <button
            className="mt-4 bg-gray-950 rounded-md text-white p-3 hover:bg-gray-800"
          >
            Sign up
          </button>
        </form>

      </main>
    </div>
  )
}