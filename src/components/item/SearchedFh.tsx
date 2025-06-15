import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TeamProps, VotersProps } from "../../interface/data";
import { handleLevel } from "../../utils/helper";
import { handleElements } from "../../utils/element";

interface Props {
  id: string;
  team: TeamProps;
  number: number;
  query: string;
}

const SearchedFh = ({ id, team, number, query }: Props) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        ...(team.teamLeader?.voter as VotersProps),
      },
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 1000 : "auto",
    position: isDragging ? "fixed" : "relative",
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging
      ? "0 4px 20px rgba(0,0,0,0.15)"
      : "0 1px 3px rgba(0,0,0,0.1)",
  };

  return (
    <div
      className="p-2 border border-gray-200 rounded bg-white mb-2"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <p className=" font-medium text-sm">{handleLevel(team.level)}</p>
        <div>
          {number}.{" "}
          {handleElements(query, team.teamLeader?.voter?.lastname as string)},{" "}
          {handleElements(query, team.teamLeader?.voter?.firstname as string)} -
          ({handleElements(query, team.teamLeader?.voter?.idNumber as string)})
        </div>

        {/* <p className=" text-sm">
          {team.teamLeader?.voter?.barangay.name},{" "}
          {team.teamLeader?.voter?.municipal.name}
        </p> */}
      </div>
    </div>
  );
};

export default SearchedFh;
