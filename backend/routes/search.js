const express = require('express');
const router = express.Router();
const AmaSubstance = require('../models/AmaSubstance');
const MedicationAuthorized = require('../models/MedicationAuthorized');
const MedicationProhibited = require('../models/MedicationProhibited');

// Moteur 1 : Médicaments (Recherche dans les 2 collections)
router.get('/medications', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ authorized: [], prohibited: [] });

    const regex = new RegExp(q, 'i'); // Recherche insensible à la casse
    
    // Recherche en parallèle dans les deux collections
    const [authorized, prohibited] = await Promise.all([
      MedicationAuthorized.find({ $or: [{ Nom: regex }, { DCI: regex }] }).limit(50),
      MedicationProhibited.find({ $or: [{ Nom: regex }, { Dci: regex }] }).limit(50)
    ]);

    res.json({ authorized, prohibited });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Moteur 2 : Substances AMA
router.get('/ama', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');
    const substances = await AmaSubstance.find({ DCI: regex }).limit(50);
    
    res.json(substances);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;