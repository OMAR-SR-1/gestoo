from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.utilisateur import Utilisateur
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel
import os

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "gestoo_secret_key"

class InscriptionSchema(BaseModel):
    nom: str
    telephone: str
    nom_boutique: str
    mot_de_passe: str

class ConnexionSchema(BaseModel):
    telephone: str
    mot_de_passe: str

@router.post("/inscription")
def inscription(data: InscriptionSchema, db: Session = Depends(get_db)):
    existant = db.query(Utilisateur).filter(Utilisateur.telephone == data.telephone).first()
    if existant:
        raise HTTPException(status_code=400, detail="Numéro déjà utilisé")
    utilisateur = Utilisateur(
        nom=data.nom,
        telephone=data.telephone,
        nom_boutique=data.nom_boutique,
        mot_de_passe=pwd_context.hash(data.mot_de_passe)
    )
    db.add(utilisateur)
    db.commit()
    db.refresh(utilisateur)
    return {"message": "Compte créé avec succès"}

@router.post("/connexion")
def connexion(data: ConnexionSchema, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.telephone == data.telephone).first()
    if not utilisateur or not pwd_context.verify(data.mot_de_passe, utilisateur.mot_de_passe):
        raise HTTPException(status_code=400, detail="Numéro ou mot de passe incorrect")
    token = jwt.encode({"id": utilisateur.id}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "nom": utilisateur.nom, "boutique": utilisateur.nom_boutique}
