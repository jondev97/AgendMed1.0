import { useState, useEffect } from 'react';
import axios from 'axios';

interface Consultoria {
  id: string;
  nome: string;
}

export function CadastroEmpresa() {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [consultoriaId, setConsultoriaId] = useState('');
  const [consultorias, setConsultorias] = useState<Consultoria[]>([]);
  const [mensagem, setMensagem] = useState('');

  // Carrega as consultorias disponíveis assim que o componente abre
  useEffect(() => {
    axios.get('https://sst-backend-rij2.onrender.com/consultorias/')
      .then(res => setConsultorias(res.data))
      .catch(err => console.error("Erro ao carregar consultorias", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('Salvando...');

    try {
      await axios.post('https://sst-backend-rij2.onrender.com/empresas/', {
        razao_social: razaoSocial,
        cnpj: cnpj,
        consultoria_id: consultoriaId
      });

      setMensagem('✅ Empresa vinculada com sucesso!');
      setRazaoSocial('');
      setCnpj('');
      setConsultoriaId('');
    } catch (error: any) {
      setMensagem('❌ Erro: ' + (error.response?.data?.detail || 'Erro na API'));
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cadastrar Empresa Cliente</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input 
          type="text" 
          placeholder="Razão Social" 
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <input 
          type="text" 
          placeholder="CNPJ (Ex: 00.000.000/0001-00)" 
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <select 
          value={consultoriaId} 
          onChange={(e) => setConsultoriaId(e.target.value)}
          required
          style={{ padding: '8px' }}
        >
          <option value="">Selecione a Consultoria Responsável</option>
          {consultorias.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Vincular Empresa
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}