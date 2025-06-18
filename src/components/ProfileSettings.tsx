
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { userStore } from "@/lib/userStore";
import { useToast } from "@/hooks/use-toast";
import { User, Upload } from "lucide-react";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(userStore.getCurrentUser());
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    userStore.updateUser(user);
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await userStore.uploadProfilePicture(file);
      setUser(prev => ({ ...prev, profilePicture: imageUrl }));
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture} alt={user.displayName} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="profile-picture" className="cursor-pointer">
              <Button 
                type="button" 
                variant="outline" 
                disabled={isUploading}
                className="cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Picture"}
                </span>
              </Button>
            </Label>
            <Input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureUpload}
            />
            <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={user.displayName}
            onChange={(e) => setUser(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Your display name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Your email address"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={user.bio}
            onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
