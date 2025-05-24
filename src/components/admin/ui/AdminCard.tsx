'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  action?: ReactNode;
}

export default function AdminCard({ children, title, className = '', action }: AdminCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {action && (
              <div>{action}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}