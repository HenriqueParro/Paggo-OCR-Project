
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage('Você precisa estar autenticado para ver os documentos. Redirecionando para login...');
        setTimeout(() => router.push('/login'), 10000);
        return;
      }

      try {
        const response = await axios.get('https://paggo-ocr-project-production.up.railway.app/upload/documents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: function (status) {
            return status < 500;
          },
        });

        if (response.status === 401) {
          setMessage('Sessão expirada ou você não está autenticado. Redirecionando para login...');
          setTimeout(() => router.push('/login'), 10000);
        } else {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        setMessage('Erro ao carregar documentos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  const handleDownload = async (documentId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`https://paggo-ocr-project-production.up.railway.app/upload/download/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${documentId}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o documento:', error);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`https://paggo-ocr-project-production.up.railway.app/upload/delete/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Documento deletado com sucesso.');
      // Atualiza a lista de documentos
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      alert('Não foi possível deletar o documento. Tente novamente.');
    }
  }; 

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={titleStyle}>Seus Documentos Enviados</h1>

      {message ? (
        <p style={message.includes('Redirecionando') ? errorStyle : successStyle}>{message}</p>
      ) : loading ? (
        <p>Carregando documentos...</p>
      ) : documents.length === 0 ? (
        <p>Nenhum documento enviado ainda.</p>
      ) : (
        <ul style={listStyle}>
          {documents.map((doc) => (
            <li key={doc.id} style={cardStyle}>
              <p><strong>Arquivo:</strong> {doc.fileName}</p>
              <p><strong>Status:</strong> {doc.status}</p>

              {/* Link para ver os detalhes do documento */}
              <Link href={`/document/${doc.id}`} passHref>
                <button style={buttonStyle}>Ver Detalhes</button>
              </Link>

              <br />

              {/* Botão de download usando Axios */}
              <button onClick={() => handleDownload(doc.id)} style={buttonStyleDownload}>
                Baixar Documento
              </button>

              <br />

              {/* Botão de deletar documento */}
              <button onClick={() => handleDelete(doc.id)} style={buttonStyleDelete}>
                Deletar Documento
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Botão de Voltar */}
      <div style={{ marginTop: '30px' }}>
        <Link href="/" passHref>
          <button style={buttonStyleBack}>Voltar para Página Inicial</button>
        </Link>
      </div>
    </div>
  );
}

// Estilos dos botões e elementos visuais
const titleStyle = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const cardStyle = {
  padding: '15px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '15px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  marginBottom: '5px',
};

const buttonStyleDownload = {
  ...buttonStyle,
  backgroundColor: '#333',
};

const buttonStyleBack = {
  ...buttonStyle,
  backgroundColor: '#0070f3',
  marginTop: '15px',
};

const buttonStyleDelete = {
  ...buttonStyle,
  backgroundColor: 'red',
};

const errorStyle = {
  color: 'red',
  fontSize: '16px',
};

const successStyle = {
  color: 'green',
  fontSize: '16px',
};

