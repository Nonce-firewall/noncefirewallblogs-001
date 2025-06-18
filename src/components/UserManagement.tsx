
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { blogStore, BlogUser } from "@/lib/blogStore";
import { UserPlus, Trash2, Mail } from "lucide-react";

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<BlogUser[]>(blogStore.getAllUsers());
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = () => {
    if (!newUserEmail.trim() || !newUserName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if user already exists
    if (users.some(user => user.email === newUserEmail)) {
      toast({
        title: "Error",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return;
    }

    const newUser = blogStore.createUser({
      email: newUserEmail,
      displayName: newUserName,
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      isAdmin: false
    });

    setUsers(blogStore.getAllUsers());
    setNewUserEmail("");
    setNewUserName("");
    setIsAddingUser(false);

    toast({
      title: "Success",
      description: `User ${newUser.displayName} has been added successfully!`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.isAdmin) {
      toast({
        title: "Error",
        description: "Cannot delete admin users.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${user.displayName}?`)) {
      blogStore.deleteUser(userId);
      setUsers(blogStore.getAllUsers());
      
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Management</span>
          <Button
            onClick={() => setIsAddingUser(true)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add User Form */}
        {isAddingUser && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-4">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email Address</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Display Name</Label>
                <Input
                  id="userName"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Add User</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingUser(false);
                  setNewUserEmail("");
                  setNewUserName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h3 className="font-medium">Current Users</h3>
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={user.profilePicture} 
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{user.displayName}</h4>
                    {user.isAdmin && (
                      <Badge variant="default">Admin</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              
              {!user.isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
