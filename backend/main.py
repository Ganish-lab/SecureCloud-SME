from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional

app = FastAPI(title="SecureCloud SME API")

@app.get("/")
def root():
    return {"message": "SecureCloud SME Backend Running 🚀"}

# --------------------
# MODELS
# --------------------
class SMERegister(BaseModel):
    company_name: str
    email: EmailStr
    password: str

class SMELogin(BaseModel):
    email: EmailStr
    password: str

class ScanResources(BaseModel):
    domains: Optional[List[str]] = []
    public_ips: Optional[List[str]] = []
    web_apps: Optional[List[str]] = []
    internal_ips: Optional[List[str]] = []
    on_prem_apps: Optional[List[str]] = []
    config_files: Optional[List[str]] = []

# --------------------
# ROUTES
# --------------------
@app.post("/register")
def register_sme(data: SMERegister):
    # TODO: save to database
    return {"message": f"SME {data.company_name} registered successfully!"}

@app.post("/login")
def login_sme(data: SMELogin):
    # TODO: validate against database
    if data.email == "test@ganira.co.ke" and data.password == "1234":
        return {"message": "Login successful", "token": "fake-jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/resources")
def set_resources(data: ScanResources):
    # TODO: save allowed resources
    return {"message": "Resources saved successfully", "data": data.dict()}
