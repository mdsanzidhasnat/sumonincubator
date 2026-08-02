import bcrypt from 'bcryptjs';

const password = process.argv[3];
if (!password) {
  console.error('Usage: npm run hash-password -- <password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});