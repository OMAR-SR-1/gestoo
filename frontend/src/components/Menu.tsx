import { useState } from "react"

export default function Menu() {
  const [ouvert, setOuvert] = useState(false)
  const nom = localStorage.getItem("nom") || ""
  const boutique = localStorage.getItem("boutique") || ""

  const deconnexion = () => {
    localStorage.clear()
    window.location.href = "/connexion"
  }

  const naviguer = (lien: string) => {
    setOuvert(false)
    window.location.href = lien
  }

  return (
    <>
      <button style={styles.avatar} onClick={() => setOuvert(!ouvert)}>
        {nom.charAt(0).toUpperCase()}
      </button>

      {ouvert && (
        <div style={styles.overlay} onClick={() => setOuvert(false)} />
      )}

      <div style={{ ...styles.menu, transform: ouvert ? "translateX(0)" : "translateX(100%)" }}>
        <div style={styles.profil}>
          <div style={styles.avatarGrand}>{nom.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.profilNom}>{nom}</div>
            <div style={styles.profilBoutique}>{boutique}</div>
          </div>
        </div>

        <div style={styles.separateur} />

        {[
          { label: "Dashboard", lien: "/" },
          { label: "Mes ventes", lien: "/ventes" },
          { label: "Mon stock", lien: "/produits" },
          { label: "Clients & Dettes", lien: "/clients" },
          { label: "Rapports", lien: "/rapports" },
        ].map((item) => (
          <div key={item.lien} style={styles.lien} onClick={() => naviguer(item.lien)}>
            {item.label}
          </div>
        ))}

        <div style={styles.separateur} />

        <div style={{ ...styles.lien, color: "#e53935" }} onClick={deconnexion}>
          Se déconnecter
        </div>
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  avatar: {
    position: "fixed",
    top: 28,
    right: "calc(50% - 186px)",
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1a6b3c",
    color: "#fff",
    border: "none",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    zIndex: 1000,
    fontFamily: "Inter, sans-serif",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#00000040",
    zIndex: 998,
  },
  menu: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    background: "#fff",
    zIndex: 999,
    padding: "48px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    transition: "transform 0.25s ease",
    boxShadow: "-4px 0 24px #00000015",
  },
  profil: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatarGrand: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#1a6b3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  profilNom: { fontSize: 14, fontWeight: 600, color: "#0f0f0f" },
  profilBoutique: { fontSize: 12, color: "#999", marginTop: 2 },
  separateur: { height: 1, background: "#f0f0ea", margin: "8px 0" },
  lien: {
    padding: "12px 8px",
    fontSize: 14,
    fontWeight: 500,
    color: "#0f0f0f",
    cursor: "pointer",
    borderRadius: 8,
  },
}