import { useState } from 'react';
import axios from 'axios';

export function CadastroKit() {
  const [nomeKit, setNomeKit] = useState('');
  const [exameAtual, setExameAtual] = useState('');
  const [listaExames, setListaExames] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');

  // Adiciona um exame à lista temporária antes de salvar no banco
  const adicionarExame = () => {
    if (exameAtual.trim()) {
      setListaExames([...listaExames, exameAtual.trim()]);
      setExameAtual('');
    }
  };

  const removerExame = (index: number) => {
    setListaExames(listaExames.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listaExames.length === 0) {
      setMensagem('❌ Adicione pelo menos um exame ao kit.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/kits/', {
        nome_kit: nomeKit,
        lista_exames: listaExames
      });

      setMensagem('✅ Kit de exames criado com sucesso!');
      setNomeKit('');
      setListaExames([]);
    } catch (error: any) {
      setMensagem('❌ Erro: ' + (error.response?.data?.detail || 'Erro na API'));
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Configurar Kit de Exames (Serviços)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input 
          type="text" 
          placeholder="Nome do Kit (ex: Admissional Administrativo)" 
          value={nomeKit}
          onChange={(e) => setNomeKit(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="text" 
            placeholder="Nome do Exame" 
            value={exameAtual}
            onChange={(e) => setExameAtual(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
          <button type="button" onClick={adicionarExame} style={{ padding: '8px' }}>
            + Add
          </button>
        </div>

        {/* Lista de exames adicionados visualmente */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '10px 0' }}>
          {listaExames.map((exame, index) => (
            <span key={index} style={{ background: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9em' }}>
              {exame} <button type="button" onClick={() => removerExame(index)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}>x</button>
            </span>
          ))}
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
          Salvar Kit Completo
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}