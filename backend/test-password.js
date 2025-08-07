const bcrypt = require('bcryptjs');

const testPassword = 'Owner@M7R2024!';
console.log('Testing password:', testPassword);

// Generate a fresh hash every time and test it
bcrypt.hash(testPassword, 10).then(newHash => {
  console.log('Generated hash:', newHash);
  
  // Test the new hash immediately
  return bcrypt.compare(testPassword, newHash);
}).then(result => {
  console.log('Hash verification result:', result);
  
  if (result) {
    console.log('✅ Password hashing is working correctly');
  } else {
    console.log('❌ Password hashing failed');
  }
}).catch(err => {
  console.error('Error:', err);
});
