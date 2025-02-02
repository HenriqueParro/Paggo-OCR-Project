
import Link from 'next/link';
import Image from 'next/image';
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <div style={containerStyle}>
      {/* Cabeçalho com logo e saudação */}
      <header style={headerStyle}>
        <Image src="/logo.png" alt="Logo Paggo" width={200} height={70} />
        <h1 style={titleStyle}>Bem-vindo ao Paggo</h1>
        <p style={subtitleStyle}>Gerencie suas faturas de forma simples e prática.</p>
      </header>

      {/* Card de upload com botões dentro */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Faça o upload de uma fatura</h2>
        <UploadForm />

        {/* Seção de botões */}
        <div style={buttonWrapperStyle}>
          <Link href="/documents" passHref>
            <button style={buttonStyle}>Ver Documentos Enviados</button>
          </Link>

          <Link href="/login" passHref>
            <button style={darkButtonStyle}>Fazer Login</button>
          </Link>

          <Link href="/register" passHref>
            <button style={darkButtonStyle}>Registrar-se</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 🎨 Estilos personalizados
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#333',
};

const subtitleStyle = {
  fontSize: '18px',
  color: '#666',
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: '40px',
};

const cardTitleStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#0070f3',
};

const buttonWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  flexWrap: 'wrap', // Ajuste para telas menores
  marginTop: '20px',
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const darkButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#333',
  color: 'white',
};
