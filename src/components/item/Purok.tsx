
//props
interface PurokProps {
  zipCode: number;
  barangayID: string;
  purokNumber: string;
}

const Purok = ({ purokNumber }: PurokProps) => {
  return (
    <div className="w-full p-2">
      <h1>{purokNumber}</h1>
    </div>
  );
};

export default Purok;
