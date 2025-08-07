// Emergency Owner Restoration Script
// Run this in the browser console if needed

console.log('🔧 Emergency Owner Restoration Script')

// Clear any corrupted auth data
localStorage.removeItem('token')
localStorage.removeItem('user')

console.log('✅ Cleared localStorage')
console.log('🔑 Please log in again to restore owner status')

// Alternative: If you have a valid token, you can manually set owner data
// Uncomment and modify the lines below with your actual token:

/*
const ownerData = {
  id: "6892709af88227357ca2318d",
  name: "Achmat Armien", 
  email: "mark7raw@gmail.com",
  role: "owner"
}

localStorage.setItem('user', JSON.stringify(ownerData))
localStorage.setItem('token', 'YOUR_JWT_TOKEN_HERE')
console.log('👑 Owner data manually restored!')
*/
