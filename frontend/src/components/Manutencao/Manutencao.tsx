import './Manutencao.css';

const Manutencao = () => {
  return (
    <div className="manutencao-container">
      <div className="manutencao-content">
        <div className="manutencao-icon">
          <i className="fas fa-tools"></i>
        </div>
        <h1 className="manutencao-title">Site em Manutenção</h1>
        <p className="manutencao-message">
          Estamos realizando algumas melhorias no sistema.
        </p>
        <p className="manutencao-submessage">
          Volte em breve. Obrigado pela compreensão!
        </p>
        <div className="manutencao-animation">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default Manutencao;
