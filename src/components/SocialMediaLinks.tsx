
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SocialMediaLinksProps {
  socialHandles: {
    twitter?: string;
    youtube?: string;
    facebook?: string;
    telegram?: string;
  };
}

const SocialMediaLinks = ({ socialHandles }: SocialMediaLinksProps) => {
  const socialPlatforms = [
    {
      name: "X (Twitter)",
      key: "twitter" as const,
      icon: "𝕏",
      baseUrl: "https://twitter.com/",
      color: "hover:bg-black hover:text-white"
    },
    {
      name: "YouTube",
      key: "youtube" as const,
      icon: "▶️",
      baseUrl: "https://youtube.com/@",
      color: "hover:bg-red-600 hover:text-white"
    },
    {
      name: "Facebook",
      key: "facebook" as const,
      icon: "📘",
      baseUrl: "https://facebook.com/",
      color: "hover:bg-blue-600 hover:text-white"
    },
    {
      name: "Telegram",
      key: "telegram" as const,
      icon: "📱",
      baseUrl: "https://t.me/",
      color: "hover:bg-blue-500 hover:text-white"
    }
  ];

  const activePlatforms = socialPlatforms.filter(platform => socialHandles[platform.key]);

  if (activePlatforms.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with the Author</h3>
      <div className="flex flex-wrap gap-3">
        {activePlatforms.map((platform) => (
          <Button
            key={platform.key}
            variant="outline"
            size="sm"
            className={`transition-all duration-200 ${platform.color}`}
            asChild
          >
            <a
              href={`${platform.baseUrl}${socialHandles[platform.key]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <span className="text-lg">{platform.icon}</span>
              <span>{platform.name}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
