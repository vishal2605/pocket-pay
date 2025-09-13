"use client";

import { ReactNode } from "react";

interface ButtonProps {
  label: String;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <div
  className="bg-blue-600 hover:bg-blue-950 text-white text-center p-2.5 rounded-xl font-medium text-lg"
>
  <button onClick={onClick} >{label}</button>
</div>
  );
};
