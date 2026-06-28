import { useEffect, useState } from "react"
import api from "../api"

interface VentesJour {
  total: number
  ventes: Array<{
    id: number
    montant: number
    statut: string
    date: string
  }>
}

export default function Dashboard() {
  const nom = localStorage.getItem("nom") || ""
  const boutique = localStorage.getItem("boutique") || ""
  const [data, setData] = useState<VentesJour>({ total: 0, ventes: [] })
  const [alertes, setAlertes] = useState<Array<{ id: number; nom: string; quantite: number }>>([])

  useEffect(() => {
    api.get("/ventes/today").then((res) => setData(res.data))
    api.get("/produits/alertes").then((res) => setAlertes(res.data))
  }, [])

  const deconnexion = () => {
    localStorage.clear()
    window.location.href = "/connexion"
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>Gëstoo</div>
        <div style={styles.avatar} onClick={deconnexion} title="Se déconnecter">
          {nom.charAt(0).toUpperCase()}
        </div>
      </div>

      <div style={styles.cartePrincipale}>
        <div style={styles.date}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        <div style={styles.label}>Chiffre d'affaires aujourd'hui</div>
        <div style={styles.montant}>{data.total.toLocaleString("fr-FR")}</div>
        <div style={styles.unite}>FCFA — {boutique}</div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitre}>Actions rapides</div>
        <div style={styles.actions}>
          {[
            { nom: "Mes ventes", desc: `${data.ventes.length} ventes aujourd'hui`, lien: "/ventes" },
            { nom: "Mon stock", desc: `${alertes.length} alertes`, lien: "/produits" },
            { nom: "Dettes", desc: "Suivi clients", lien: "/clients" },
            { nom: "Rapports", desc: "Semaine, mois", lien: "/rapports" },
          ].map((action) => (
            <div key={action.nom} style={styles.actionBtn} onClick={() => window.location.href = action.lien}>
              <div style={styles.actionNom}>{action.nom}</div>
              <div style={styles.actionDesc}>{action.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {alertes.length > 0 && (
        <div style={styles.alertes}>
          {alertes.map((p) => (
            <div key={p.id} style={styles.alerte}>
              <div style={styles.alertePoint} />
              <div>
                <div style={styles.alerteTexte}>Stock faible — {p.nom}</div>
                <div style={styles.alerteDesc}>{p.quantite} unités restantes</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button style={styles.fab} onClick={() => window.location.href = "/ventes"}>
        + Enregistrer une vente
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f7f7f2", fontFamily: "Inter, sans-serif", maxWidth: 420, margin: "0 auto", paddingBottom: 100 },
  header: { padding: "28px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontFamily: "serif", fontSize: 22, fontWeight: 800, color: "#0f0f0f", letterSpacing: -1 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "#1a6b3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" },
  cartePrincipale: { margin: "28px 24px 0", background: "#0f0f0f", borderRadius: 24, padding: "32px 28px" },
  date: { fontSize: 12, color: "#666", marginBottom: 20 },
  label: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1, color: "#555", marginBottom: 8 },
  montant: { fontSize: 48, fontWeight: 800, color: "#22c76e", letterSpacing: -2, lineHeight: 1 },
  unite: { fontSize: 13, color: "#666", marginTop: 6 },
  section: { padding: "28px 24px 0" },
  sectionTitre: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1, color: "#999", marginBottom: 14 },
  actions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  actionBtn: { background: "#fff", border: "1px solid #e8e8e0", borderRadius: 16, padding: "18px 16px", cursor: "pointer" },
  actionNom: { fontSize: 13, fontWeight: 500, color: "#0f0f0f" },
  actionDesc: { fontSize: 11, color: "#999", marginTop: 2 },
  alertes: { padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 10 },
  alerte: { background: "#fff", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderLeft: "3px solid #f57c00" },
  alertePoint: { width: 8, height: 8, borderRadius: "50%", background: "#f57c00", flexShrink: 0 },
  alerteTexte: { fontSize: 13, color: "#0f0f0f", fontWeight: 500 },
  alerteDesc: { fontSize: 11, color: "#999", marginTop: 1 },
  fab: { position: "fixed" as const, bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#1a6b3c", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const, boxShadow: "0 8px 32px #1a6b3c40" },
}
