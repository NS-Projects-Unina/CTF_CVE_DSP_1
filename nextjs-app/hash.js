// crea-hash.js
const bcrypt = require('bcryptjs');
const password = process.argv[2];

if (!password) {
  console.error('Uso: node crea-hash.js <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10); // Costo 10, standard
console.log(hash);
