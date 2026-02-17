-- Habilita a extensão para gerar UUIDs (Identificadores únicos universais)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Consultorias (Quem recebe o ASO)
CREATE TABLE consultorias_parceiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email_recebimento_kit VARCHAR(255) NOT NULL,
    token_api VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Empresas (O Cliente)
CREATE TABLE empresas_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    consultoria_id UUID REFERENCES consultorias_parceiras(id), -- Vínculo de Roteamento
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Pacientes
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    cargo_atual VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Kits de Exames (Templates)
CREATE TABLE kits_exames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_kit VARCHAR(100) NOT NULL, -- Ex: "Admissional Motorista"
    lista_exames JSONB NOT NULL, -- Ex: ["acuidade", "audiometria", "clinico"]
    ativo BOOLEAN DEFAULT TRUE
);

-- 5. Tabela Central de Atendimentos (Fluxo Operacional)
CREATE TABLE atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    empresa_id UUID REFERENCES empresas_clientes(id),
    kit_id UUID REFERENCES kits_exames(id),
    tipo_exame VARCHAR(50) NOT NULL, -- Admissional, Periódico...
    status VARCHAR(50) DEFAULT 'Aberto', -- Aberto, Triagem, Médico, Finalizado, Enviado
    data_entrada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finalizado_em TIMESTAMP WITH TIME ZONE,
    enviado_em TIMESTAMP WITH TIME ZONE
);

-- 6. Tabela Clínica (Prontuário Médico - 1:1 com Atendimento)
CREATE TABLE atendimento_clinico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID UNIQUE REFERENCES atendimentos(id),
    anamnese_json JSONB NOT NULL, -- Respostas Sim/Não
    exame_fisico_texto TEXT, -- Texto gerado pelas macros
    parecer VARCHAR(50) NOT NULL, -- APTO, INAPTO
    restricao_texto TEXT,
    medico_nome VARCHAR(255),
    medico_crm VARCHAR(50),
    assinatura_hash TEXT, -- Hash do PDF assinado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Arquivos (PDFs gerados)
CREATE TABLE arquivos_atendimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID REFERENCES atendimentos(id),
    tipo_arquivo VARCHAR(50), -- ASO, EXAME_LAB, AUDIOMETRIA
    url_storage TEXT NOT NULL, -- Link S3/Local
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Auditoria de Envios (O Robô)
CREATE TABLE log_envios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID REFERENCES atendimentos(id),
    consultoria_destine_id UUID REFERENCES consultorias_parceiras(id),
    status_envio VARCHAR(50), -- SUCESSO, ERRO
    provider_message_id TEXT, -- ID do Sendgrid/AWS
    tentativa INT DEFAULT 1,
    erro_detalhe TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);