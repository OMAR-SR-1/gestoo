import { useEffect, useState } from "react"
import api from "../api"

interface Vente {
  id: number
  montant: number
  statut: string
  date: string
}

export default function Rapports() {
  const [ventes, setVentes] = useState<Vente[]>([])

  useEffect(() => {
    api.get("/ventes/").then((res) => setVentes(res.data))
  }, [])

  const aujourd_hui = new Date().toLocaleDateString("fr-FR")

  const totalJour = ventes
    .filter((v) => new Date(v.date).toLocaleDateString("fr-FR") === aujourd_hui)
    .reduce((acc, v) => acc + v.montant, 0)

  const totalSemaine = ventes
    .filter((v) => {
      const diff = (new Date().getTime() - new Date(v.date).getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    })
    .reduce((acc, v) => acc + v.montant, 0)

  const totalMois = ventes
    .filter((v) => {
      const d = new Date(v.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((acc, v) => acc + v.montant, 0)

  const totalGeneral = ventes.reduce((acc, v) => acc + v.montant, 0)

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.retour} onClick={() => window.location.href = "/"}>← Retour</span>
        <h2 style={styles.titre}>Rapports</h2>
        <div />
      </div>

      <div style={styles.grille}>
        {[
          { label: "Aujourd'hui", montant: totalJour },
          { label: "Cette semaine", montant: totalSemaine },
          { label: "Ce mois", montant: totalMois },
          { label: "Total général", montant: totalGeneral },
        ].map((r) => (
          <div key={r.label} style={styles.carte}>
            <div style={styles.carteLabel}>{r.label}</div>
            <div style={styles.carteMontant}>{r.montant.toLocaleString()}</div>
            <div style={styles.carteUnite}>FCFA</div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitre}>Toutes les ventes</div>
        {ventes.slice().reverse().map((v) => (
          <div key={v.id} style={styles.item}>
            <div style={styles.itemMontant}>{v.montant.toLocaleString()} FCFA</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ ...styles.tag, background: v.statut === "paye" ? "#e6f7ed" : "#fff3e0", color: v.statut === "paye" ? "#1a6b3c" : "#f57c00" }}>
                {v.statut === "paye" ? "Payé" : "Crédit"}
              </span>
              <span style={styles.itemDate}>{new Date(v.date).toLocaleDateString("fr-FR")}</span>
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
  grille: { padding: "20px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  carte: { background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #e8e8e0" },
  carteLabel: { fontSize: 11, color: "#999", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 },
  carteMontant: { fontSize: 24, fontWeight: 700, color: "#1a6b3c", letterSpacing: -1 },
  carteUnite: { fontSize: 11, color: "#999", marginTop: 2 },
  section: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 },
  sectionTitre: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1, color: "#999", marginBottom: 4 },
  item: { background: "#fff", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e8e8e0" },
  itemMontant: { fontSize: 15, fontWeight: 600, color: "#0f0f0f" },
  itemDate: { fontSize: 11, color: "#999" },
  tag: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100 },
}