import { useNavigate,useParams } from "react-router-dom";

//interface
interface BarangayProps {
  name: string;
  id: string;
}

const Barangay = ({ name, id }: BarangayProps) => {
  const navigate = useNavigate();
  const {municipalID} = useParams()
  const zipCode = parseInt(municipalID as string, 10)
  return (
    <div
      className=" w-full p-4 border cursor-pointer"
      onClick={() =>
        navigate(`/area/${zipCode}/${id}`)
      }
    >
      <h1>{name}</h1>
    </div>
  );
};

export default Barangay;
