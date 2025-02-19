import Modal from "./Modal";
import { useState } from "react";
import { handleLevel } from "../../utils/helper";
//
// import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
// import { Button } from "../ui/button";
interface Props {
  title: string;
  fullname: string;
  level?: number;
}

const HeaderInfo = ({ title, fullname, level }: Props) => {
  const [onOpen, setOnOpen] = useState(0);
  return (
    <div className="w-full p-2">
      <h1 className="text-lg font-medium cursor-pointer hover:underline">
        {fullname}
      </h1>
      <h1 className="text-sm font-light">{title}</h1>
      {/* <Popover>
        <PopoverTrigger disabled={level && level !== 2 ? true : false}>
          <>

          </>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs flex flex-col gap-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setOnOpen(2)}
          >
            Change
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setOnOpen(2)}
          >
            Vacant
          </Button>
        </PopoverContent>
      </Popover> */}

      <Modal
        title={`Change ${handleLevel(level as number)}`}
        footer={true}
        className="max-w-sm"
        children={<div className="w-full"></div>}
        open={onOpen === 1}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default HeaderInfo;
