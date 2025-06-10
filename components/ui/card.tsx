import React from "react";
import classNames from "classnames";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={classNames(
        "rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
