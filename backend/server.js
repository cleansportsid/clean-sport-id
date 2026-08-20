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

// Route pour l'envoi du message de contact via l'API Resend (sans Nodemailer)
app.post('/api/contact', async (req, res) => {
  console.log("Nouvelle requête de contact :", req.body);

  const { firstName, lastName, role, specialty, subject, email, message } = req.body;

  if (!message || !email) {
    return res.status(400).json({ error: "L'email et le message sont requis" });
  }

  // Préparation du corps de l'e-mail
  const emailText = `
Vous avez reçu un nouveau message via le formulaire Clean Sport ID.

Informations de l'expéditeur :
-----------------------------
Nom : ${lastName || 'Non renseigné'}
Prénom : ${firstName || 'Non renseigné'}
Profil : ${role || 'Non renseigné'}
${specialty ? `Spécialité / Sport : ${specialty}` : ''}
Email de contact : ${email}

Objet du message : ${subject || 'Non renseigné'}

Message :
-----------------------------
${message}
  `;

  try {
    // Utilisation de l'API HTTP de Resend pour contourner le blocage SMTP de Render
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Adresse spéciale de test fournie par Resend
        to: process.env.EMAIL_USER,    // Ton adresse supportcleansportsid@gmail.com
        reply_to: email,               // Permet de répondre directement à l'utilisateur
        subject: `[Clean Sport ID] ${subject || "Nouveau message de contact"}`,
        text: emailText
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API Resend :", errorData);
      return res.status(500).json({ error: "Erreur lors de l'envoi via l'API" });
    }

    res.status(200).json({ success: true, message: "E-mail envoyé avec succès" });
  } catch (error) {
    console.error("Erreur serveur globale :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi" });
  }
});

// Définition des routes de recherche
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));