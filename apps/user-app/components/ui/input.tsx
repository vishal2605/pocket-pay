import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  className,
  ...rest
}) => {
  return (
    <div className="flex flex-col py-2 font-medium">
      {label && <label className="mb-1">{label}</label>}
      <input
        className={`h-10 rounded border-2 border-gray-100 p-2 ${className}`}
        {...rest}
      />
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
    </div>
  );
};

export default Input;