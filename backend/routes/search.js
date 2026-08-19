const express = require('express');
const router = express.Router();
const AmaSubstance = require('../models/AmaSubstance');
const MedicationAuthorized = require('../models/MedicationAuthorized');
const MedicationProhibited = require('../models/MedicationProhibited');

// Fonction universelle pour neutraliser les accents (ex: "é" -> "e", "à" -> "a", etc.)
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Fonction de recherche flexible et tolérante aux accents
const getFlexibleRegex = (query) => {
  const clean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Transforme chaque voyelle pour qu'elle corresponde à sa version accentuée ou non
  const sanitized = clean
    .replace(/[eéèêëEÉÈÊË]/gi, '[eéèêëEÉÈÊË]')
    .replace(/[aàâäAÀÂÄ]/gi, '[aàâäAÀÂÄ]')
    .replace(/[uùûüUÙÛÜ]/gi, '[uùûüUÙÛÜ]')
    .replace(/[iîïIÎÏ]/gi, '[iîïIÎÏ]')
    .replace(/[oôöOÔÖ]/gi, '[oôöOÔÖ]')
    .replace(/[cCÇç]/gi, '[cCÇç]');
  
  return new RegExp(sanitized, 'i');
};

// Moteur 1 : Médicaments
router.get('/medications', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ authorized: [], prohibited: [] });

    const regex = getFlexibleRegex(q);
    
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

    const regex = getFlexibleRegex(q);
    const substances = await AmaSubstance.find({ DCI: regex }).limit(50);
    
    res.json(substances);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;