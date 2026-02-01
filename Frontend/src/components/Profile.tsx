import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Camera,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for profile data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    barNumber: '',
    expertise: [],
    role: '',
    yearsOfPractice: 0,
    casesWon: 0
  });

  // State for security tab
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const API_URL = "http://localhost:3000/api/users/profile";
  const token = localStorage.getItem("token");

  // 1. Fetch Profile Data on Load
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // 3. Save Personal/Professional Changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.patch(API_URL, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Update Password
  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      setIsSaving(true);
      await axios.patch(`${API_URL}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert("Failed to update password. Verify current password.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* PROFILE HEADER */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {profileData.firstName?.[0] || 'U'}{profileData.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border shadow flex items-center justify-center">
                <Camera className="h-3 w-3 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <p className="text-base font-semibold leading-tight">
                {profileData.firstName} {profileData.lastName}
              </p>
              <p className="text-sm text-gray-500">{profileData.email}</p>
              <div className="mt-1 flex gap-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {profileData.role}
                </Badge>
                {profileData.role !== 'client' && (
                  <Badge variant="outline" className="text-xs">
                    Bar ID: {profileData.barNumber || 'Not Set'}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className={`grid ${profileData.role === 'client' ? 'grid-cols-2' : 'grid-cols-3'} w-full`}>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          {profileData.role !== 'client' && <TabsTrigger value="professional">Professional</TabsTrigger>}
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* PERSONAL */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={e => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={e => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={e => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={profileData.address}
                    disabled={!isEditing}
                    onChange={e => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  rows={3}
                  disabled={!isEditing}
                  value={profileData.bio}
                  onChange={e => handleInputChange('bio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROFESSIONAL - Hidden for Clients */}
        {profileData.role !== 'client' && (
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Credentials & expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bar Registration Number</Label>
                  <Input
                    disabled={!isEditing}
                    value={profileData.barNumber}
                    onChange={e => handleInputChange('barNumber', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4 flex items-center gap-3">
                      <Calendar className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Years of Practice</p>
                        <p className="text-lg font-semibold">{profileData.yearsOfPractice}+</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 flex items-center gap-3">
                      <Shield className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Cases Won</p>
                        <p className="text-lg font-semibold">{profileData.casesWon}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* SECURITY */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Account protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="password" 
                placeholder="Current Password" 
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
              <Input 
                type="password" 
                placeholder="New Password" 
                value={passwordData.newPassword}
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <Input 
                type="password" 
                placeholder="Confirm Password" 
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
              <Button onClick={handlePasswordUpdate} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}