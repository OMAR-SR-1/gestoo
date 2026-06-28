import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Connexion from "./pages/Connexion"
import Inscription from "./pages/Inscription"
import Produits from "./pages/Produits"
import Ventes from "./pages/Ventes"
import Clients from "./pages/Clients"
import Rapports from "./pages/Rapports"

function App() {
  const token = localStorage.getItem("token")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/connexion" />} />
        <Route path="/produits" element={token ? <Produits /> : <Navigate to="/connexion" />} />
        <Route path="/ventes" element={token ? <Ventes /> : <Navigate to="/connexion" />} />
        <Route path="/clients" element={token ? <Clients /> : <Navigate to="/connexion" />} />
        <Route path="/rapports" element={token ? <Rapports /> : <Navigate to="/connexion" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App