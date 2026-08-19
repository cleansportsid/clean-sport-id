const express = require('express');
const router = express.Router();
const AmaSubstance = require('../models/AmaSubstance');
const MedicationAuthorized = require('../models/MedicationAuthorized');
const MedicationProhibited = require('../models/MedicationProhibited');

// Fonction de nettoyage pour tolérer les accents et ignorer les casse sans casser les tirets
const getAccentInsensitiveRegex = (query) => {
  // On enlève les caractères spéciaux dangereux pour la regex tout en gardant les lettres et tirets
  const clean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const sanitized = clean
    .replace(/[éèêëÉÈÊË]/g, '[eéèêëÉÈÊË]')
    .replace(/[àâäÀÂÄ]/g, '[aàâäÀÂÄ]')
    .replace(/[ùûüÙÛÜ]/g, '[uùûüÙÛÜ]')
    .replace(/[îïÎÏ]/g, '[iîïÎÏ]')
    .replace(/[ôöÔÖ]/g, '[oôöÔÖ]')
    .replace(/[çÇ]/g, '[cçÇ]');
  
  return new RegExp(sanitized, 'i');
};

// Moteur 1 : Médicaments
router.get('/medications', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ authorized: [], prohibited: [] });

    const regex = getAccentInsensitiveRegex(q);
    
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

    const regex = getAccentInsensitiveRegex(q);
    const substances = await AmaSubstance.find({ DCI: regex }).limit(50);
    
    res.json(substances);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;