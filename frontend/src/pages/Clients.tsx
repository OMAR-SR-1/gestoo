import { useEffect, useState } from "react"
import api from "../api"

interface Client { id: number; nom: string; telephone: string; dette: number }
interface Remboursement { id: number; montant: number; date: string }

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [nom, setNom] = useState("")
  const [telephone, setTelephone] = useState("")
  const [dette, setDette] = useState("")
  const [afficherForm, setAfficherForm] = useState(false)
  const [clientSelectionne, setClientSelectionne] = useState<Client | null>(null)
  const [remboursements, setRemboursements] = useState<Remboursement[]>([])
  const [montantRemb, setMontantRemb] = useState("")

  const charger = () => api.get("/clients/").then((res) => setClients(res.data))

  useEffect(() => { charger() }, [])

  const creer = async () => {
    await api.post("/clients/", { nom, telephone, dette: parseFloat(dette) || 0 })
    setNom(""); setTelephone(""); setDette(""); setAfficherForm(false); charger()
  }

  const ouvrirClient = async (client: Client) => {
    setClientSelectionne(client)
    const res = await api.get(`/clients/${client.id}/remboursements`)
    setRemboursements(res.data)
  }

  const rembourser = async () => {
    if (!clientSelectionne || !montantRemb) return
    await api.put(`/clients/${clientSelectionne.id}/rembourser?montant=${montantRemb}`)
    setMontantRemb("")
    const res = await api.get(`/clients/${clientSelectionne.id}/remboursements`)
    setRemboursements(res.data)
    charger()
    const updated = await api.get("/clients/")
    const c = updated.data.find((x: Client) => x.id === clientSelectionne.id)
    if (c) setClientSelectionne(c)
  }

  const supprimer = async (id: number) => {
    await api.delete(`/clients/${id}`)
    setClientSelectionne(null)
    charger()
  }

  const totalDettes = clients.reduce((acc, c) => acc + c.dette, 0)

  if (clientSelectionne) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <span style={styles.retour} onClick={() => setClientSelectionne(null)}>← Retour</span>
          <h2 style={styles.titre}>{clientSelectionne.nom}</h2>
          <button style={styles.btnSuppr} onClick={() => supprimer(clientSelectionne.id)}>Supprimer</button>
        </div>

        <div style={{ ...styles.detteCard, background: clientSelectionne.dette > 0 ? "#0f0f0f" : "#1a6b3c" }}>
          <div style={styles.detteLabel}>Dette restante</div>
          <div style={{ ...styles.detteMontant, color: clientSelectionne.dette > 0 ? "#e53935" : "#22c76e" }}>
            {clientSelectionne.dette > 0 ? `${clientSelectionne.dette.toLocaleString()} FCFA` : "Tout remboursé"}
          </div>
        </div>

        {clientSelectionne.dette > 0 && (
          <div style={styles.form}>
            <input
              style={styles.input}
              type="number"
              placeholder="Montant remboursé (FCFA)"
              value={montantRemb}
              onChange={(e) => setMontantRemb(e.target.value)}
            />
            <button style={styles.btn} onClick={rembourser}>Confirmer le remboursement</button>
          </div>
        )}

        <div style={styles.section}>
          <div style={styles.sectionTitre}>Historique des remboursements</div>
          {remboursements.length === 0 && (
            <div style={styles.vide}>Aucun remboursement enregistré</div>
          )}
          {remboursements.slice().reverse().map((r) => (
            <div key={r.id} style={styles.item}>
              <div style={styles.itemMontant}>{r.montant.toLocaleString()} FCFA</div>
              <div style={styles.itemStatut}>Remboursé</div>
              <div style={styles.itemDate}>{new Date(r.date).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.retour} onClick={() => window.location.href = "/"}>← Retour</span>
        <h2 style={styles.titre}>Clients & Dettes</h2>
        <button style={styles.btnAjout} onClick={() => setAfficherForm(!afficherForm)}>+</button>
      </div>

      <div style={styles.totalBadge}>
        Total dettes : <strong>{totalDettes.toLocaleString()} FCFA</strong>
      </div>

      {afficherForm && (
        <div style={styles.form}>
          <input style={styles.input} placeholder="Nom du client" value={nom} onChange={(e) => setNom(e.target.value)} />
          <input style={styles.input} placeholder="Téléphone (optionnel)" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          <input style={styles.input} type="number" placeholder="Dette initiale (FCFA)" value={dette} onChange={(e) => setDette(e.target.value)} />
          <button style={styles.btn} onClick={creer}>Ajouter le client</button>
        </div>
      )}

      <div style={styles.liste}>
        {clients.map((c) => (
          <div key={c.id} style={styles.item} onClick={() => ouvrirClient(c)}>
            <div>
              <div style={styles.itemNom}>{c.nom}</div>
              <div style={styles.itemTel}>{c.telephone || "Pas de numéro"}</div>
              {c.dette > 0 && <div style={styles.detteTag}>{c.dette.toLocaleString()} FCFA dus</div>}
              {c.dette === 0 && <div style={styles.detteOk}>Remboursé</div>}
            </div>
            <div style={styles.chevron}>›</div>
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
  btnSuppr: { fontSize: 12, color: "#e53935", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
  totalBadge: { margin: "16px 24px 0", background: "#e6f7ed", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#1a6b3c" },
  form: { margin: "16px 24px 0", background: "#fff", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #e8e8e0" },
  input: { padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e0", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" },
  btn: { padding: 13, background: "#1a6b3c", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  liste: { padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 },
  item: { background: "#fff", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e8e8e0", cursor: "pointer" },
  itemNom: { fontSize: 14, fontWeight: 500, color: "#0f0f0f" },
  itemTel: { fontSize: 12, color: "#999", marginTop: 2 },
  detteTag: { fontSize: 12, color: "#e53935", fontWeight: 600, marginTop: 4 },
  detteOk: { fontSize: 12, color: "#1a6b3c", fontWeight: 600, marginTop: 4 },
  chevron: { fontSize: 20, color: "#ccc" },
  detteCard: { margin: "20px 24px 0", borderRadius: 20, padding: "24px 20px" },
  detteLabel: { fontSize: 12, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 },
  detteMontant: { fontSize: 36, fontWeight: 800, letterSpacing: -1 },
  section: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 },
  sectionTitre: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: 1, color: "#999", marginBottom: 4 },
  vide: { fontSize: 13, color: "#999", textAlign: "center" as const, padding: "20px 0" },
  itemMontant: { fontSize: 14, fontWeight: 600, color: "#1a6b3c" },
  itemStatut: { fontSize: 11, color: "#fff", background: "#1a6b3c", padding: "2px 8px", borderRadius: 100 },
  itemDate: { fontSize: 11, color: "#999" },
}