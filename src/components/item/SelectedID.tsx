//
import { cmToPx } from "../../utils/helper";
import Img from "../custom/Img";
//
import { VotersProps } from "../../interface/data";
import { MdOutlineQrCode2 } from "react-icons/md";
interface Props {
  url: string;
  voter: VotersProps;
  handleRemoveId: (id: string) => void;
  label: boolean;
}

const SelectedID = ({ url, voter, handleRemoveId, label }: Props) => {
  return (
    <div
      onClick={() => handleRemoveId(voter.id)}
      style={{
        width: cmToPx(8.62),
        height: cmToPx(10.48),
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Img
        className=" cursor-pointer"
        width={cmToPx(8.62)}
        height={cmToPx(10.48)}
        src={url}
        local={true}
        name={voter.lastname}
      />
      {label ? (
        <>
          {" "}
          <div
            style={{
              position: "absolute",
              top: "43%",
              left: "105%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "100%", // Ensures text stays centered if it wraps
            }}
          >
            <MdOutlineQrCode2 size={100} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "75%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "100%", // Ensures text stays centered if it wraps
            }}
          >
            <div
              style={{
                textAlign: "center",
                width: "100%", // Ensures text stays centered if it wraps
              }}
            >
              <span className="font-bold text-xl">
                {voter.lastname}, {voter.firstname}
              </span>
            </div>
            <div
              style={{
                textAlign: "center",
                width: "100%", // Ensures text stays centered if it wraps
              }}
            >
              <span className="font-medium text">{voter.barangay.name}</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SelectedID;
