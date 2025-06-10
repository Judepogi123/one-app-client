import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { TemplateId, VotersProps } from "../interface/data";
import SelectedID from "../components/item/SelectedID";
import { Button } from "../components/ui/button";
import { cmToPx } from "../utils/helper";

import { VscClearAll } from "react-icons/vsc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
interface Props {
  selectedVoters: VotersProps[];
  selectedID: TemplateId | undefined;
  setSelectedVoters: React.Dispatch<React.SetStateAction<VotersProps[]>>;
}

const IdPreview = ({
  selectedVoters,
  selectedID,
  setSelectedVoters,
}: Props) => {
  const ITEMS_PER_PAGE = 4;

  // Auto-increment pages when adding voters
  const [pages, setPages] = useState<number[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const neededPages = Math.ceil(selectedVoters.length / ITEMS_PER_PAGE);
    setPages(Array.from({ length: neededPages }, (_, i) => i));
  }, [selectedVoters.length]);

  const { setNodeRef, isOver } = useDroppable({
    id: "droppable",
  });

  const handleRemoveId = (id: string) => {
    setSelectedVoters((prevVoters) =>
      prevVoters.filter((voter) => voter.id !== id)
    );
  };

  const handleRemoveAll = () => {
    setSelectedVoters([]);
  };

  return (
    <div className="w-full h-[90%] overflow-auto relative">
      <div className=" w-full p-2 flex gap-2 justify-between sticky top-0 z-10 bg-white items-center">
        <div>
          <p className=" font-medium text-sm">
            Selected: {selectedVoters.length ?? 0}
          </p>
        </div>
        <div className=" flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className=" flex gap-2"
            onClick={() => setShow(!show)}
          >
            {show ? <FaRegEyeSlash /> : <FaRegEye />}
            {show ? "Hide Label" : "Show Label"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className=" flex gap-2"
            onClick={() => handleRemoveAll()}
          >
            <VscClearAll />
            Clear all
          </Button>
        </div>
      </div>
      <div
        className="flex flex-col gap-4 p-4" // Vertical scroll
        // OR for horizontal scroll: className="flex gap-4 p-4 overflow-x-auto"
      >
        <p className=" text-center font-medium text-gray-500">
          Click the item you want to remove
        </p>
        {pages.map((page) => {
          const pageVoters = selectedVoters.slice(
            page * ITEMS_PER_PAGE,
            (page + 1) * ITEMS_PER_PAGE
          );

          return (
            <div
              key={page}
              ref={setNodeRef}
              className="m-auto rounded-lg p-4 transition-all relative grid grid-cols-2 gap-2"
              style={{
                width: cmToPx(21),
                height: cmToPx(29.7),
                border: isOver ? "2px dashed #4CAF50" : "2px dashed #e5e7eb",
                backgroundColor: isOver ? "rgba(76, 175, 80, 0.1)" : "#f9fafb",
              }}
            >
              {pageVoters.map((voter, index) => (
                <SelectedID
                  label={show}
                  handleRemoveId={handleRemoveId}
                  key={`${voter.id}-${page}-${index}`}
                  url={selectedID?.url as string}
                  voter={voter}
                />
              ))}

              {isOver &&
                page === pages.length - 1 &&
                pageVoters.length < ITEMS_PER_PAGE && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-green-500">Drop to add ID</p>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IdPreview;
