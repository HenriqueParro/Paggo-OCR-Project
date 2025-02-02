

// /////////////FUNCIONANDO

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import Link from 'next/link';

// export default function DocumentDetails() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [documentDetails, setDocumentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [question, setQuestion] = useState('');
//   const [interactions, setInteractions] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (id) {
//       const fetchDocumentDetails = async () => {
//         try {
//           const token = localStorage.getItem('access_token');
//           const response = await axios.get(`http://localhost:3000/upload/document/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           setDocumentDetails(response.data);
//           setInteractions(response.data.interactions);  // Carregar interações anteriores
//         } catch (error) {
//           console.error('Erro ao buscar detalhes do documento:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchDocumentDetails();
//     }
//   }, [id]);

//   const handleQuestionSubmit = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;

//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await axios.post(
//         'http://localhost:3000/llm/ask',
//         {
//           documentId: parseInt(id, 10),
//           question,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const newInteraction = {
//         question: question,
//         response: response.data.response,
//       };

//       setInteractions((prev) => [newInteraction, ...prev]);  // Adiciona a nova interação à lista
//       setQuestion('');
//     } catch (error) {
//       console.error('Erro ao interagir com o LLM:', error);
//       setMessage('Erro ao enviar a pergunta. Tente novamente.');
//     }
//   };

//   if (loading) {
//     return <p>Carregando detalhes do documento...</p>;
//   }

//   if (!documentDetails) {
//     return <p>Detalhes não encontrados.</p>;
//   }

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h1>Detalhes do Documento</h1>
//       <p><strong>Arquivo:</strong> {documentDetails.document.fileName}</p>
//       <p><strong>Texto Extraído:</strong></p>
//       <pre style={{ textAlign: 'left', margin: '0 auto', width: '60%', backgroundColor: '#f5f5f5', padding: '10px' }}>
//         {documentDetails.document.extractedText}
//       </pre>

//       <h2>Interaja com o documento</h2>
//       <form onSubmit={handleQuestionSubmit} style={{ marginTop: '20px' }}>
//         <input
//           type="text"
//           placeholder="Digite uma pergunta"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           style={{
//             padding: '10px',
//             width: '80%',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: '10px 20px',
//             marginLeft: '10px',
//             backgroundColor: '#0070f3',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Perguntar
//         </button>
//       </form>

//       {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

//       {interactions.length > 0 && (
//         <div style={{ marginTop: '30px', textAlign: 'left', marginLeft: '10%' }}>
//           <h3>Interações:</h3>
//           <ul style={{ listStyleType: 'none', padding: 0 }}>
//             {interactions.map((interaction, index) => (
//               <li key={index} style={{ marginBottom: '15px', backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px' }}>
//                 <p><strong>Pergunta:</strong> {interaction.question}</p>
//                 <p><strong>Resposta:</strong> {interaction.response}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div style={{ marginTop: '30px' }}>
//         <Link href="/documents" passHref>
//           <button
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#28a745',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             Voltar para Documentos
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function DocumentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [documentDetails, setDocumentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchDocumentDetails = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(`http://localhost:3000/upload/document/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setDocumentDetails(response.data);
          setInteractions(response.data.interactions);
        } catch (error) {
          console.error('Erro ao buscar detalhes do documento:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDocumentDetails();
    }
  }, [id]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:3000/llm/ask',
        {
          documentId: parseInt(id, 10),
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newInteraction = {
        question: question,
        response: response.data.response,
      };

      setInteractions((prev) => [newInteraction, ...prev]);
      setQuestion('');
    } catch (error) {
      console.error('Erro ao interagir com o LLM:', error);
      setMessage('Erro ao enviar a pergunta. Tente novamente.');
    }
  };

  if (loading) {
    return <p>Carregando detalhes do documento...</p>;
  }

  if (!documentDetails) {
    return <p>Detalhes não encontrados.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Cabeçalho com o botão de voltar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Detalhes do Documento</h1>
        <Link href="/documents" passHref>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Voltar para Documentos
          </button>
        </Link>
      </div>

      <p><strong>Arquivo:</strong> {documentDetails.document.fileName}</p>
      <p><strong>Texto Extraído:</strong></p>
      <pre style={{ textAlign: 'left', margin: '0 auto', width: '60%', backgroundColor: '#f5f5f5', padding: '10px' }}>
        {documentDetails.document.extractedText}
      </pre>

      <h2>Interaja com o documento</h2>
      <form onSubmit={handleQuestionSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Digite uma pergunta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            padding: '10px',
            width: '80%',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Perguntar
        </button>
      </form>

      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

      {interactions.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left', marginLeft: '10%' }}>
          <h3>Interações:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {interactions.map((interaction, index) => (
              <li key={index} style={{ marginBottom: '15px', backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px' }}>
                <p><strong>Pergunta:</strong> {interaction.question}</p>
                <p><strong>Resposta:</strong> {interaction.response}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
