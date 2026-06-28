from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class Vente(Base):
    __tablename__ = "ventes"

    id = Column(Integer, primary_key=True, index=True)
    produit_id = Column(Integer, ForeignKey("produits.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    quantite = Column(Integer, nullable=False)
    montant = Column(Float, nullable=False)
    statut = Column(String, default="paye")
    date = Column(DateTime, default=datetime.utcnow)

    produit = relationship("Produit")
    client = relationship("Client")
