import { useState } from "react"
import api from "../api"

export default function Inscription() {
  const [nom, setNom] = useState("")
  const [telephone, setTelephone] = useState("")
  const [nomBoutique, setNomBoutique] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")

  const inscrire = async () => {
    try {
      await api.post("/auth/inscription", {
        nom,
        telephone,
        nom_boutique: nomBoutique,
        mot_de_passe: motDePasse,
      })
      window.location.href = "/connexion"
    } catch {
      setErreur("Erreur lors de l'inscription")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.carte}>
        <h1 style={styles.logo}>Gëstoo</h1>
        <p style={styles.soustitre}>Créez votre compte boutique</p>
        {erreur && <p style={styles.erreur}>{erreur}</p>}
        <input style={styles.input} placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        <input style={styles.input} placeholder="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        <input style={styles.input} placeholder="Nom de votre boutique" value={nomBoutique} onChange={(e) => setNomBoutique(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
        <button style={styles.btn} onClick={inscrire}>Créer mon compte</button>
        <p style={styles.lien}>
          Déjà un compte ?{" "}
          <span style={styles.lienSpan} onClick={() => window.location.href = "/connexion"}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
  },
  carte: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 32px",
    width: 360,
    boxShadow: "0 4px 24px #0000000a",
    border: "1px solid #e8e8e0",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  logo: { fontFamily: "serif", fontSize: 32, color: "#0f0f0f", margin: 0, letterSpacing: -1 },
  soustitre: { fontSize: 13, color: "#999", margin: 0 },
  erreur: { fontSize: 13, color: "#e53935", margin: 0 },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e8e8e0",
    fontSize: 14,
    outline: "none",
    fontFamily: "Inter, sans-serif",
  },
  btn: {
    padding: "13px",
    background: "#1a6b3c",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  lien: { fontSize: 13, color: "#999", textAlign: "center", margin: 0 },
  lienSpan: { color: "#1a6b3c", cursor: "pointer", fontWeight: 600 },
} 
