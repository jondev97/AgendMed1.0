import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Settings, Home, LogOut } from 'lucide-react';

import { Recepcao } from './pages/Recepcao';
import { Medico } from './pages/Medico';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login'; // Nova página

// Componente "Segurança": Só deixa passar se tiver token
function RotaProtegida({ children }: { children: any }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Componente de Layout com Menu (Para não mostrar menu na tela de login)
function LayoutComMenu({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  const fazerLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ backgroundColor: '#007bff', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>SST FastTrack</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={linkStyle}><Home size={18}/> Início</Link>
          <Link to="/recepcao" style={linkStyle}><LayoutDashboard size={18}/> Recepção</Link>
          <Link to="/medico" style={linkStyle}><Stethoscope size={18}/> Médico</Link>
          <Link to="/admin" style={linkStyle}><Settings size={18}/> Admin</Link>
          <button onClick={fazerLogout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '20px' }}>
            <LogOut size={18}/> Sair
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, backgroundColor: '#f4f6f9', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

const linkStyle = { color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas (Todas usam o LayoutComMenu) */}
        <Route path="/" element={<RotaProtegida><LayoutComMenu><Dashboard /></LayoutComMenu></RotaProtegida>} />
        <Route path="/recepcao" element={<RotaProtegida><LayoutComMenu><Recepcao /></LayoutComMenu></RotaProtegida>} />
        <Route path="/medico" element={<RotaProtegida><LayoutComMenu><Medico /></LayoutComMenu></RotaProtegida>} />
        <Route path="/admin" element={<RotaProtegida><LayoutComMenu><Admin /></LayoutComMenu></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;