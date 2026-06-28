from sqlalchemy import Column, Integer, String
from database.database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    telephone = Column(String, unique=True, nullable=False)
    nom_boutique = Column(String, nullable=False)
    mot_de_passe = Column(String, nullable=False)
