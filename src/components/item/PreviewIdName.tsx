import React, { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";

interface PreviewIdNameProps {
  onPositionChange?: (position: { x: number; y: number }) => void;
  initialPosition?: { x: number; y: number };
}

const PreviewIdName = ({
  onPositionChange,
  initialPosition,
}: PreviewIdNameProps) => {
  const { setNodeRef, transform, isDragging, listeners, attributes } =
    useDraggable({
      id: "fullname",
    });

  // Combine initial position with drag transform
  const currentTransform = transform || {
    x: initialPosition?.x || 0,
    y: initialPosition?.y || 0,
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${currentTransform.x}px, ${currentTransform.y}px, 0)`,
    position: isDragging ? "fixed" : "absolute",
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging
      ? "0 4px 20px rgba(0,0,0,0.15)"
      : "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "move",
    // Start from top-left corner (0,0) if no initial position
    top: 0,
    left: 0,
  };

  // Notify parent of position changes
  useEffect(() => {
    if (onPositionChange) {
      onPositionChange({ x: currentTransform.x, y: currentTransform.y });
    }
  }, [currentTransform.x, currentTransform.y, onPositionChange]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white px-3 py-1 rounded-md select-none"
    >
      <span className="font-medium text-lg">
        Member's Fullname: X: {initialPosition?.x} Y: {initialPosition?.y}
      </span>
    </div>
  );
};

export default PreviewIdName;
