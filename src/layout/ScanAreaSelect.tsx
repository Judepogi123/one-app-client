//
import AreaSelection from "../components/custom/AreaSelection";

interface Props {
  handleChangeOption: (params: string, value: string) => void;
  currentMunicipal: string;
  currentBarangay: string;
  defaultValue: string;
}
const ScanAreaSelect = ({
  handleChangeOption,
  currentBarangay,
  currentMunicipal,
  defaultValue,
}: Props) => {
  return (
    <div className=" w-full p-2">
      <p className=" text-lg font-medium">Step 1</p>
      <p>Select target area</p>
      <AreaSelection
        handleChangeOption={handleChangeOption}
        currentMunicipal={currentMunicipal}
        currentBarangay={currentBarangay}
        currentPurok={""}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default ScanAreaSelect;
