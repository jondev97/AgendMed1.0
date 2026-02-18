import { useState } from 'react';
import axios from 'axios';

export function CadastroPaciente() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cargo, setCargo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('Salvando...');

    try {
      await axios.post('https://sst-backend-rij2.onrender.com/pacientes/', {
        nome: nome,
        cpf: cpf,
        data_nascimento: dataNascimento, // O HTML date envia YYYY-MM-DD, que o Python aceita
        cargo_atual: cargo
      });

      setMensagem('✅ Paciente cadastrado com sucesso!');
      setNome('');
      setCpf('');
      setDataNascimento('');
      setCargo('');
    } catch (error: any) {
      setMensagem('❌ Erro: ' + (error.response?.data?.detail || 'Erro na API'));
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cadastrar Paciente (Funcionário)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input 
          type="text" 
          placeholder="Nome Completo" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <input 
          type="text" 
          placeholder="CPF (apenas números)" 
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8em', color: '#666' }}>Data de Nascimento</label>
          <input 
            type="date" 
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
        </div>

        <input 
          type="text" 
          placeholder="Cargo Atual" 
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer' }}>
          Salvar Paciente
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}