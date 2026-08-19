const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté avec succès à la base "medicaments" !'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

// Définition des routes
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));