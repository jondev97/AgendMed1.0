import { FilaEspera } from '../components/FilaEspera';

export function Medico() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Painel Médico</h2>
      <p>Gerencie a fila de espera e finalize os atendimentos.</p>
      <hr style={{ margin: '20px 0' }} />
      <FilaEspera />
    </div>
  );
}