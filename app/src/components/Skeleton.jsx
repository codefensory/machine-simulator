import React from 'react';
import cn from 'classnames';

export function Skeleton({ className, children, ...props }) {
  return (
    <>
      <style>
        {`
          .shimmer::before {
            animation: shine 1.5s infinite ease-out;
          }
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
      <div
        className={cn(
          'shimmer',
          'before:bg-gradient-to-r before:from-transparent before:via-white/50 dark:before:via-gray-100/10 before:to-transparent before:absolute before:inset-0',
          'relative isolate overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
