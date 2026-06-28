import { useEffect, useState } from "react"
import api from "../api"

interface Produit { id: number; nom: string; prix: number }
interface Vente { id: number; montant: number; statut: string; date: string }

export default function Ventes() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [ventes, setVentes] = useState<Vente[]>([])
  const [produitId, setProduitId] = useState("")
  const [quantite, setQuantite] = useState("1")
  const [statut, setStatut] = useState("paye")

  const charger = () => {
    api.get("/produits/").then((res) => setProduits(res.data))
    api.get("/ventes/").then((res) => setVentes(res.data))
  }

  useEffect(() => { charger() }, [])

  const creer = async () => {
    if (!produitId) {
      alert("Choisis un produit")
      return
    }
    await api.post("/ventes/", {
      produit_id: parseInt(produitId),
      quantite: parseInt(quantite),
      statut,
      client_id: null
    })
    setQuantite("1")
    charger()
  }

  const marquerPaye = async (id: number) => {
    await api.put(`/ventes/${id}/payer`)
    charger()
  }

  const totalJour = ventes
    .filter((v) => new Date(v.date).toLocaleDateString("fr-FR") === new Date().toLocaleDateString("fr-FR"))
    .reduce((acc, v) => acc + v.montant, 0)

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.retour} onClick={() => window.location.href = "/"}>← Retour</span>
        <h2 style={styles.titre}>Mes ventes</h2>
        <div />
      </div>

      <div style={styles.totalBadge}>
        Total du jour : <strong>{totalJour.toLocaleString()} FCFA</strong>
      </div>

      <div style={styles.form}>
        <select style={styles.input} value={produitId} onChange={(e) => setProduitId(e.target.value)}>
          <option value="">Choisir un produit</option>
          {produits.map((p) => <option key={p.id} value={p.id}>{p.nom} — {p.prix.toLocaleString()} FCFA</option>)}
        </select>
        <input style={styles.input} type="number" placeholder="Quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
        <select style={styles.input} value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="paye">Payé</option>
          <option value="credit">Crédit</option>
        </select>
        <button style={styles.btn} onClick={creer}>Enregistrer la vente</button>
      </div>

      <div style={styles.liste}>
        {ventes.slice().reverse().map((v) => (
          <div key={v.id} style={styles.item}>
            <div>
              <div style={styles.itemMontant}>{v.montant.toLocaleString()} FCFA</div>
              <div style={styles.itemDate}>{new Date(v.date).toLocaleDateString("fr-FR")}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                ...styles.tag,
                background: v.statut === "paye" ? "#e6f7ed" : "#fff3e0",
                color: v.statut === "paye" ? "#1a6b3c" : "#f57c00"
              }}>
                {v.statut === "paye" ? "Payé" : "Crédit"}
              </span>
              {v.statut === "credit" && (
                <button style={styles.btnPayer} onClick={() => marquerPaye(v.id)}>
                  Marquer payé
                </button>
              )}
            </div>
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
  totalBadge: { margin: "16px 24px 0", background: "#e6f7ed", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#1a6b3c" },
  form: { margin: "16px 24px 0", background: "#fff", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #e8e8e0" },
  input: { padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e0", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", background: "#fff" },
  btn: { padding: 13, background: "#1a6b3c", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  liste: { padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 },
  item: { background: "#fff", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e8e8e0" },
  itemMontant: { fontSize: 15, fontWeight: 600, color: "#0f0f0f" },
  itemDate: { fontSize: 11, color: "#999", marginTop: 2 },
  tag: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100 },
  btnPayer: { fontSize: 11, color: "#1a6b3c", background: "#e6f7ed", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 600 },
}