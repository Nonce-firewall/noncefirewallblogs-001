
import { useParams, Link } from "react-router-dom";
import BlogHeader from "@/components/BlogHeader";
import { blogStore } from "@/lib/blogStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = id ? blogStore.getPostById(id) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>← Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors">
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">By {post.author}</p>
                <p className="text-sm text-gray-500">Published on {formatDate(post.publishedAt)}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
              <div className="text-sm text-gray-600">
                Found this helpful? Share it with your network!
              </div>
            </div>
            <Link to="/">
              <Button>Read More Articles</Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
