import { useEffect, useState } from 'react';
import axios from 'axios';

// Definimos a "forma" da Empresa para o TypeScript
interface Empresa {
  id: string;
  razao_social: string;
  cnpj: string;
}

export function ListaEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Busca as empresas no seu Backend
    axios.get('https://sst-backend-xyz.onrender.com/empresas/')
      .then(response => {
        setEmpresas(response.data);
      })
      .catch(err => {
        setErro("Não foi possível carregar as empresas.");
        console.error(err);
      });
  }, []);

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee' }}>
      <h3>Empresas Cadastradas</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <ul>
        {empresas.map(emp => (
          <li key={emp.id}>
            {emp.razao_social} - <small>{emp.cnpj}</small>
          </li>
        ))}
        {empresas.length === 0 && !erro && <li>Nenhuma empresa encontrada.</li>}
      </ul>
    </div>
  );
}