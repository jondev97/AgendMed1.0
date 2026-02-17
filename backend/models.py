import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# 1. Consultorias (Quem recebe o ASO)
class Consultoria(Base):
    __tablename__ = "consultorias_parceiras"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String, nullable=False)
    email_recebimento_kit = Column(String, nullable=False)
    token_api = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    empresas = relationship("Empresa", back_populates="consultoria")

# 2. Empresas (Quem paga a conta)
class Empresa(Base):
    __tablename__ = "empresas_clientes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    razao_social = Column(String, nullable=False)
    cnpj = Column(String, unique=True, nullable=False)
    consultoria_id = Column(UUID(as_uuid=True), ForeignKey("consultorias_parceiras.id"))
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    consultoria = relationship("Consultoria", back_populates="empresas")

# 3. Pacientes (O Funcionário)
class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String, nullable=False)
    cpf = Column(String, unique=True, nullable=False)
    data_nascimento = Column(DateTime, nullable=False) 
    cargo_atual = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 4. Kits de Exames (Os Pacotes)
class KitExame(Base):
    __tablename__ = "kits_exames"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome_kit = Column(String, nullable=False)
    lista_exames = Column(JSONB, nullable=False) 
    ativo = Column(Boolean, default=True)

# 5. Atendimentos (O Check-in)
class Atendimento(Base):
    __tablename__ = "atendimentos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Chaves Estrangeiras
    paciente_id = Column(UUID(as_uuid=True), ForeignKey("pacientes.id"))
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresas_clientes.id"))
    kit_id = Column(UUID(as_uuid=True), ForeignKey("kits_exames.id"))
    
    tipo_exame = Column(String, nullable=False)
    status = Column(String, default="Aberto")
    
    data_entrada = Column(DateTime(timezone=True), server_default=func.now())
    finalizado_em = Column(DateTime(timezone=True), nullable=True)
    enviado_em = Column(DateTime(timezone=True), nullable=True)

    # Relacionamentos
    paciente = relationship("Paciente")
    empresa = relationship("Empresa")
    kit = relationship("KitExame")
    
# 6. Usúarios
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String) # Nunca salvamos a senha real, só o hash!
    cargo = Column(String) # 'admin', 'medico', 'recepcao'   