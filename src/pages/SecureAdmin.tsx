
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
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Email being used:", credentials.email);
      console.log("Email length:", credentials.email.length);
      console.log("Email trimmed:", credentials.email.trim());
      console.log("Password length:", credentials.password.length);
      
      // Check if user exists first
      const { data: existingUsers, error: usersError } = await supabase
        .from('profiles')
        .select('email, is_admin')
        .eq('email', credentials.email.trim());
      
      console.log("User lookup result:", existingUsers);
      console.log("User lookup error:", usersError);
      
      if (!existingUsers || existingUsers.length === 0) {
        throw new Error('No user found with this email address. Please check your email or sign up first.');
      }
      
      const userProfile = existingUsers[0];
      console.log("Found user profile:", userProfile);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        console.error("Error code:", error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('The email or password you entered is incorrect. Please check your credentials and try again.');
        }
        throw error;
      }

      console.log("Login successful, user ID:", data.user.id);
      console.log("User email from auth:", data.user.email);

      // Check admin status from the profile we already fetched
      if (!userProfile.is_admin) {
        console.log("User is not admin, signing out");
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      console.log("Admin access confirmed for:", userProfile.email);
      toast({
        title: "Success",
        description: "Welcome to the admin panel!",
      });
      navigate("/admin");
    } catch (error: any) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      
      toast({
        title: "Login Failed",
        description: error.message || "Unable to sign in. Please check your credentials.",
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
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>If you're having trouble logging in, check the browser console for detailed error information.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdmin;
