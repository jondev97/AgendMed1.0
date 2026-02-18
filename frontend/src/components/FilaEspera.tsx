import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, User, Building2, CheckCircle, AlertCircle } from 'lucide-react';

// Interface tipada com os objetos aninhados (Join do Backend)
interface Atendimento {
  id: string;
  tipo_exame: string;
  status: string; // "Aberto", "Finalizado", etc.
  data_entrada: string;
  paciente?: {
    nome: string;
  };
  empresa?: {
    razao_social: string;
  };
}

export function FilaEspera() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);

  // Função para buscar a fila do Backend
  const buscarFila = async () => {
    try {
      const res = await axios.get('https://sst-backend-xyz.onrender.com/atendimentos/');
      
      // Filtra apenas quem está com status "Aberto"
      const abertos = res.data.filter((a: Atendimento) => a.status === 'Aberto');
      
      // Ordena: Mais antigos primeiro (FIFO - First In, First Out)
      abertos.sort((a: Atendimento, b: Atendimento) => 
        new Date(a.data_entrada).getTime() - new Date(b.data_entrada).getTime()
      );

      setAtendimentos(abertos);
    } catch (err) {
      console.error("Erro ao carregar fila", err);
    } finally {
      setCarregando(false);
    }
  };

  // Função para o Médico finalizar o atendimento
  const finalizarAtendimento = async (id: string) => {
    if(!confirm("Deseja realmente finalizar este atendimento?")) return;

    try {
      // Chama a rota PATCH que criamos no Python
      await axios.patch(`https://sst-backend-xyz.onrender.com/atendimentos/${id}/finalizar`);
      
      setMensagem({ texto: "✅ Atendimento finalizado com sucesso!", tipo: 'sucesso' });
      
      // Atualiza a lista imediatamente para o paciente sumir
      buscarFila();

      // Limpa a mensagem após 3 segundos
      setTimeout(() => setMensagem(null), 3000);

    } catch (err) {
      console.error(err);
      setMensagem({ texto: "❌ Erro ao finalizar. Verifique o console.", tipo: 'erro' });
    }
  };

  // Efeito para carregar ao abrir e atualizar a cada 15s
  useEffect(() => {
    buscarFila();
    const intervalo = setInterval(buscarFila, 15000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="#007bff"/> Fila de Espera (Tempo Real)
        </h3>
        <button onClick={buscarFila} style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '0.8rem' }}>🔄 Atualizar</button>
      </div>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <div style={{ 
          padding: '10px', marginBottom: '15px', borderRadius: '4px',
          backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
          color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24'
        }}>
          {mensagem.texto}
        </div>
      )}

      {carregando ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Carregando fila...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #007bff', textAlign: 'left', backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px' }}>Chegada</th>
              <th>Paciente</th>
              <th>Empresa</th>
              <th>Exame</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {atendimentos.map((atend) => (
              <tr key={atend.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', color: '#666' }}>
                  {new Date(atend.data_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                
                {/* Exibe o NOME se existir, senão mostra o ID cortado */}
                <td style={{ fontWeight: 'bold', color: '#333' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={16} color="#666"/>
                    {atend.paciente?.nome || <span style={{color:'red'}}>Sem Nome ({atend.id.slice(0,6)})</span>}
                  </div>
                </td>
                
                <td style={{ color: '#555' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Building2 size={16} color="#666"/>
                    {atend.empresa?.razao_social || "N/A"}
                  </div>
                </td>
                
                <td>
                  <span style={{ backgroundColor: '#e2e3e5', padding: '2px 8px', borderRadius: '10px', fontSize: '0.85em' }}>
                    {atend.tipo_exame}
                  </span>
                </td>
                
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => finalizarAtendimento(atend.id)}
                    title="Concluir Atendimento"
                    style={{ 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 15px', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: 'bold'
                    }}
                  >
                    <CheckCircle size={16} /> Finalizar
                  </button>
                </td>
              </tr>
            ))}

            {atendimentos.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={40} color="#28a745" />
                    <span>Nenhum paciente aguardando no momento.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}