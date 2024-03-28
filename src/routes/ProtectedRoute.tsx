import { Outlet, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import useJWT from "../hooks/useJWT"
import React from "react"

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate()
  const { token, removeToken } = useJWT()
  const mutation = useMutation({
    mutationFn: () => fetch("http://127.0.0.1:5000/auth/logout"),
    onSuccess: () => {
      removeToken()
      navigate("/login")
    }
  })
  const logout = () => mutation.mutate()

  if (!token) navigate("/login")
  return <Outlet />
}

export default ProtectedRoute
