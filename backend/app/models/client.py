from sqlalchemy import Column, Integer, String, Float
from database.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    telephone = Column(String, nullable=True)
    dette = Column(Float, default=0)