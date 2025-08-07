import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ChangePasswordForm from '../../components/ChangePasswordForm'
import { toast } from 'react-hot-toast'
import { profileService } from '../../services/profileService'
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Link as LinkIcon,
  Crown,
  Star,
  Award,
  Users,
  ShoppingBag,
  MessageCircle,
  Settings,
  Edit3,
  Camera,
  Save,
  X,
  Heart,
  Share2,
  TrendingUp,
  Brain,
  Target,
  Zap,
  UserPlus,
  UserCheck,
  Eye,
  EyeOff,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Briefcase,
  GraduationCap,
  Building,
  Code,
  Palette,
  CheckCircle,
  Upload,
  FileText,
  BarChart3,
  Package,
  TrendingDown,
  Clock,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Badge,
  Layers
} from 'lucide-react'

const ProfilePage = () => {
  const { user, isOwner } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [profileCompletion, setProfileCompletion] = useState(85)
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  
  // File upload refs
  const coverPhotoRef = useRef(null)
  const profilePictureRef = useRef(null)
  const portfolioImageRef = useRef(null)
  
  const [originalProfile, setOriginalProfile] = useState(null)
  const [profile, setProfile] = useState({
    name: user?.name || 'New User',
    email: user?.email || '',
    bio: isOwner ? 'Entrepreneur, Fashion Designer & Platform Owner. Building the future of premium networking. 🚀' : 'Welcome to M7RNetworking! Complete your profile to connect with amazing people.',
    location: isOwner ? 'Cape Town, South Africa' : 'Add your location',
    website: isOwner ? 'https://mark7raw.com' : '',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    title: isOwner ? 'Platform Owner & Founder' : 'Premium Member',
    coverPhoto: null,
    profilePicture: null,
    socialLinks: {
      twitter: isOwner ? 'https://twitter.com/mark7raw' : '',
      linkedin: isOwner ? 'https://linkedin.com/in/mark7raw' : '',
      github: isOwner ? 'https://github.com/mark7raw' : '',
      instagram: isOwner ? 'https://instagram.com/mark7raw' : ''
    },
    privacy: {
      profileVisibility: 'public',
      emailVisible: false,
      activityVisible: true,
      connectionRequestsOpen: true
    },
    followers: isOwner ? 2847 : Math.floor(Math.random() * 50) + 1,
    following: isOwner ? 432 : Math.floor(Math.random() * 30) + 1,
    connections: isOwner ? 1247 : Math.floor(Math.random() * 20) + 1,
    isConnected: false,
    connectionStatus: 'none' // none, pending, connected
  })

  // Load saved profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load profile data
        const savedProfile = profileService.loadProfile()
        if (savedProfile) {
          setProfile(prevProfile => ({
            ...prevProfile,
            ...savedProfile,
            // Keep user-specific data from auth context
            name: user?.name || savedProfile.name,
            email: user?.email || savedProfile.email,
            title: isOwner ? 'Platform Owner & Founder' : savedProfile.title || 'Premium Member'
          }))
        }

        // Load saved images
        const savedCoverPhoto = profileService.loadProfileImage('cover')
        const savedProfilePicture = profileService.loadProfileImage('profile')
        
        if (savedCoverPhoto || savedProfilePicture) {
          setProfile(prevProfile => ({
            ...prevProfile,
            coverPhoto: savedCoverPhoto || prevProfile.coverPhoto,
            profilePicture: savedProfilePicture || prevProfile.profilePicture
          }))
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
        toast.error('Failed to load saved profile data')
      }
    }

    loadProfileData()
  }, [user, isOwner])

  // Initialize original profile after loading saved data
  useEffect(() => {
    if (profile && !originalProfile) {
      setOriginalProfile(JSON.parse(JSON.stringify(profile)))
    }
  }, [profile, originalProfile])

  // Track changes
  useEffect(() => {
    if (originalProfile) {
      const changed = JSON.stringify(profile) !== JSON.stringify(originalProfile)
      setHasChanges(changed)
    }
  }, [profile, originalProfile])

  const [experience, setExperience] = useState(() => {
    if (isOwner) {
      return [
        {
          company: 'M7RNetworking',
          position: 'Founder & CEO',
          period: 'Jan 2024 - Present',
          description: 'Building the next generation networking platform with AI integration and premium fashion marketplace.',
          current: true
        },
        {
          company: 'MaRk7Raw Fashion',
          position: 'Creative Director',
          period: 'Mar 2023 - Present',
          description: 'Premium fashion brand focusing on minimalist design and sustainable materials.',
          current: true
        },
        {
          company: 'TechStart Incubator',
          position: 'Mentor',
          period: 'Jun 2022 - Dec 2023',
          description: 'Mentored 20+ startups in technology and fashion industries.',
          current: false
        }
      ]
    } else {
      return [
        {
          company: 'Add your first job',
          position: 'Your Position',
          period: 'Start Date - End Date',
          description: 'Add your work experience to showcase your professional journey.',
          current: false
        }
      ]
    }
  })

  const [portfolio, setPortfolio] = useState(() => {
    if (isOwner) {
      return [
        {
          title: 'M7RNetworking Platform',
          type: 'Web Application',
          description: 'Full-stack networking platform with AI integration',
          image: '/api/placeholder/300/200',
          technologies: ['React', 'Node.js', 'MongoDB', 'AI/ML'],
          link: 'https://m7rnetworking.com'
        },
        {
          title: 'MaRk7Raw E-commerce',
          type: 'Fashion Store',
          description: 'Premium fashion e-commerce with YOCO payments',
          image: '/api/placeholder/300/200',
          technologies: ['React', 'Express', 'Stripe', 'TailwindCSS'],
          link: 'https://mark7raw.store'
        },
        {
          title: 'AI Content Generator',
          type: 'SaaS Tool',
          description: 'AI-powered content creation for businesses',
          image: '/api/placeholder/300/200',
          technologies: ['Python', 'OpenAI', 'FastAPI', 'Vue.js'],
          link: 'https://aicontent.mark7raw.com'
        }
      ]
    } else {
      return [
        {
          title: 'Add your first project',
          type: 'Project Type',
          description: 'Showcase your work by adding projects to your portfolio',
          image: '/api/placeholder/300/200',
          technologies: ['Add', 'Your', 'Skills'],
          link: 'https://example.com'
        }
      ]
    }
  })

  const [testimonials, setTestimonials] = useState(() => {
    if (isOwner) {
      return [
        {
          name: 'Sarah Johnson',
          role: 'Startup Founder',
          avatar: '/api/placeholder/50/50',
          rating: 5,
          text: 'Mark\'s mentorship was instrumental in scaling our platform. His insights into AI integration are unmatched.',
          date: '2 weeks ago'
        },
        {
          name: 'David Chen',
          role: 'Fashion Designer',
          avatar: '/api/placeholder/50/50',
          rating: 5,
          text: 'Working with Mark on fashion tech has been incredible. His vision for sustainable fashion is inspiring.',
          date: '1 month ago'
        },
        {
          name: 'Emma Wilson',
          role: 'Tech Entrepreneur',
          avatar: '/api/placeholder/50/50',
          rating: 5,
          text: 'Mark\'s platform networking approach revolutionized how we connect with investors and partners.',
          date: '2 months ago'
        }
      ]
    } else {
      return [
        {
          name: 'Welcome to M7RNetworking!',
          role: 'Platform',
          avatar: '/api/placeholder/50/50',
          rating: 5,
          text: 'Start building your network and collecting testimonials from your connections.',
          date: 'Just now'
        }
      ]
    }
  })

  const stats = [
    { label: 'Followers', value: profile.followers.toLocaleString(), icon: UserPlus, color: 'text-blue-600' },
    { label: 'Following', value: profile.following.toLocaleString(), icon: UserCheck, color: 'text-green-600' },
    { label: 'Connections', value: profile.connections.toLocaleString(), icon: Users, color: 'text-purple-600' },
    { label: 'Orders', value: isOwner ? '89' : '0', icon: ShoppingBag, color: 'text-orange-600' },
    { label: 'AI Tools Used', value: isOwner ? '24' : '0', icon: Brain, color: 'text-indigo-600' },
    { label: 'Posts', value: isOwner ? '156' : '0', icon: MessageCircle, color: 'text-pink-600' }
  ]

  const platformStats = [
    { label: 'Total Revenue', value: 'R 2.4M', icon: TrendingUp, change: '+24%', positive: true },
    { label: 'Products Sold', value: '1,247', icon: Package, change: '+12%', positive: true },
    { label: 'AI Interactions', value: '15.2K', icon: Brain, change: '+31%', positive: true },
    { label: 'Community Growth', value: '3,890', icon: Users, change: '+18%', positive: true }
  ]

  const achievements = isOwner ? [
    { title: 'Platform Founder', icon: '🏆', description: 'Created M7RNetworking', date: 'Jan 2024', rarity: 'legendary' },
    { title: 'Early Adopter', icon: '🚀', description: 'First 100 users', date: 'Feb 2024', rarity: 'rare' },
    { title: 'Networking Pro', icon: '🤝', description: '1000+ connections', date: 'Mar 2024', rarity: 'epic' },
    { title: 'AI Pioneer', icon: '🤖', description: 'Used 20+ AI tools', date: 'Apr 2024', rarity: 'rare' },
    { title: 'Fashion Forward', icon: '👕', description: 'MaRk7Raw collection owner', date: 'May 2024', rarity: 'common' },
    { title: 'Community Builder', icon: '🌟', description: 'Helped 500+ members', date: 'Jun 2024', rarity: 'epic' }
  ] : [
    { title: 'Welcome Aboard', icon: '🎉', description: 'Joined M7RNetworking', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), rarity: 'common' },
    { title: 'Profile Creator', icon: '📝', description: 'Created your profile', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), rarity: 'common' },
    { title: 'First Steps', icon: '👣', description: 'Started your journey', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), rarity: 'common' }
  ]

  const recentActivity = isOwner ? [
    { type: 'order', content: 'Purchased MaRk7Raw Signature Tee', time: '2 hours ago', icon: ShoppingBag },
    { type: 'network', content: 'Connected with 3 new entrepreneurs', time: '5 hours ago', icon: Users },
    { type: 'ai', content: 'Used AI Content Generator tool', time: '1 day ago', icon: Brain },
    { type: 'post', content: 'Shared networking tips in community', time: '2 days ago', icon: MessageCircle },
    { type: 'achievement', content: 'Unlocked "Networking Pro" achievement', time: '3 days ago', icon: Award }
  ] : [
    { type: 'network', content: 'Joined M7RNetworking platform', time: 'Just now', icon: Users },
    { type: 'achievement', content: 'Unlocked "Welcome Aboard" achievement', time: 'Just now', icon: Award },
    { type: 'profile', content: 'Created profile on M7RNetworking', time: 'Just now', icon: User }
  ]

  const skills = isOwner ? [
    { name: 'Entrepreneurship', level: 95 },
    { name: 'Fashion Design', level: 90 },
    { name: 'Digital Marketing', level: 85 },
    { name: 'Business Strategy', level: 92 },
    { name: 'AI & Technology', level: 88 },
    { name: 'Community Building', level: 94 }
  ] : [
    { name: 'Communication', level: Math.floor(Math.random() * 30) + 70 },
    { name: 'Problem Solving', level: Math.floor(Math.random() * 30) + 60 },
    { name: 'Teamwork', level: Math.floor(Math.random() * 30) + 65 },
    { name: 'Adaptability', level: Math.floor(Math.random() * 30) + 70 }
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'experience', name: 'Experience', icon: Building },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'activity', name: 'Activity', icon: TrendingUp },
    { id: 'testimonials', name: 'Reviews', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, ownerOnly: true }
  ]

  const calculateProfileCompletion = () => {
    let completed = 0
    const total = 10
    
    if (profile.name) completed++
    if (profile.bio) completed++
    if (profile.location) completed++
    if (profile.website) completed++
    if (profile.socialLinks.twitter) completed++
    if (profile.socialLinks.linkedin) completed++
    if (experience.length > 0) completed++
    if (portfolio.length > 0) completed++
    if (skills.length > 0) completed++
    if (testimonials.length > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  // File upload handlers
  const handleCoverPhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Cover photo must be less than 5MB')
        return
      }
      
      setIsUploading(true)
      try {
        const imageData = await profileService.saveProfileImage(file, 'cover')
        setProfile(prev => ({ ...prev, coverPhoto: imageData }))
        toast.success('Cover photo updated and saved!')
      } catch (error) {
        console.error('Error uploading cover photo:', error)
        toast.error('Failed to save cover photo')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Profile picture must be less than 2MB')
        return
      }
      
      setIsUploading(true)
      try {
        const imageData = await profileService.saveProfileImage(file, 'profile')
        setProfile(prev => ({ ...prev, profilePicture: imageData }))
        toast.success('Profile picture updated and saved!')
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        toast.error('Failed to save profile picture')
      } finally {
        setIsUploading(false)
      }
    }
  }

  // Social interactions
  const handleConnect = async () => {
    if (profile.connectionStatus === 'connected') {
      // Disconnect
      setProfile(prev => ({
        ...prev,
        connectionStatus: 'none',
        connections: prev.connections - 1
      }))
      toast.success('Connection removed')
    } else if (profile.connectionStatus === 'pending') {
      // Cancel request
      setProfile(prev => ({ ...prev, connectionStatus: 'none' }))
      toast.success('Connection request cancelled')
    } else {
      // Send connection request
      setProfile(prev => ({ ...prev, connectionStatus: 'pending' }))
      toast.success('Connection request sent!')
    }
  }

  const handleMessage = () => {
    navigate('/chat', { state: { recipient: profile.name } })
    toast.success(`Opening chat with ${profile.name}`)
  }

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.name} - M7RNetworking Profile`,
          text: profile.bio,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Profile link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share profile')
    }
  }

  const handleViewNetwork = () => {
    navigate('/network', { state: { userId: user?._id } })
  }

  // Follow functionality
  const handleFollow = async () => {
    try {
      const newFollowStatus = !isFollowing
      setIsFollowing(newFollowStatus)
      
      // Update follow status in localStorage
      profileService.toggleFollow(user?._id || 'current_user', newFollowStatus ? 'follow' : 'unfollow')
      
      // Update follower count
      setProfile(prev => ({
        ...prev,
        followers: newFollowStatus ? prev.followers + 1 : prev.followers - 1
      }))
      
      toast.success(newFollowStatus ? 'Now following!' : 'Unfollowed')
      
      // TODO: Send to backend API when ready
      // await followAPI.toggleFollow(user._id, newFollowStatus)
    } catch (error) {
      console.error('Error updating follow status:', error)
      toast.error('Failed to update follow status')
      // Revert on error
      setIsFollowing(!isFollowing)
    }
  }

  // Load follow status on mount
  useEffect(() => {
    if (user?._id) {
      const followStatus = profileService.getFollowStatus(user._id)
      setIsFollowing(followStatus)
    }
  }, [user?._id])

  // Profile management
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Validate social links
      const validateUrl = (url) => {
        if (!url) return true
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      }

      if (!validateUrl(profile.website)) {
        toast.error('Please enter a valid website URL')
        setIsSaving(false)
        return
      }

      if (!validateUrl(profile.socialLinks.twitter)) {
        toast.error('Please enter a valid Twitter URL')
        setIsSaving(false)
        return
      }

      if (!validateUrl(profile.socialLinks.linkedin)) {
        toast.error('Please enter a valid LinkedIn URL')
        setIsSaving(false)
        return
      }

      if (!validateUrl(profile.socialLinks.github)) {
        toast.error('Please enter a valid GitHub URL')
        setIsSaving(false)
        return
      }

      if (!validateUrl(profile.socialLinks.instagram)) {
        toast.error('Please enter a valid Instagram URL')
        setIsSaving(false)
        return
      }

      // Save to localStorage and future API
      const saveSuccess = profileService.saveProfile(profile)
      if (!saveSuccess) {
        throw new Error('Failed to save profile locally')
      }
      
      // Simulate API call (remove when real API is ready)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOriginalProfile(JSON.parse(JSON.stringify(profile)))
      setHasChanges(false)
      setIsEditing(false)
      
      // Update profile completion
      const completion = calculateProfileCompletion()
      setProfileCompletion(completion)
      
      toast.success('Profile saved successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setProfile(JSON.parse(JSON.stringify(originalProfile)))
        setHasChanges(false)
        setIsEditing(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  // Portfolio management
  const handleAddProject = () => {
    const newProject = {
      title: 'New Project',
      type: 'Web Application',
      description: 'Project description here',
      image: '/api/placeholder/300/200',
      technologies: ['React', 'Node.js'],
      link: 'https://example.com'
    }
    setPortfolio(prev => [...prev, newProject])
    toast.success('New project added!')
  }

  const handleAddExperience = () => {
    const newExperience = {
      company: 'New Company',
      position: 'Position Title',
      period: 'Start Date - End Date',
      description: 'Role description and achievements',
      current: false
    }
    setExperience(prev => [...prev, newExperience])
    toast.success('New experience added!')
  }

  // Get connection button text and style
  const getConnectionButtonProps = () => {
    switch (profile.connectionStatus) {
      case 'connected':
        return {
          text: 'Connected',
          icon: UserCheck,
          className: 'btn-success flex items-center space-x-2'
        }
      case 'pending':
        return {
          text: 'Pending',
          icon: Clock,
          className: 'btn-secondary flex items-center space-x-2'
        }
      default:
        return {
          text: 'Connect',
          icon: UserPlus,
          className: 'btn-secondary flex items-center space-x-2'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Photo Section */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        {profile.coverPhoto ? (
          <img 
            src={profile.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
            <div className="text-center text-white">
              <Crown size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-lg opacity-50">M7RNetworking Premium Profile</p>
            </div>
          </div>
        )}
        <input
          type="file"
          ref={coverPhotoRef}
          onChange={handleCoverPhotoUpload}
          accept="image/*"
          className="hidden"
        />
        <button 
          onClick={() => coverPhotoRef.current?.click()}
          disabled={isUploading}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Camera size={20} className="text-white" />
          )}
        </button>
        
        {/* Privacy Indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
          {profile.privacy.profileVisibility === 'public' ? (
            <Eye size={16} className="text-white" />
          ) : (
            <EyeOff size={16} className="text-white" />
          )}
          <span className="text-white text-sm capitalize">{profile.privacy.profileVisibility}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Profile Header */}
        <div className={`card mb-16 p-8 ${isOwner ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' : ''}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-12 md:space-y-0 md:space-x-16 pt-24 pb-12">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className={`w-40 h-40 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden ${
                isOwner 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Show first letter of user's name for all users
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <input
                type="file"
                ref={profilePictureRef}
                onChange={handleProfilePictureUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => profilePictureRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-3 right-3 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 dark:border-gray-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                ) : (
                  <Camera size={20} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
              {isOwner && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown size={24} className="text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
                <div className="mb-8 lg:mb-0">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <span>{profile.name}</span>
                    {isOwner && <Crown size={28} className="text-yellow-500" />}
                    <Badge size={24} className="text-blue-500" title="Verified Profile" />
                  </h1>
                  <p className={`text-xl font-medium mb-3 ${
                    isOwner ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {profile.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl text-lg leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
                  {(() => {
                    const connectionProps = getConnectionButtonProps()
                    const ConnectionIcon = connectionProps.icon
                    return (
                      <button 
                        onClick={handleConnect}
                        className={`${connectionProps.className} px-6 py-2`}
                      >
                        <ConnectionIcon size={18} />
                        <span>{connectionProps.text}</span>
                      </button>
                    )
                  })()}
                  <button 
                    onClick={handleMessage}
                    className="btn-secondary flex items-center space-x-2 px-6 py-2"
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </button>
                  <button 
                    onClick={handleFollow}
                    className={`${isFollowing ? 'btn-secondary' : 'btn-primary'} flex items-center space-x-2 px-6 py-2`}
                  >
                    <Heart size={18} className={isFollowing ? 'fill-current text-red-500' : ''} />
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="btn-primary flex items-center space-x-2 px-6 py-2"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4 mb-6">
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                    <Twitter size={16} />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors">
                    <Github size={16} />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                    <Instagram size={16} />
                  </a>
                )}
                <a href={profile.website} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                  <Globe size={16} />
                </a>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span>{profile.privacy.emailVisible ? profile.email : 'Email hidden'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon size={16} />
                  <span>{profile.website}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Icon size={20} className={stat.color} />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Profile Completion */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Profile Completion</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">{calculateProfileCompletion()}%</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculateProfileCompletion()}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Complete your profile to increase visibility and connections
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-12 overflow-x-auto py-2">
              {tabs.filter(tab => !tab.ownerOnly || isOwner).map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                    {tab.ownerOnly && <Crown size={12} className="text-yellow-500" />}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Skills */}
                <div className="card p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">Skills & Expertise</h3>
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {skill.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">Recent Activity</h3>
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.content}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio</h3>
                    <button 
                      onClick={handleAddProject}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Upload size={16} />
                      <span>Add Project</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolio.map((project, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                              {project.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                          >
                            <ExternalLink size={14} />
                            <span>View Project</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Professional Experience</h3>
                  <button 
                    onClick={handleAddExperience}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Briefcase size={16} />
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="flex space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                          {exp.current && (
                            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Reviews & Testimonials</h3>
                <div className="space-y-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-500 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">"{testimonial.text}"</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && isOwner && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {platformStats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <div className={`flex items-center mt-1 text-sm ${
                              stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              <span className="ml-1">{stat.change}</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Icon size={24} className="text-white" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Platform Analytics Overview</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">User Engagement</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Daily active users increased by 23% this month</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Revenue Growth</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Monthly recurring revenue up 31% from last quarter</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">AI Tool Usage</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">AI assistant interactions grew 45% this week</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Community Growth</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">New user registrations up 18% month over month</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white relative overflow-hidden`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-bold">{achievement.title}</h4>
                            <p className="text-sm opacity-90">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-xs opacity-75">{achievement.date}</div>
                      </div>
                      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Activity Feed</h3>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="flex items-start space-x-3">
                          <Icon size={20} className="text-blue-500 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.content}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Member Status */}
            <div className={`card ${isOwner ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'}`}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isOwner ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {isOwner ? (
                    <Crown size={24} className="text-white" />
                  ) : (
                    <Star size={24} className="text-white" />
                  )}
                </div>
                <h3 className={`font-semibold mb-2 ${isOwner ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {isOwner ? 'Platform Owner' : 'Premium Member'}
                </h3>
                <p className={`text-sm mb-4 ${isOwner ? 'text-yellow-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {isOwner ? 'Ultimate access to all features' : 'Access to premium features'}
                </p>
                <div className={`rounded-lg p-3 ${isOwner ? 'bg-white/20 backdrop-blur-sm' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                  <div className={`text-sm font-medium ${isOwner ? 'text-white' : 'text-blue-800 dark:text-blue-300'}`}>
                    Member since: {profile.joinDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleMessage}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle size={16} className="text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Send Message</span>
                </button>
                <button 
                  onClick={handleViewNetwork}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Users size={16} className="text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">View Network</span>
                </button>
                <button 
                  onClick={handleShareProfile}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Share2 size={16} className="text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Share Profile</span>
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
