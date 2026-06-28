from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from routes import auth, produits, ventes, clients
import models.remboursement

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(produits.router, prefix="/produits")
app.include_router(ventes.router, prefix="/ventes")
app.include_router(clients.router, prefix="/clients")

@app.get("/")
def accueil():
    return {"message": "Gëstoo API"}