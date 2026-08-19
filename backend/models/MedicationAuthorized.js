const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  Nom: String,
  DCI: String,
  Dose: String,
  Forme: String,
  Status: String
}, { collection: 'medications_authorized' }); // IMPORTANT: Le nom de la collection dans MongoDB

module.exports = mongoose.model('MedicationAuthorized', authSchema);