const mongoose = require('mongoose');

const prohibSchema = new mongoose.Schema({
  Nom: String,
  Dci: String,
  Dose: String,
  Voie: String,
  Forme: String,
  Status: String,
  Classification: String,
  Information_complementaire: String,
  Notes: String,
  "specification perticuliere": String
}, { collection: 'medications_prohibited' }); // IMPORTANT: Le nom de la collection dans MongoDB

module.exports = mongoose.model('MedicationProhibited', prohibSchema);