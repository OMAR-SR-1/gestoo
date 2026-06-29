import { useEffect, useState } from "react"
import api from "../api"
import Menu from "../components/Menu"

interface Produit {
  id: number
  nom: string
  prix: number
  quantite: number
  seuil_alerte: number
}

export default function Produits() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [nom, setNom] = useState("")
  const [prix, setPrix] = useState("")
  const [quantite, setQuantite] = useState("")
  const [afficherForm, setAfficherForm] = useState(false)

  const charger = () => api.get("/produits/").then((res) => setProduits(res.data))

  useEffect(() => { charger() }, [])

  const creer = async () => {
    await api.post("/produits/", { nom, prix: parseFloat(prix), quantite: parseInt(quantite), seuil_alerte: 5 })
    setNom(""); setPrix(""); setQuantite(""); setAfficherForm(false)
    charger()
  }

  const supprimer = async (id: number) => {
    await api.delete(`/produits/${id}`)
    charger()
  }

  return (
    <div style={styles.page}>
      <Menu />
      <div style={styles.header}>
        <span style={styles.retour} onClick={() => window.location.href = "/"}>← Retour</span>
        <h2 style={styles.titre}>Mon stock</h2>
        <button style={styles.btnAjout} onClick={() => setAfficherForm(!afficherForm)}>+</button>
      </div>

      {afficherForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} />
          <input style={styles.input} placeholder="Prix (FCFA)" value={prix} onChange={(e) => setPrix(e.target.value)} />
          <input style={styles.input} placeholder="Quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
          <button style={styles.btn} onClick={creer}>Ajouter</button>
        </div>
      )}

      <div style={styles.liste}>
        {produits.map((p) => (
          <div key={p.id} style={styles.item}>
            <div>
              <div style={styles.itemNom}>{p.nom}</div>
              <div style={styles.itemDesc}>{p.prix.toLocaleString()} FCFA — {p.quantite} unités</div>
              {p.quantite <= p.seuil_alerte && <div style={styles.alerte}>Stock faible</div>}
            </div>
            <button style={styles.btnSuppr} onClick={() => supprimer(p.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f7f7f2", fontFamily: "Inter, sans-serif", maxWidth: 420, margin: "0 auto" },
  header: { padding: "28px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  retour: { fontSize: 13, color: "#1a6b3c", cursor: "pointer", fontWeight: 500 },
  titre: { fontSize: 18, fontWeight: 700, margin: 0 },
  btnAjout: { width: 36, height: 36, borderRadius: "50%", background: "#1a6b3c", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" },
  form: { margin: "20px 24px 0", background: "#fff", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #e8e8e0" },
  input: { padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e0", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" },
  btn: { padding: 13, background: "#1a6b3c", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  liste: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 },
  item: { background: "#fff", borderRadius: 14, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e8e8e0" },
  itemNom: { fontSize: 14, fontWeight: 500, color: "#0f0f0f" },
  itemDesc: { fontSize: 12, color: "#999", marginTop: 2 },
  alerte: { fontSize: 11, color: "#f57c00", fontWeight: 600, marginTop: 4 },
  btnSuppr: { fontSize: 12, color: "#e53935", background: "none", border: "none", cursor: "pointer", fontWeight: 500 },
}
