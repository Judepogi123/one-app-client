//lib
import { useNavigate } from "react-router-dom";

//icon
import { FaMountainCity } from "react-icons/fa6";

//props
interface MunicipalProps {
  id: number;
  name: string;
  barangaysCount: number;
}

const Municipal = ({ id, name, barangaysCount }: MunicipalProps) => {
  const navigate = useNavigate();

  const handleAreaNavigate = (value: number) => {
    navigate(`/area/${value}`);
  };
  return (
    <div
      onClick={() => handleAreaNavigate(id)}
      className="w-full h-24 border border-gray-800 p-2 rounded-md cursor-pointer hover:border-[#353535] relative"    >
    
      <h1 className=" font-semibold text-lg">{name}</h1>
      <h2 className="font-mono text-sm">{id}</h2>
      <div className="w-full flex gap-2 absolute bottom-0 p-2">
        <div className="w-auto flex items-center gap-2">
          <FaMountainCity />
          <h2>{barangaysCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default Municipal;
