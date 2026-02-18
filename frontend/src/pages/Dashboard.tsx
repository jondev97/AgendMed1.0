import { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, CalendarCheck, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [stats, setStats] = useState({
    total_empresas: 0,
    total_pacientes: 0,
    atendimentos_hoje: 0,
    fila_atual: 0
  });

  useEffect(() => {
    // Busca os dados atualizados ao carregar a página
    axios.get('https://sst-backend-xyz.onrender.com/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Erro ao carregar dashboard", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>Visão Geral da Clínica</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Bem-vindo ao SST FastTrack. Aqui está o resumo operacional de hoje.</p>

      {/* Grid de Cartões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Cartão 1: Atendimentos Hoje */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Atendimentos Hoje</span>
            <CalendarCheck size={24} color="#007bff" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.atendimentos_hoje}</div>
          <div style={{ fontSize: '0.8rem', color: '#28a745', marginTop: '5px' }}>
            <TrendingUp size={12} style={{ display: 'inline' }}/> Clínica ativa
          </div>
        </div>

        {/* Cartão 2: Fila de Espera */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Na Fila Agora</span>
            <Clock size={24} color="#dc3545" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>{stats.fila_atual}</div>
          {stats.fila_atual > 0 ? (
            <Link to="/medico" style={{ fontSize: '0.8rem', color: '#007bff', textDecoration: 'none' }}>Ver fila →</Link>
          ) : (
             <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Fila vazia</span>
          )}
        </div>

        {/* Cartão 3: Total Empresas */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Empresas Clientes</span>
            <Building2 size={24} color="#28a745" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.total_empresas}</div>
          <Link to="/admin" style={{ fontSize: '0.8rem', color: '#007bff', textDecoration: 'none' }}>Gerir empresas →</Link>
        </div>

        {/* Cartão 4: Total Vidas */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Vidas (Funcionários)</span>
            <Users size={24} color="#ffc107" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.total_pacientes}</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Base total cadastrada</div>
        </div>

      </div>

      {/* Ações Rápidas */}
      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Acesso Rápido</h3>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/recepcao" style={actionButtonStyle}>
           ➕ Novo Check-in
        </Link>
        <Link to="/medico" style={actionButtonStyle}>
           🩺 Chamar Paciente
        </Link>
        <Link to="/admin" style={actionButtonStyle}>
           ⚙️ Configurações
        </Link>
      </div>
    </div>
  );
}

// Estilos CSS-in-JS simples para os cartões
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0',
  display: 'flex',
  flexDirection: 'column'
};

const actionButtonStyle: React.CSSProperties = {
  padding: '15px 25px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #ddd',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: '0.2s'
};