from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from database.database import Base
from datetime import datetime

class Remboursement(Base):
    __tablename__ = "remboursements"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    montant = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)