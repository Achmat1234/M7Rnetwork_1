const bcrypt = require('bcryptjs');

const testPassword = 'Owner@M7R2024!';
const storedHash = '$2a$10$M77AK04rO0o5Bw/wjyD11.auSabgaiUjzYuPjQ4tePnep55uVREIi';

console.log('Testing password:', testPassword);
console.log('Stored hash:', storedHash);

// Generate a new hash and test it
bcrypt.hash(testPassword, 10).then(newHash => {
  console.log('Newly generated hash:', newHash);
  
  // Test new hash
  return bcrypt.compare(testPassword, newHash);
}).then(newResult => {
  console.log('New hash verification:', newResult);
  
  // Test stored hash
  return bcrypt.compare(testPassword, storedHash);
}).then(storedResult => {
  console.log('Stored hash verification:', storedResult);
}).catch(err => {
  console.error('Error:', err);
});
