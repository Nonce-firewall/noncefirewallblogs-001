
import { useState } from "react";
import BlogHeader from "@/components/BlogHeader";
import BlogPostCard from "@/components/BlogPostCard";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import ContactForm from "@/components/ContactForm";
import { blogStore } from "@/lib/blogStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const posts = blogStore.getPublishedPosts();
  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Nonce Firewall Blogs
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in">
            Stay secure with cybersecurity insights, tech news, and industry updates
          </p>
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      <FeaturedPostsCarousel posts={posts} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="animate-fade-in">
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-20 bg-white rounded-2xl shadow-sm border p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest cybersecurity insights and tech updates delivered straight to your inbox. 
            Join our community of security professionals and tech enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </section>
      </main>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default Index;
