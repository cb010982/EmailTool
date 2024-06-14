import { FC, ReactNode, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import React from "react";

interface IDraggable {
  id: string;
  children: ReactNode;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const Draggable: FC<IDraggable> = ({ id, children, onDuplicate, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = useMemo(() => {
    if (transform) {
      return {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      };
    }
    return undefined;
  }, [transform]);

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
      <button onClick={onDuplicate}>Duplicate</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default Draggable;
