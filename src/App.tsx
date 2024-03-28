import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./login/Login";
import Table from "./table/Table";
import ProtectedRoute from "./routes/ProtectedRoute"
import { useCustomersColumns, devicesColumns } from "./table/columns";
import useJWT from "./hooks/useJWT"
import "./App.css"
import { useContext, useState } from "react";
import { ModalContext } from "./context";
import DevicesTable from "./components/Modal";

function App() {
  const { token, removeToken, setToken } = useJWT();
  const [open, setOpen] = useState<boolean>(false)
  const [ID, setID] = useState<number>(0)
  const customersColumns = useCustomersColumns()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/customers" element={
              <ModalContext.Provider value={{ open, setOpen, ID, setID }}>
                <Table token={token as string} endpoint="/customers" setToken={setToken} columns={customersColumns} />
                <DevicesTable token={token as string} />
              </ModalContext.Provider>
            } />
            <Route path="/customers/customer/:customer_id/devices" element={<Table token={token as string} endpoint="/devices" setToken={setToken} columns={devicesColumns} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
