
//
import { twMerge } from "tailwind-merge";
//props
interface Props {
  title: string | undefined;
  label: string;
  className: string;
}

const InfoKey = ({ title, label, className }: Props) => {
    
  return (
    <div className={twMerge(`w-auto p-2`, className)}>
      <h1 className=" text-gray-800 text-xs font-thin">{label}</h1>
      <h1 className="font-medium text-sm">{title}</h1>
    </div>
  );
};

export default InfoKey;
