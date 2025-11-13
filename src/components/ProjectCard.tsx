'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image: _image, // eslint-disable-line @typescript-eslint/no-unused-vars
  tags,
  link,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="card group cursor-pointer"
    >
      {/* Project Image */}
      <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg bg-primary">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          {/* Placeholder for project image */}
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <span className="text-accent/50 text-4xl">🎨</span>
          </div>
        </motion.div>
      </div>

      {/* Project Info */}
      <div>
        <h3 className="text-2xl font-display font-semibold mb-2 group-hover:text-accent-muted transition-colors">
          {title}
        </h3>
        <p className="text-body mb-4">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-primary rounded-full border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        {link && (
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 5 }}
            className="inline-flex items-center mt-4 text-accent hover:text-accent-muted transition-colors"
          >
            View Project
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;

