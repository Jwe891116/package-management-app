// main.ts
import express from 'express';
import bodyParser from 'body-parser';
import packageRoutes from './routes/packageRoutes';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api', packageRoutes as express.Router);  // This is correct usage

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});