import { useState } from 'react';
import axios from 'axios';

export function CadastroConsultoria() {
  // Estados para controlar os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    setMensagem('Enviando...');

    try {
      const response = await axios.post('https://sst-backend-xyz.onrender.com/consultorias/', {
        nome: nome,
        email_recebimento_kit: email, // Nome do campo conforme nosso backend
        token_api: null
      });

      if (response.status === 200 || response.status === 201) {
        setMensagem('✅ Consultoria cadastrada com sucesso!');
        setNome('');
        setEmail('');
      }
    } catch (error: any) {
      setMensagem('❌ Erro ao cadastrar: ' + (error.response?.data?.detail || 'Erro de conexão'));
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cadastrar Nova Consultoria</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nome da Consultoria" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input 
          type="email" 
          placeholder="E-mail de Recebimento" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Salvar Consultoria
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}