import { LucideIcon } from "lucide-react";



interface PaymentOptionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
  }
export default function({icon:Icon, title, description}: PaymentOptionCardProps){
    return ( 
        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    )
}