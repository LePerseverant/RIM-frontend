import ExampleWithReactQueryProvider from './table/Table'
import { createBrowserRouter } from "react-router-dom"
import Login from './login/Login.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/customers",
    element: <ExampleWithReactQueryProvider />
  },
  {
    path: "/devices",
    element: <div className="text-2xl">About</div>,
  }
])

export default router
