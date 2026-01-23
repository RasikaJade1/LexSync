import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Camera
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
  const [isEditing, setIsEditing] = React.useState(false);

  const [profileData, setProfileData] = React.useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@lexsync.com',
    phone: '+1 (555) 123-4567',
    address: '123 Legal Street, Law District, NY 10001',
    bio: 'Experienced attorney specializing in corporate law with over 10 years of practice.',
    barNumber: 'NY-12345678',
    specializations: ['Corporate Law', 'Contract Law', 'Mergers & Acquisitions']
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* PROFILE HEADER */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">

            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
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
              <p className="text-sm text-gray-500">
                {profileData.email}
              </p>

              <div className="mt-1 flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Attorney
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Bar ID: {profileData.barNumber}
                </Badge>
              </div>
            </div>

            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
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
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={e => handleInputChange('email', e.target.value)}
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

        {/* PROFESSIONAL */}
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

              <div className="flex flex-wrap gap-2">
                {profileData.specializations.map((spec, i) => (
                  <Badge key={i} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4 flex items-center gap-3">
                    <Calendar className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Years of Practice</p>
                      <p className="text-lg font-semibold">10+</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 flex items-center gap-3">
                    <Shield className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Cases Won</p>
                      <p className="text-lg font-semibold">95%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Account protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm Password" />
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Settings className="text-gray-600" />
              <p className="text-sm text-gray-600">Profile updated yesterday</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}