import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Twitter, Linkedin, Github, Instagram, Upload } from 'lucide-react';
import { profileService } from '../../services/profileService';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import toast from 'react-hot-toast';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: ''
    },
    privacy: {
      profileVisibility: 'public',
      emailVisible: false,
      activityVisible: true,
      connectionRequestsOpen: true
    }
  });

  // Load profile data on component mount
  useEffect(() => {
    const loadedProfile = profileService.loadProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
    }
  }, []);

  const handleSave = () => {
    try {
      profileService.saveProfile(profile);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to save profile changes');
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const togglePrivacySetting = (setting) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Profile</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <div className="flex items-center space-x-3">
              <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Basic Profile Settings */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Twitter size={16} className="text-blue-500" />
                    <span>Twitter</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.twitter}
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, twitter: e.target.value}})}
                  placeholder="https://twitter.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Linkedin size={16} className="text-blue-700" />
                    <span>LinkedIn</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.linkedin}
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, linkedin: e.target.value}})}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Github size={16} className="text-gray-800 dark:text-gray-200" />
                    <span>GitHub</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.github}
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, github: e.target.value}})}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Instagram size={16} className="text-pink-500" />
                    <span>Instagram</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.instagram}
                  onChange={(e) => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={profile.privacy.profileVisibility}
                  onChange={(e) => setProfile({...profile, privacy: {...profile.privacy, profileVisibility: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="members">Members Only - Logged in users can view</option>
                  <option value="connections">Connections Only - Only your connections can view</option>
                  <option value="private">Private - Only you can view</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Email Address</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow others to see your email address</p>
                  </div>
                  <button
                    onClick={() => togglePrivacySetting('emailVisible')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.privacy.emailVisible ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.privacy.emailVisible ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Activity</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Display your recent activity on your profile</p>
                  </div>
                  <button
                    onClick={() => togglePrivacySetting('activityVisible')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.privacy.activityVisible ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.privacy.activityVisible ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Connection Requests</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Let others send you connection requests</p>
                  </div>
                  <button
                    onClick={() => togglePrivacySetting('connectionRequestsOpen')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.privacy.connectionRequestsOpen ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.privacy.connectionRequestsOpen ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="card">
            <ChangePasswordForm isOwner={false} title="Change Password" />
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex items-center justify-center space-x-4 pt-6">
            <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2 px-8">
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center space-x-2 px-8">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
