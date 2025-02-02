// import { useState } from 'react';
// import axios from 'axios';

// const UploadForm = () => {
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setUploadStatus('Por favor, selecione uma imagem para enviar.');
//       return;
//     }

//     setIsLoading(true);
//     setUploadStatus('Enviando o arquivo...');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const token = localStorage.getItem('access_token');

//       if (!token) {
//         setUploadStatus('Você não está autenticado. Faça login primeiro.');
//         return;
//       }

//       await axios.post('http://localhost:3000/upload/image', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setUploadStatus('Upload realizado com sucesso!');
//     } catch (error) {
//       setUploadStatus('Erro ao fazer upload. Verifique o arquivo e tente novamente.');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
//       <h1>Upload de Fatura</h1>
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={isLoading} style={{ marginTop: '10px' }}>
//         {isLoading ? 'Enviando...' : 'Enviar Imagem'}
//       </button>
//       {uploadStatus && <p style={{ marginTop: '10px' }}>{uploadStatus}</p>}
//     </div>
//   );
// };

// export default UploadForm;


// import { useState } from 'react';
// import axios from 'axios';

// export default function UploadForm() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('access_token');
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post('http://localhost:3000/upload/image', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setMessage('Upload feito com sucesso!');
//     } catch (error) {
//       console.error('Erro ao enviar o arquivo:', error);
//       setMessage('Erro ao enviar o arquivo. Tente novamente.');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h2>Faça o upload de uma fatura</h2>
//       <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           style={{
//             padding: '10px',
//             marginBottom: '10px',
//             border: '1px solid #ccc',
//             borderRadius: '5px',
//           }}
//         />
//         <br />
//         <button type="submit">Enviar</button>
//       </form>
//       {message && <p style={{ color: '#0070f3', marginTop: '10px' }}>{message}</p>}
//     </div>
//   );
// }



///////////////////FUNCIONANDO
// import { useState } from 'react';
// import axios from 'axios';

// export default function UploadForm() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('access_token');
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post('http://localhost:3000/upload/image', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setMessage('Upload feito com sucesso!');
//     } catch (error) {
//       console.error('Erro ao enviar o arquivo:', error);
//       setMessage('Erro ao enviar o arquivo. Tente novamente.');
//     }
//   };

//   return (
//     <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
//       <input
//         type="file"
//         onChange={handleFileChange}
//         style={{
//           padding: '10px',
//           marginBottom: '10px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//         }}
//       />
//       <br />
//       <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//         Enviar
//       </button>
//       {message && <p style={{ color: '#0070f3', marginTop: '10px' }}>{message}</p>}
//     </form>
//   );
// }


/////////emBELEZAMENTO
// import { useState } from 'react';
// import axios from 'axios';

// export default function UploadForm() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setMessage(''); // Limpar a mensagem de erro ao selecionar um arquivo
//   };

//   const handleUpload = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       setMessage('Por favor, selecione um arquivo antes de enviar.');
//       return;
//     }

//     const token = localStorage.getItem('access_token');
//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       await axios.post('http://localhost:3000/upload/image', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setMessage('Arquivo enviado com sucesso!');
//       setSelectedFile(null); // Limpar o campo de upload após o envio
//     } catch (error) {
//       console.error('Erro ao fazer upload do arquivo:', error);
//       setMessage('Ocorreu um erro ao enviar o arquivo. Tente novamente.');
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleUpload}>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           style={{ marginBottom: '10px' }}
//         />
//         <br />
//         <button type="submit" style={buttonStyle}>
//           Enviar Fatura
//         </button>
//       </form>
//       {message && <p style={messageStyle}>{message}</p>}
//     </div>
//   );
// }

// // Estilos para o botão e a mensagem de feedback
// const buttonStyle = {
//   padding: '10px 20px',
//   backgroundColor: '#0070f3',
//   color: 'white',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   fontSize: '16px',
// };

// const messageStyle = {
//   marginTop: '10px',
//   color: 'red',
// };


import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage(''); // Limpar mensagem ao selecionar novo arquivo
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
      setTimeout(() => router.push('/login'), 10000); // Redirecionar após 10 segundos
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/upload/image', formData, {
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
