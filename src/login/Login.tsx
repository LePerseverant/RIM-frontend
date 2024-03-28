import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

type LoginProps = {
  setToken: (userToken: string) => void
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (data) => {
      return fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
    },
    onSuccess: async (data, variables, context) => {
      const _data = await data.json()
      setToken(_data.data.token)
      navigate("/customers")
    },
  })


  type Inputs = {
    email: string
    password: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data)
  }
  console.log(watch("email")) // watch input value by passing the name of it
  return (
    <>
      <div
        className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
            <p className="mt-2 text-gray-500">Sign in below to access your account</p>
          </div>
          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mt-6">
                {errors.email && <p role="alert">{errors.email.message}</p>}
                <input {...register("email")} type="email" name="email" id="email" className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" autoComplete="NA" />
                <label htmlFor="email" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
              </div>
              <div className="relative mt-6">
                {errors.password && <p role="alert">{errors.password.message}</p>}
                <input {...register("password")} type="password" name="password" id="password" className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                <label htmlFor="password" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
              </div>
              <div className="my-6">
                <button type="submit" className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none">Sign in</button>
              </div>
              <p className="text-center text-sm text-gray-500">Don&#x27;t have an account yet?
                <a href="#!"
                  className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"> Sign
                  up
                </a>.
              </p>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}

export default Login
