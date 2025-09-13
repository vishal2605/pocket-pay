import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`group relative mx-auto flex max-w-xs flex-col items-center rounded-xl border border-gray-200 bg-gray-100 p-6 text-center shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-slate-100 hover:shadow-md ${className}`}
    >
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-500 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-600">
        <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
        {title}
      </h3>
      <p className="text-md text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
        {description}
      </p>
    </div>
  );
}