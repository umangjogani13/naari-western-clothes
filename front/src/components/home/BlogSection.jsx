import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogPosts } from '../../store/slices/blogSlice';

function BlogSection() {
  const dispatch = useDispatch();
  const { items: articles = [], loading } = useSelector((state) => state.blog || {});

  useEffect(() => {
    dispatch(fetchBlogPosts({ featured: true, limit: 3 }));
  }, [dispatch]);

  // Display only when blog data is available from the backend; otherwise do not display
  if (loading || !articles || articles.length === 0) {
    return null;
  }

  const gridColsClass = 
    articles.length === 1 
      ? 'grid-cols-1 max-w-xl mx-auto' 
      : articles.length === 2 
        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
        : 'grid-cols-1 md:grid-cols-3';

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.25em] text-[#8C6239] block mb-1">
              Style Notes & Stories
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
              FROM THE BLOG
            </h2>
          </div>
          <Link 
            to="/admin/blog" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-[#8C6239] transition-colors border-b border-black hover:border-[#8C6239] pb-0.5"
          >
            MANAGE ARTICLES
          </Link>
        </div>

        {/* Blog card list */}
        <div className={`grid ${gridColsClass} gap-8`}>
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6239]">
                    {post.category || 'Fashion'}
                  </span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-light uppercase tracking-wider">
                    {post.date}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#8C6239] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="pt-2">
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-gray-950 group-hover:text-[#8C6239] uppercase tracking-widest transition-colors duration-200">
                    READ ARTICLE <span className="ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default BlogSection;
