from sqlalchemy import Column, Integer, String, Float
from database.database import Base

class Produit(Base):
    __tablename__ = "produits"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prix = Column(Float, nullable=False)
    quantite = Column(Integer, nullable=False)
    seuil_alerte = Column(Integer, default=5)
