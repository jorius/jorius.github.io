// packages
import { FiArrowUpRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// components
import Badge from '../common/Badge';
import Button from '../common/Button';

// data
import blogPosts from '../../data/blog-posts.json';

const BlogSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white px-16 py-24">
      <div className="max-w-[1298px] mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-space-mono font-bold text-[64px] text-portfolio-dark-700 leading-normal tracking-[-0.96px] max-w-[827px]">
            {t('blog.title', 'From my blog post')}
          </h2>

          <Button variant="primary" size="md">
            {t('blog.seeAll', 'See All')}
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-3 gap-11">
          {blogPosts.map((post) => (
            <article key={post.id} className="flex flex-col gap-9">
              {/* Blog Image */}
              <div className="relative group">
                <div className="h-[432px] rounded-[35px] overflow-hidden shadow-[0px_4px_55px_0px_rgba(0,0,0,0.05)]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Arrow Button */}
                <button className="absolute bottom-7 right-5 bg-portfolio-dark-900 p-6 rounded-full rotate-90 group-hover:bg-principal transition-all duration-300">
                  <FiArrowUpRight className="w-12 h-12 text-white" />
                </button>
              </div>

              {/* Blog Content */}
              <div className="flex flex-col gap-9">
                {/* Category Badge */}
                <Badge>{post.category}</Badge>

                {/* Meta Info */}
                <div className="flex gap-9">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-portfolio-dark-700" />
                    <span className="font-inter text-xl text-portfolio-dark-700">
                      {post.author}
                    </span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-portfolio-dark-700" />
                    <span className="font-inter text-xl text-portfolio-dark-700">
                      {post.date}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-space-mono text-[32px] text-portfolio-dark-700 leading-normal max-w-[416px]">
                  {post.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
