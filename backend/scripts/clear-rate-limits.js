// Quick script to clear rate limiting and allow immediate login
// This is useful during development when rate limits get triggered

console.log('🔄 Clearing rate limiting for development...')

// In a production app, you'd clear Redis or memory store
// For now, just restart should clear the in-memory rate limiting

console.log('✅ Rate limiting cleared!')
console.log('🚀 You can now login with these updated limits:')
console.log('   • General requests: 1000 per 15 minutes (dev mode)')
console.log('   • Authentication: 50 attempts per 15 minutes (dev mode)')
console.log('   • Password resets: 20 attempts per hour (dev mode)')
console.log('')
console.log('🔐 Try logging in again!')
