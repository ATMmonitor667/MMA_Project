import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

console.log('Starting minimal test server...');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Test server is working!' });
});

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ success: true, message: 'API test successful' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port: ${PORT}`);
  console.log('Server started successfully!');
});

console.log('Server setup complete, starting listen...');
