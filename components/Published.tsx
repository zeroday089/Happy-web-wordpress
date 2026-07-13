"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useArticles } from "@/hooks/useArticles";

export default function Published() {
  const { data: articles = [], isLoading, error } = useArticles();
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };
  if (!isLoading && !error && articles.length === 0) {
    return null;
  }

  // Duplicate articles for a seamless infinite loop
  const loopArticles = articles.length > 0 ? [...articles, ...articles] : [];

  return (
    <div className="bg-[#3f5c4a] py-12 px-1 xl:px-16 mt-10 max-w-[1920px] min-h-[550px] md:min-h-[600px] mx-auto overflow-hidden">
      {/* Heading */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-white space-y-4"
      >
        <h2 className="text-3xl xl:text-5xl font-medium">Published Articles</h2>
        <p className="text-lg xl:text-xl text-gray-200">
          Thought leadership articles published on Speaking Tree
        </p>
      </motion.div>

      {/* Cards - continuous sliding */}
      <div className="mt-10 overflow-hidden">
        {isLoading ? (
          <div className="flex gap-6 justify-center">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="w-[300px] flex-shrink-0 bg-white/80 rounded-3xl p-6 h-[160px] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-white/80 text-sm text-center">
            Articles are loading slowly right now. Please try again.
          </p>
        ) : (
          <div className="marquee-track flex gap-6 w-max">
            {loopArticles.map((article, idx) => (
              <motion.div
                key={`${article._id}-${idx}`}
                whileHover={{ scale: 1.02 }}
                className="w-[280px] md:w-[320px] flex-shrink-0 bg-white rounded-3xl p-6 flex gap-4 items-start"
              >
                {/* Logo */}
                <Image
                  src={article.articleLogo || "/22.png"}
                  alt={`${article.articleName} logo`}
                  width={80}
                  height={80}
                  className="w-10 h-10 md:w-20 md:h-20 rounded-md hidden md:block object-cover"
                />
                {/* Content */}
                <div className="flex flex-col space-y-2 text-[#544120]">
                  <div className="md:hidden flex gap-3">
                    <Image
                      src={article.articleLogo || "/22.png"}
                      alt={`${article.articleName} logo`}
                      width={80}
                      height={80}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <h3 className="font-semibold text-[10px] md:text-sm">{article.articleName}</h3>
                  </div>
                  <h3 className="font-semibold text-[10px] md:text-sm hidden md:block">
                    {article.articleName}
                  </h3>
                  <p className="text-[8px] md:text-[10px] leading-relaxed">{article.articleText}</p>
                  <span className="text-[8px] md:text-sm mt-5 md:mt-10 lg:mt-2">
                    <Link
                      className="cursor-pointer underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={article.articleLink}
                    >
                      Read on Speaking Tree
                    </Link>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}