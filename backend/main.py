from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from uuid import UUID
from sqlalchemy.sql import func
from datetime import date
from aso_generator import gerar_aso_pdf
from database import get_db, engine, SessionLocal
import models
import schemas

#teste user
from auth_utils import gerar_hash_senha, verificar_senha, criar_token_acesso
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm



# Cria as tabelas no banco se não existirem
models.Base.metadata.create_all(bind=engine)


def criar_admin_padrao():
    db = SessionLocal()
    usuario = db.query(models.Usuario).filter(models.Usuario.email == "admin@sst.com").first()
    
    if not usuario:
        print("👤 Criando usuário ADMIN padrão...")
        novo_admin = models.Usuario(
            nome="Administrador",
            email="admin@sst.com",
            senha_hash=gerar_hash_senha("admin123"),
            cargo="admin"
        )
        db.add(novo_admin)
        print("✅ Usuário Admin CRIADO.")
    else:
        # SE JÁ EXISTE, ATUALIZA A SENHA PARA GARANTIR
        print("🔄 Usuário Admin encontrado. Atualizando senha...")
        usuario.senha_hash = gerar_hash_senha("admin123")
        print("✅ Senha do Admin ATUALIZADA.")
    
    db.commit()
    db.close()

# Não esqueça de manter a chamada da função logo abaixo!
criar_admin_padrao()



app = FastAPI(title="SST FastTrack API")


# Libera o acesso para o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTA DE TESTE BÁSICA ---
@app.get("/")
def read_root():
    return {"message": "SST FastTrack API está rodando! 🚀"}


# --- ROTAS DE CONSULTORIA (Já existiam) ---

@app.post("/consultorias/", response_model=schemas.ConsultoriaResponse)
def criar_consultoria(consultoria: schemas.ConsultoriaCreate, db: Session = Depends(get_db)):
    db_consultoria = models.Consultoria(**consultoria.dict())
    db.add(db_consultoria)
    db.commit()
    db.refresh(db_consultoria)
    return db_consultoria

@app.get("/consultorias/", response_model=List[schemas.ConsultoriaResponse])
def listar_consultorias(db: Session = Depends(get_db)):
    return db.query(models.Consultoria).all()

# --- NOVO: ROTAS DE EMPRESA ---

@app.post("/empresas/", response_model=schemas.EmpresaResponse)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    # 1. Verifica se a Consultoria Pai existe
    consultoria = db.query(models.Consultoria).filter(models.Consultoria.id == empresa.consultoria_id).first()
    if not consultoria:
        raise HTTPException(status_code=404, detail="Consultoria não encontrada! Impossível vincular.")

    # 2. Verifica se o CNPJ já existe
    empresa_existente = db.query(models.Empresa).filter(models.Empresa.cnpj == empresa.cnpj).first()
    if empresa_existente:
        raise HTTPException(status_code=400, detail="Já existe uma empresa com este CNPJ.")

    # 3. Cria a Empresa
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

@app.get("/empresas/", response_model=List[schemas.EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()

# --- ROTAS DE PACIENTES ---
@app.post("/pacientes/", response_model=schemas.PacienteResponse)
def criar_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    # Verifica CPF duplicado
    if db.query(models.Paciente).filter(models.Paciente.cpf == paciente.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado.")
    
    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@app.get("/pacientes/", response_model=List[schemas.PacienteResponse])
def listar_pacientes(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

# --- ROTAS DE KITS ---
@app.post("/kits/", response_model=schemas.KitResponse)
def criar_kit(kit: schemas.KitCreate, db: Session = Depends(get_db)):
    # O campo lista_exames entra como JSON automaticamente
    db_kit = models.KitExame(**kit.dict())
    db.add(db_kit)
    db.commit()
    db.refresh(db_kit)
    return db_kit

@app.get("/kits/", response_model=List[schemas.KitResponse])
def listar_kits(db: Session = Depends(get_db)):
    return db.query(models.KitExame).all()

# --- ROTA DE CHECK-IN (ATENDIMENTO) ---

@app.get("/atendimentos/", response_model=List[schemas.AtendimentoResponse])
def listar_atendimentos(db: Session = Depends(get_db)):
    # O .all() já traz os relacionamentos configurados no models.py
    return db.query(models.Atendimento).all()

@app.post("/atendimentos/", response_model=schemas.AtendimentoResponse)
def criar_atendimento(atendimento: schemas.AtendimentoCreate, db: Session = Depends(get_db)):
    # Aqui poderíamos validar se paciente e empresa existem, mas o FK do banco já protege
    db_atendimento = models.Atendimento(**atendimento.dict())
    db.add(db_atendimento)
    db.commit()
    db.refresh(db_atendimento)
    return db_atendimento

@app.patch("/atendimentos/{atendimento_id}/finalizar")
def finalizar_atendimento(atendimento_id: UUID, db: Session = Depends(get_db)):
    # 1. Busca os dados completos (com Paciente e Empresa) para por no PDF
    db_atendimento = db.query(models.Atendimento)\
        .join(models.Paciente)\
        .join(models.Empresa)\
        .filter(models.Atendimento.id == atendimento_id).first()
    
    if not db_atendimento:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado")
    
    # 2. Gera o PDF do ASO
    try:
        caminho_pdf = gerar_aso_pdf(db_atendimento)
        print(f"📄 PDF Gerado com sucesso: {caminho_pdf}")
        
        # Aqui simulamos o envio de e-mail
        print(f"📧 Enviando e-mail para: {db_atendimento.empresa.consultoria.email_recebimento_kit}...")
        print("✅ E-mail enviado (Simulado)")

    except Exception as e:
        print(f"❌ Erro ao gerar PDF: {e}")
        # Não vamos travar o sistema se o PDF falhar no MVP, mas logamos o erro.

    # 3. Atualiza o status no banco
    db_atendimento.status = "Finalizado"
    db_atendimento.finalizado_em = func.now()
    
    db.commit()
    return {"message": "Atendimento finalizado e ASO gerado!", "caminho_aso": caminho_pdf}

 #-- ROTA DE DASHBOARD (Estatísticas) ---
@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # 1. Total de Empresas Clientes
    total_empresas = db.query(models.Empresa).count()
    
    # 2. Total de Funcionários Cadastrados
    total_pacientes = db.query(models.Paciente).count()
    
    # 3. Atendimentos realizados HOJE
    hoje = date.today()
    atendimentos_hoje = db.query(models.Atendimento).filter(
        func.date(models.Atendimento.data_entrada) == hoje
    ).count()
    
    # 4. Pessoas na Fila agora (Status = Aberto)
    fila_atual = db.query(models.Atendimento).filter(
        models.Atendimento.status == "Aberto"
    ).count()

    return {
        "total_empresas": total_empresas,
        "total_pacientes": total_pacientes,
        "atendimentos_hoje": atendimentos_hoje,
        "fila_atual": fila_atual
    }

#--- ROTA DE LOGIN (Autenticação) ---
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Busca o usuário pelo e-mail
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    
    # Se não achar ou senha errada
    if not usuario or not verificar_senha(form_data.password, usuario.senha_hash):
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos")
    
    # Se deu certo, gera o token
    token = criar_token_acesso({"sub": usuario.email, "cargo": usuario.cargo})
    return {"access_token": token, "token_type": "bearer"}



# ... seus outros códigos ...

# --- ROTA DE EMERGÊNCIA (Use e depois apague) ---
@app.get("/force-reset")
def force_reset(db: Session = Depends(get_db)):
    # 1. Busca o usuário
    usuario = db.query(models.Usuario).filter(models.Usuario.email == "admin@sst.com").first()
    
    if not usuario:
        return {"status": "ERRO", "mensagem": "Usuário admin@sst.com não encontrado no banco!"}
    
    # 2. Força a nova senha
    nova_senha = "admin123"
    usuario.senha_hash = gerar_hash_senha(nova_senha)
    db.add(usuario)
    db.commit()
    
    return {
        "status": "SUCESSO", 
        "mensagem": f"Senha resetada com sucesso para: {nova_senha}",
        "hash_gerado": usuario.senha_hash[:20] + "..." # Mostra o começo do hash pra provar que gerou
    }