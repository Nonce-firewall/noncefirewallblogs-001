
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings } from "lucide-react";

const BlogHeader = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TechBlog</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {!isAdminPath ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link 
                  to="/admin" 
                  className="inline-flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/create">
                  <Button size="sm">New Post</Button>
                </Link>
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  View Blog
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
