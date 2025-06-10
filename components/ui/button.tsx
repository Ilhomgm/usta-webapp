import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
