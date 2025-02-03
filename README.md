
The Paggo OCR Project is a web-based application designed to streamline and automate the management of invoices and documents using Optical Character Recognition (OCR) and AI-powered interaction capabilities. Users can upload invoices, extract important information automatically, and interact with the extracted data through a conversational interface.

This solution is built to facilitate efficient document processing, enabling businesses to digitize their workflows and interact with critical financial data in a user-friendly and intuitive manner.

Key Features
User Authentication: Secure registration and login functionalities.
Invoice Upload: Upload invoices and documents through the web interface.
OCR Processing: Automatically extract relevant information from uploaded documents using Tesseract.js.
AI-Powered Interaction: Ask questions about the extracted content using the OpenAI API.
Document Management: Download, view details, and manage uploaded documents.
RESTful API: Backend provides a robust API for handling all operations.
Cloud-Ready Deployment: The application is deployed using modern cloud platforms, ensuring scalability and availability.

Technologies Used
Frontend
Framework: Next.js
UI/Styling: Tailwind CSS, CSS modules
HTTP Requests: Axios
Deployment: Vercel

Backend
Framework: NestJS (built on top of Node.js)
Database: PostgreSQL (with Prisma ORM for database management)
Authentication: JWT (JSON Web Tokens)
OCR Engine: Tesseract.js
AI Integration: OpenAI API

Deployment: Railway and Vercel

How It Works
Upload an Invoice: The user uploads a document through the frontend interface.
OCR Processing: The backend processes the document using Tesseract.js, extracting relevant text and metadata.
Data Storage: The extracted information is stored in a PostgreSQL database using Prisma ORM.
Interactive Queries: Users can ask questions about the document's content, and the OpenAI API responds based on the extracted information.
Management: Users can view, download, and manage their documents through the web application.
