const mongoose = require('mongoose');

const amaSchema = new mongoose.Schema({
  DCI: String,
  Categorie: String,
  Notes: String,
  Status: String
}, { collection: 'ama_substances' }); // IMPORTANT: Le nom de la collection dans MongoDB

module.exports = mongoose.model('AmaSubstance', amaSchema);