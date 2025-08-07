import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'

// Components
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/dashboard/Dashboard'
import OwnerDashboard from './pages/dashboard/OwnerDashboard'
import StorePage from './pages/store/StorePage'
import MaRk7RawStore from './pages/store/MaRk7RawStore'
import ShoppingCart from './pages/store/ShoppingCart'
import Wishlist from './pages/store/Wishlist'
import YocoCheckout from './pages/store/YocoCheckout'
import ProductManagement from './pages/owner/ProductManagement'
import MarketplacePage from './pages/marketplace/MarketplacePage'
import ChatPage from './pages/chat/ChatPage'
import CommunityPage from './pages/community/CommunityPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProfileEdit from './pages/profile/ProfileEdit'
import ToolsPage from './pages/tools/ToolsPage'
import SecurityDashboard from './pages/SecurityDashboard'
import AIAssistant from './pages/AIAssistant'
import Analytics from './pages/Analytics'
import OwnerSetup from './components/OwnerSetup'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Context
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="pb-16 md:pb-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/store" element={<MaRk7RawStore />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                
                {/* Owner Setup Route */}
                <Route path="/owner-setup" element={<OwnerSetup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/owner-dashboard" element={
                  <ProtectedRoute ownerOnly>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/community" element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile/:username?" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <ProfileEdit />
                  </ProtectedRoute>
                } />
                
                <Route path="/tools" element={
                  <ProtectedRoute>
                    <ToolsPage />
                  </ProtectedRoute>
                } />

                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                } />

                <Route path="/security-dashboard" element={
                  <ProtectedRoute ownerOnly>
                    <SecurityDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/analytics" element={
                  <ProtectedRoute ownerOnly>
                    <Analytics />
                  </ProtectedRoute>
                } />

                <Route path="/product-management" element={
                  <ProtectedRoute ownerOnly>
                    <ProductManagement />
                  </ProtectedRoute>
                } />

                {/* Store Routes */}
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<YocoCheckout />} />
              </Routes>
            </main>
            
            {/* Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
