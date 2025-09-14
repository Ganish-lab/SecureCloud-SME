# SecureCloud SME 🌍🔒
**Affordable Cloud Security for Small & Medium Enterprises (SMEs)**  

SecureCloud SME helps SMEs monitor their cloud environments (AWS first, later Azure & GCP) for misconfigurations, weak policies, and compliance risks  without needing expensive security teams.  
SecureCloud SME delivers **security-as-a-service**, tailored for SMEs in Kenya, Africa, and globally.  

---

## 🚀 Features (MVP)
- ✅ User signup & login (JWT-based authentication)  
- ✅ Save encrypted AWS credentials (prototype using Fernet encryption)  
- ✅ Run **basic security scans** (simulated, placeholder for now)  
- ✅ View scan results (issues, severity, recommendations)  
- 🔜 Real AWS checks using `boto3` (S3, IAM, EC2)  
- 🔜 Multi-cloud support (Azure, GCP)  
- 🔜 React-based dashboard with authentication & scan results  

---

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python 3.11), SQLAlchemy, PostgreSQL  
- **Frontend:** React (Vite, TailwindCSS, ShadCN)  
- **Auth:** JWT Tokens (prototype, to be replaced with OAuth2PasswordBearer)  
- **Infra:** Docker, Docker Compose  
- **Future:** CI/CD with GitHub Actions, deployment on AWS/GCP/Azure  

---

## 📂 Project Structure
