import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './login/Login';
import Table from './table/Table';
import useJWT from './hooks/useJWT'
import './App.css'

function App() {
  const { token, removeToken, setToken } = useJWT();

  return (
    <BrowserRouter>
      <div className="App">
        {!token && token !== "" && token !== undefined ? <Login setToken={setToken} /> : <Table token={token} setToken={setToken} />}
      </div>
    </BrowserRouter>
  )
}

export default App
// (
//             <>
//               <Routes>
//                 <Route path="/customers" element={<Table token={token} setToken={setToken} />}></Route>
//               </Routes>
//             </>
//           )
