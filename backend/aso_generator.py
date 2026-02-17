from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os
import tempfile

def gerar_aso_pdf(atendimento):
    # Cria a pasta 'asos_gerados' se não existir
    pasta_destino = tempfile.gettempdir()
    nome_arquivo = f"ASO_{atendimento.paciente.nome.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M')}.pdf"
    caminho_completo = os.path.join(pasta_destino, nome_arquivo)
    
    pasta_destino = "asos_gerados"
    if not os.path.exists(pasta_destino):
        os.makedirs(pasta_destino)

    # Nome do arquivo: ASO_NomePaciente_Data.pdf
    nome_arquivo = f"ASO_{atendimento.paciente.nome.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M')}.pdf"
    caminho_completo = os.path.join(pasta_destino, nome_arquivo)

    # Configuração da página
    c = canvas.Canvas(caminho_completo, pagesize=A4)
    largura, altura = A4

    # --- CABEÇALHO ---
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, altura - 50, "ATESTADO DE SAÚDE OCUPACIONAL (ASO)")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 70, "Conforme NR-7 do Ministério do Trabalho")

    # --- DADOS DA EMPRESA ---
    y = altura - 120
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "1. DADOS DA EMPRESA")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Razão Social: {atendimento.empresa.razao_social}")
    c.drawString(350, y, f"CNPJ: {atendimento.empresa.cnpj}")

    # --- DADOS DO FUNCIONÁRIO ---
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "2. DADOS DO FUNCIONÁRIO")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Nome: {atendimento.paciente.nome}")
    c.drawString(350, y, f"CPF: {atendimento.paciente.cpf}")
    y -= 15
    c.drawString(50, y, f"Cargo: {atendimento.paciente.cargo_atual}")
    c.drawString(350, y, f"Nasc: {atendimento.paciente.data_nascimento}")

    # --- TIPO DE EXAME ---
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "3. TIPO DE EXAME MÉDICO")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Motivo: {atendimento.tipo_exame}")

    # --- RISCOS OCUPACIONAIS ---
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "4. RISCOS OCUPACIONAIS")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Ausência de Riscos Ocupacionais Específicos (Administrativo)")

    # --- CONCLUSÃO MÉDICA ---
    y -= 60
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "CONCLUSÃO:   ( X ) APTO      (   ) INAPTO")

    # --- ASSINATURAS ---
    y -= 100
    c.line(50, y, 250, y)
    c.drawString(50, y - 15, "Assinatura do Médico Examinador")
    
    c.line(300, y, 500, y)
    c.drawString(300, y - 15, "Assinatura do Funcionário")

    # --- DATA ---
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, 50, f"Gerado eletronicamente em: {datetime.now().strftime('%d/%m/%Y às %H:%M')}")

    c.save()
    return caminho_completo