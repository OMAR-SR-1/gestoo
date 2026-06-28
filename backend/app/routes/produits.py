from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.produit import Produit
from pydantic import BaseModel

router = APIRouter()

class ProduitSchema(BaseModel):
    nom: str
    prix: float
    quantite: int
    seuil_alerte: int = 5

@router.post("/")
def creer_produit(data: ProduitSchema, db: Session = Depends(get_db)):
    produit = Produit(nom=data.nom, prix=data.prix, quantite=data.quantite, seuil_alerte=data.seuil_alerte)
    db.add(produit)
    db.commit()
    db.refresh(produit)
    return produit

@router.get("/")
def liste_produits(db: Session = Depends(get_db)):
    return db.query(Produit).all()

@router.get("/alertes")
def produits_en_alerte(db: Session = Depends(get_db)):
    return db.query(Produit).filter(Produit.quantite <= Produit.seuil_alerte).all()

@router.put("/{produit_id}")
def modifier_produit(produit_id: int, data: ProduitSchema, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    produit.nom = data.nom
    produit.prix = data.prix
    produit.quantite = data.quantite
    produit.seuil_alerte = data.seuil_alerte
    db.commit()
    return produit

@router.delete("/{produit_id}")
def supprimer_produit(produit_id: int, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    db.delete(produit)
    db.commit()
    return {"message": "Produit supprimé"}