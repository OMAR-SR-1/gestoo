from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.client import Client
from models.remboursement import Remboursement
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ClientSchema(BaseModel):
    nom: str
    telephone: Optional[str] = None
    dette: Optional[float] = 0

@router.post("/")
def creer_client(data: ClientSchema, db: Session = Depends(get_db)):
    client = Client(nom=data.nom, telephone=data.telephone, dette=data.dette or 0)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.get("/")
def liste_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@router.get("/dettes")
def clients_avec_dettes(db: Session = Depends(get_db)):
    return db.query(Client).filter(Client.dette > 0).all()

@router.get("/{client_id}/remboursements")
def historique_remboursements(client_id: int, db: Session = Depends(get_db)):
    return db.query(Remboursement).filter(Remboursement.client_id == client_id).all()

@router.put("/{client_id}/rembourser")
def rembourser(client_id: int, montant: float, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    client.dette -= montant
    if client.dette < 0:
        client.dette = 0
    remboursement = Remboursement(client_id=client_id, montant=montant)
    db.add(remboursement)
    db.commit()
    return {"message": "Remboursement enregistré", "dette_restante": client.dette}

@router.delete("/{client_id}")
def supprimer_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    db.delete(client)
    db.commit()
    return {"message": "Client supprimé"}