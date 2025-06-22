// backend/server.js
const app = require('./app');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: 'http://localhost:5173', // port Vite
  credentials: true,               // jika kirim cookie/token via HTTPOnly
}));
