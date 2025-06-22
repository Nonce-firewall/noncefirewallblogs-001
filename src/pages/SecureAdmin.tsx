
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";

const SecureAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting login with email:", credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful, user:", data.user);

      // Wait a moment for the profile to be loaded by the AuthContext
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is admin with retries
      let attempts = 0;
      let profile = null;
      
      while (attempts < 3 && !profile) {
        console.log(`Checking admin status, attempt ${attempts + 1}`);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, email')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          if (attempts === 2) throw new Error('Could not verify admin status. Please try again.');
        } else {
          profile = profileData;
          console.log("Profile found:", profile);
        }
        
        attempts++;
        if (!profile && attempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!profile || !profile.is_admin) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      console.log("Admin access confirmed");
      toast({
        title: "Success",
        description: "Welcome to the admin panel!",
      });
      navigate("/admin");
    } catch (error: any) {
      console.error("Full login error:", error);
      toast({
        title: "Error",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600">Secure login to Nonce Firewall Blogs admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your admin email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="h-4 w-4 mr-2" />
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdmin;
