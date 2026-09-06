import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { BLOG_POSTS as DEFAULT_BLOG_POSTS } from './homeData';

function BlogSection({ posts: initialPosts }) {
  const [articles, setArticles] = useState(initialPosts || DEFAULT_BLOG_POSTS);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axiosClient.get('/blog?featured=true&limit=3');
        if (res && res.success && Array.isArray(res.posts) && res.posts.length > 0) {
          setArticles(res.posts.slice(0, 3));
        }
      } catch (err) {
        console.warn('Blog API offline, using fallback articles.');
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
            FROM THE BLOG
          </h2>
          <Link 
            to="/blog" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
          >
            VIEW ALL
          </Link>
        </div>

        {/* Blog card list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((post, index) => (
            <div key={post._id || post.id || index} className="group flex flex-col space-y-4 cursor-pointer text-left">
              {/* Image */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-gray-50 rounded-sm">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Meta */}
              <div className="flex flex-col space-y-1.5 px-0.5">
                <span className="text-[10px] sm:text-xs text-gray-400 font-light uppercase tracking-wider">
                  {post.date}
                </span>
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <Link 
                  to={post.link || `/blog/${post.slug || post.id}`}
                  className="inline-flex items-center text-[10px] sm:text-xs font-bold text-gray-950 group-hover:text-rose-600 uppercase tracking-widest pt-2 transition-colors duration-200"
                >
                  READ MORE <span className="ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default BlogSection;
