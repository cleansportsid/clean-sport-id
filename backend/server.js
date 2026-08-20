const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté avec succès à la base "medicaments" !'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

// Configuration de Nodemailer pour l'envoi d'e-mails
// Nouvelle configuration explicite
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Port sécurisé SSL de Gmail
  secure: true, // true pour le port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Ne rejette pas la connexion si le certificat serveur a un souci mineur (très utile sur les hébergeurs gratuits)
    rejectUnauthorized: false
  }
});

// Route pour l'envoi du message de contact / signalement
app.post('/api/contact', async (req, res) => {
  // Optionnel : affiche les données reçues dans le terminal pour débugger
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
    const mailOptions = {
      from: process.env.EMAIL_USER, // L'e-mail est envoyé depuis ton compte
      replyTo: email,               // Permet de répondre directement à l'expéditeur
      to: process.env.EMAIL_USER,   // Tu le reçois sur ton compte
      subject: `[Clean Sport ID] ${subject || "Nouveau message de contact"}`,
      text: emailText
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "E-mail envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail" });
  }
});

// Définition des routes de recherche
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));