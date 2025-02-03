

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo antes de enviar.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Você precisa estar autenticado para fazer o upload. Redirecionando para login...');
      setTimeout(() => router.push('/login'), 10000);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://paggo-ocr-project-production.up.railway.app/upload/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: function (status) {
          return status < 500;
        },
      });

      if (response.status === 401) {
        setMessage('Sessão expirada ou você não está autenticado. Redirecionando para login...');
        setTimeout(() => router.push('/login'), 10000);
      } else if (response.status === 400) {
        setMessage('Erro: Nenhum arquivo enviado ou arquivo inválido.');
      } else if (response.status === 500) {
        setMessage('Erro no servidor. Tente novamente mais tarde.');
      } else if (response.status >= 200 && response.status < 300) {
        setMessage('Arquivo enviado com sucesso!');
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      setMessage('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        <br />
        <button type="submit" style={buttonStyle}>
          Enviar Fatura
        </button>
      </form>
      {message && <p style={message.includes('sucesso') ? successStyle : errorStyle}>{message}</p>}
    </div>
  );
}

// Estilos personalizados
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const errorStyle = {
  marginTop: '10px',
  color: 'red',
};

const successStyle = {
  marginTop: '10px',
  color: 'green',
};
