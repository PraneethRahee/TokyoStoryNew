import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Profile = () => {
  const { user, updateProfile, changePassword, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setIsEditing(false);
    }
    
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-300">Manage your account settings</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              Profile Information
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <Input
                  value={user.username}
                  disabled
                  className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              Change Password
              <Button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Current Password
                  </label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 ${
                      errors.currentPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="text-red-400 text-xs">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 ${
                      errors.newPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-red-400 text-xs">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Confirm New Password
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Account Statistics</CardTitle>
            <CardDescription className="text-gray-300">
              Your activity on Tokyo Story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {user.purchasedStories?.length || 0}
                </div>
                <div className="text-gray-300 text-sm">Purchased Stories</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="text-gray-300 text-sm">Member Since</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
