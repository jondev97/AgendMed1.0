import { CheckIn } from '../components/CheckIn';

export function Recepcao() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Recepção & Triagem</h2>
      <p>Realize o check-in dos funcionários para atendimento.</p>
      <hr style={{ margin: '20px 0' }} />
      <CheckIn />
    </div>
  );
}