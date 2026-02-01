import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, Mail, Lock, ShieldCheck, Loader2, Phone, 
  MapPin, Briefcase, Award, AlignLeft, Calendar, Trophy 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

export function AdminRegisterStaff() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'lawyer',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    barNumber: '',
    expertise: '',
    yearsOfPractice: 0,
    casesWon: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const token = localStorage.getItem("token");

    const submissionData = {
      ...formData,
      expertise: formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : [],
      yearsOfPractice: Number(formData.yearsOfPractice),
      casesWon: Number(formData.casesWon)
    };

    try {
      await axios.post("http://localhost:8080/api/auth/register", 
        submissionData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Account created successfully!");
      setFormData({ 
        username: '', email: '', password: '', role: 'lawyer',
        firstName: '', lastName: '', phone: '', address: '',
        bio: '', barNumber: '', expertise: '', 
        yearsOfPractice: 0, casesWon: 0 
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed. Verify Admin permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-md border-0 bg-white mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Register New Member
        </CardTitle>
        <p className="text-sm text-gray-500">Add staff or clients to the LexSync system.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegisterStaff} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* --- Section: Credentials --- */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700 border-b pb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Login Credentials
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="username" placeholder="jdoe_legal" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="email" type="email" placeholder="name@firm.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Assign Role</Label>
                <select 
                  id="role"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="lawyer">Lawyer (Firm Staff)</option>
                  <option value="client">Client (Limited Access)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>
            </div>

            {/* --- Section: Personal Info --- */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700 border-b pb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="City, State, Country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="pl-10" />
                </div>
              </div>

              {/* Bio is now conditional: only shows for lawyers/admins */}
              {formData.role !== 'client' && (
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Textarea placeholder="Short professional summary..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="pl-10 min-h-[80px]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- Section: Professional Info (Conditional for Lawyers/Admins) --- */}
          {(formData.role === 'lawyer' || formData.role === 'admin') && (
            <div className="space-y-6 pt-4 border-t">
              <h3 className="font-semibold text-blue-700 pb-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Professional Credentials
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Bar Registration Number</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="e.g. NY-123456" value={formData.barNumber} onChange={e => setFormData({...formData, barNumber: e.target.value})} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specializations (Comma separated)</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Corporate Law, Criminal Law" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Years of Practice</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="number" min="0" value={formData.yearsOfPractice} onChange={e => setFormData({...formData, yearsOfPractice: Number(e.target.value)})} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cases Won (%)</Label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="number" min="0" max="100" value={formData.casesWon} onChange={e => setFormData({...formData, casesWon: Number(e.target.value)})} className="pl-10" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing Account...</>
            ) : (
              "Create LexSync Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}