from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from datetime import date

# --- Schemas para Consultoria ---

# O que eu preciso para CRIAR uma consultoria?
class ConsultoriaCreate(BaseModel):
    nome: str
    email_recebimento_kit: EmailStr
    token_api: Optional[str] = None

# O que a API devolve quando eu peço uma consultoria?
class ConsultoriaResponse(ConsultoriaCreate):
    id: UUID
    ativo: bool
    created_at: datetime

    class Config:
        from_attributes = True # Permite ler direto do banco (ORM)

# --- Schemas para Empresa ---

class EmpresaCreate(BaseModel):
    razao_social: str
    cnpj: str
    consultoria_id: UUID # Obrigatório vincular a uma consultoria!

class EmpresaResponse(EmpresaCreate):
    id: UUID
    ativo: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Schemas de Paciente ---
class PacienteCreate(BaseModel):
    nome: str
    cpf: str
    data_nascimento: date # O Pydantic valida formato YYYY-MM-DD
    cargo_atual: str

class PacienteResponse(PacienteCreate):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# --- Schemas de Kit ---
class KitCreate(BaseModel):
    nome_kit: str
    lista_exames: List[str] # Ex: ["clinico", "audiometria"]

class KitResponse(KitCreate):
    id: UUID
    ativo: bool
    class Config:
        from_attributes = True

# --- Schemas de Atendimento (O Check-in) ---
class AtendimentoCreate(BaseModel):
    paciente_id: UUID
    empresa_id: UUID
    kit_id: UUID
    tipo_exame: str # "Admissional", "Demissional"

class AtendimentoResponse(AtendimentoCreate):
    id: UUID
    status: str
    data_entrada: datetime
    class Config:
        from_attributes = True        
        
class PacienteSimples(BaseModel):
    nome: str
    class Config:
        from_attributes = True

class EmpresaSimples(BaseModel):
    razao_social: str
    class Config:
        from_attributes = True

class AtendimentoResponse(AtendimentoCreate):
    id: UUID
    status: str
    data_entrada: datetime
    # Aqui a mágica acontece: incluímos os objetos relacionados
    paciente: Optional[PacienteSimples]
    empresa: Optional[EmpresaSimples]

    class Config:
        from_attributes = True        