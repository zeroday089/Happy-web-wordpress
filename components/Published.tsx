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

  return (
    <div className="bg-[#3f5c4a] py-12 px-1 xl:px-16 mt-10 max-w-[1920px] min-h-[550px] md:min-h-[600px] mx-auto">
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

      {/* Cards */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex md:grid md:grid-cols-2 gap-6 mt-10 max-w-[1000px] mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory"
      >
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="w-[300px] md:w-auto flex-shrink-0 bg-white/80 rounded-3xl p-6 h-[160px] animate-pulse"
            />
          ))
        ) : error ? (
          <p className="text-white/80 text-sm col-span-2 text-center">
            Articles are loading slowly right now. Please try again.
          </p>
        ) : (
          articles.map((article) => (
            <motion.div
              key={article._id}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className="w-[300px] md:w-auto flex-shrink-0 snap-start bg-white rounded-3xl p-6 flex gap-4 items-start"
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
          ))
        )}
      </motion.div>
    </div>
  );
}
