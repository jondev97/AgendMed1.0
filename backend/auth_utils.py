from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# Configuração de Segurança
SECRET_KEY = "SST_FASTTRACK_SEGREDO_SUPER_SECRETO" # Em produção, isso ficaria num arquivo .env
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verificar_senha(senha_pura, senha_hash):
    return pwd_context.verify(senha_pura, senha_hash)

def gerar_hash_senha(senha):
    return pwd_context.hash(senha)

def criar_token_acesso(dados: dict):
    to_encode = dados.copy()
    # O token expira em 24 horas
    expiracao = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expiracao})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt