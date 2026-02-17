import { CadastroConsultoria } from '../components/CadastroConsultoria';
import { CadastroEmpresa } from '../components/CadastroEmpresa';
import { CadastroKit } from '../components/CadastroKit';
import { CadastroPaciente } from '../components/CadastroPaciente';
import { ListaEmpresas } from '../components/ListaEmpresas';

export function Admin() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Administração do Sistema</h2>
      <p>Cadastros base e configurações.</p>
      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'grid', gap: '30px' }}>
        <CadastroConsultoria />
        <CadastroEmpresa />
        <CadastroKit />
        <CadastroPaciente />
        <ListaEmpresas />
      </div>
    </div>
  );
}