
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  published: boolean;
}

// Mock data for demonstration
export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Modern Web Development",
    content: `
      <p>Web development has evolved tremendously over the past few years. In this comprehensive guide, we'll explore the modern tools and techniques that are shaping the future of web development.</p>
      
      <h2>The Modern Stack</h2>
      <p>Today's web developers have access to powerful frameworks and tools that make building complex applications more manageable than ever before. React, with its component-based architecture, has revolutionized how we think about user interfaces.</p>
      
      <h2>Best Practices</h2>
      <p>When building modern web applications, it's crucial to follow established best practices. This includes writing clean, maintainable code, implementing proper error handling, and ensuring your applications are accessible to all users.</p>
      
      <p>The journey of web development is ongoing, and staying updated with the latest trends and technologies is essential for success in this field.</p>
    `,
    excerpt: "Explore the modern tools and techniques that are shaping the future of web development in this comprehensive guide.",
    author: "Alex Johnson",
    publishedAt: "2024-06-15T10:00:00Z",
    category: "Technology",
    tags: ["React", "JavaScript", "Web Development"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    published: true
  },
  {
    id: "2",
    title: "The Art of Clean Code",
    content: `
      <p>Writing clean, readable code is one of the most important skills a developer can master. Clean code not only makes your applications more maintainable but also makes collaboration with other developers much smoother.</p>
      
      <h2>Principles of Clean Code</h2>
      <p>Clean code follows several key principles: it should be readable, simple, and focused. Each function should do one thing well, and variable names should clearly express their purpose.</p>
      
      <h2>Code Organization</h2>
      <p>Proper code organization is crucial for maintaining large codebases. This includes logical file structure, consistent naming conventions, and proper separation of concerns.</p>
    `,
    excerpt: "Learn the essential principles of writing clean, maintainable code that will make you a better developer.",
    author: "Sarah Chen",
    publishedAt: "2024-06-12T14:30:00Z",
    category: "Programming",
    tags: ["Clean Code", "Best Practices", "Software Development"],
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    published: true
  },
  {
    id: "3",
    title: "Building Responsive User Interfaces",
    content: `
      <p>In today's multi-device world, creating responsive user interfaces is not just a nice-to-have feature—it's essential. Users expect seamless experiences across all their devices.</p>
      
      <h2>Mobile-First Approach</h2>
      <p>Starting with mobile design constraints forces you to prioritize the most important content and features. This approach often leads to cleaner, more focused designs.</p>
      
      <h2>Flexible Layouts</h2>
      <p>Modern CSS tools like Flexbox and Grid make it easier than ever to create flexible, responsive layouts that adapt to different screen sizes.</p>
    `,
    excerpt: "Master the art of creating responsive user interfaces that work beautifully on all devices.",
    author: "Mike Rodriguez",
    publishedAt: "2024-06-10T09:15:00Z",
    category: "Design",
    tags: ["UI/UX", "Responsive Design", "CSS"],
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    published: true
  }
];

// Simple in-memory store (in a real app, this would be connected to a database)
let posts = [...mockPosts];

export const blogStore = {
  getAllPosts: () => posts,
  getPublishedPosts: () => posts.filter(post => post.published),
  getPostById: (id: string) => posts.find(post => post.id === id),
  createPost: (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: Date.now().toString() };
    posts.unshift(newPost);
    return newPost;
  },
  updatePost: (id: string, updates: Partial<BlogPost>) => {
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      return posts[index];
    }
    return null;
  },
  deletePost: (id: string) => {
    posts = posts.filter(post => post.id !== id);
  }
};
