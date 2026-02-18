import { useState, useEffect } from 'react';
import axios from 'axios';

interface Empresa { id: string; razao_social: string; }
interface Kit { id: string; nome_kit: string; }
interface Paciente { id: string; nome: string; cpf: string; }

export function CheckIn() {
  // Listas para os selects
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  
  // Dados do formulário
  const [cpfBusca, setCpfBusca] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [empresaId, setEmpresaId] = useState('');
  const [kitId, setKitId] = useState('');
  const [tipoExame, setTipoExame] = useState('Admissional');
  
  const [mensagem, setMensagem] = useState('');

  // Carrega Empresas e Kits ao iniciar
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resEmp, resKit] = await Promise.all([
          axios.get('https://sst-backend-rij2.onrender.com/empresas/'),
          axios.get('https://sst-backend-rij2.onrender.com/kits/')
        ]);
        setEmpresas(resEmp.data);
        setKits(resKit.data);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais", err);
      }
    };
    carregarDados();
  }, []);

  // Busca paciente por CPF no banco (Simulação de busca rápida)
  const buscarPaciente = async () => {
    try {
      const res = await axios.get('https://sst-backend-rij2.onrender.com/pacientes/');
      const encontrado = res.data.find((p: Paciente) => p.cpf === cpfBusca);
      if (encontrado) {
        setPacienteSelecionado(encontrado);
        setMensagem('');
      } else {
        setPacienteSelecionado(null);
        setMensagem('❌ Paciente não encontrado. Cadastre-o primeiro.');
      }
    } catch (err) {
      setMensagem('❌ Erro ao buscar paciente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSelecionado) return;

    try {
      await axios.post('https://sst-backend-rij2.onrender.com/atendimentos/', {
        paciente_id: pacienteSelecionado.id,
        empresa_id: empresaId,
        kit_id: kitId,
        tipo_exame: tipoExame
      });
      setMensagem('✅ Check-in realizado! Paciente enviado para a fila.');
      // Limpar formulário
      setPacienteSelecionado(null);
      setCpfBusca('');
      setEmpresaId('');
      setKitId('');
    } catch (error: any) {
      setMensagem('❌ Erro no check-in: ' + (error.response?.data?.detail || 'Erro na API'));
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ color: '#007bff' }}>Check-in de Atendimento</h2>
      
      {/* Busca de Paciente */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Digite o CPF para buscar" 
          value={cpfBusca}
          onChange={(e) => setCpfBusca(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <button type="button" onClick={buscarPaciente} style={{ padding: '8px 15px' }}>Buscar</button>
      </div>

      {pacienteSelecionado && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ padding: '10px', background: '#e9ecef', borderRadius: '4px' }}>
            <strong>Paciente:</strong> {pacienteSelecionado.nome}
          </div>

          <select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} required style={{ padding: '10px' }}>
            <option value="">Selecione a Empresa do Funcionário</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.razao_social}</option>)}
          </select>

          <select value={kitId} onChange={(e) => setKitId(e.target.value)} required style={{ padding: '10px' }}>
            <option value="">Selecione o Kit de Exames</option>
            {kits.map(k => <option key={k.id} value={k.id}>{k.nome_kit}</option>)}
          </select>

          <select value={tipoExame} onChange={(e) => setTipoExame(e.target.value)} style={{ padding: '10px' }}>
            <option value="Admissional">Admissional</option>
            <option value="Periódico">Periódico</option>
            <option value="Mudança de Função">Mudança de Função</option>
            <option value="Retorno ao Trabalho">Retorno ao Trabalho</option>
            <option value="Demissional">Demissional</option>
          </select>

          <button type="submit" style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            FINALIZAR CHECK-IN
          </button>
        </form>
      )}

      {mensagem && <p style={{ marginTop: '10px' }}>{mensagem}</p>}
    </div>
  );
}