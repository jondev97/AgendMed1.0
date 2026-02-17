import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      // O FastAPI espera os dados como formulário (FormData), não JSON
      const formData = new FormData();
      formData.append('username', email); // O FastAPI chama email de 'username'
      formData.append('password', senha);

      const response = await axios.post('http://localhost:8000/token', formData);
      
      // 1. Salva o token no navegador
      localStorage.setItem('token', response.data.access_token);
      
      // 2. Redireciona para o Dashboard
      navigate('/');
      
    } catch (err) {
      setErro('❌ E-mail ou senha incorretos.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ecef' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>SST FastTrack 🔐</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <User size={20} color="#666" style={{ marginRight: '10px' }} />
            <input 
              type="email" 
              placeholder="admin@sst.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              style={{ border: 'none', outline: 'none', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <Lock size={20} color="#666" style={{ marginRight: '10px' }} />
            <input 
              type="password" 
              placeholder="Sua senha" 
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              required
              style={{ border: 'none', outline: 'none', flex: 1 }}
            />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            ENTRAR
          </button>
        </form>

        {erro && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{erro}</p>}
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
          Dica: Use <b>admin@sst.com</b> / <b>admin123</b>
        </p>
      </div>
    </div>
  );
}