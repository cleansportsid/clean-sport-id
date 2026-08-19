const express = require('express');
const router = express.Router();
const AmaSubstance = require('../models/AmaSubstance');
const MedicationAuthorized = require('../models/MedicationAuthorized');
const MedicationProhibited = require('../models/MedicationProhibited');

// Fonction pour rendre la recherche souple, insensible aux accents et à la casse (partout dans le texte)
const getFlexibleRegex = (query) => {
  // On nettoie la requête pour éviter les erreurs de syntaxe regex
  const clean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const sanitized = clean
    .replace(/[éèêëÉÈÊË]/g, '[eéèêëÉÈÊË]')
    .replace(/[àâäÀÂÄ]/g, '[aàâäÀÂÄ]')
    .replace(/[ùûüÙÛÜ]/g, '[uùûüÙÛÜ]')
    .replace(/[îïÎÏ]/g, '[iîïÎÏ]')
    .replace(/[ôöÔÖ]/g, '[oôöÔÖ]')
    .replace(/[çÇ]/g, '[cçÇ]');
  
  // On ne met PAS de "^" au début pour permettre de chercher au milieu ou au début d'un mot (ex: "andro" trouve "1-androstenediol")
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