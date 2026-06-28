from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.vente import Vente
from models.produit import Produit
from models.client import Client
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

router = APIRouter()

class VenteSchema(BaseModel):
    produit_id: int
    quantite: int
    statut: str
    client_id: Optional[int] = None

@router.post("/")
def creer_vente(data: VenteSchema, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == data.produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    if produit.quantite < data.quantite:
        raise HTTPException(status_code=400, detail="Stock insuffisant")
    montant = produit.prix * data.quantite
    produit.quantite -= data.quantite
    vente = Vente(
        produit_id=data.produit_id,
        client_id=data.client_id,
        quantite=data.quantite,
        montant=montant,
        statut=data.statut
    )
    if data.statut == "credit" and data.client_id:
        client = db.query(Client).filter(Client.id == data.client_id).first()
        if client:
            client.dette += montant
    db.add(vente)
    db.commit()
    db.refresh(vente)
    return vente

@router.get("/")
def liste_ventes(db: Session = Depends(get_db)):
    return db.query(Vente).all()

@router.get("/today")
def ventes_du_jour(db: Session = Depends(get_db)):
    aujourd_hui = date.today()
    ventes = db.query(Vente).filter(
        Vente.date >= datetime.combine(aujourd_hui, datetime.min.time()),
        Vente.statut == "paye"
    ).all()
    total = sum(v.montant for v in ventes)
    return {"ventes": ventes, "total": total}

@router.put("/{vente_id}/payer")
def marquer_paye(vente_id: int, db: Session = Depends(get_db)):
    vente = db.query(Vente).filter(Vente.id == vente_id).first()
    if not vente:
        raise HTTPException(status_code=404, detail="Vente introuvable")
    vente.statut = "paye"
    if vente.client_id:
        client = db.query(Client).filter(Client.id == vente.client_id).first()
        if client:
            client.dette -= vente.montant
            if client.dette < 0:
                client.dette = 0
    db.commit()
    return {"message": "Payée"}