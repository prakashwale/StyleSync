import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

interface Item {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
}

interface Props {
  item: Item;
  position: { x: number; y: number };
}

const DraggableItem: React.FC<Props> = ({ item, position }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { ...item },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem: Item) => {
      if (draggedItem.id !== item.id) {
        // Handle hover logic if needed
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className="p-2 bg-white rounded shadow-lg"
    >
      {item.type === 'image' ? (
        <img
          src={item.content}
          alt="Mood board item"
          className="max-w-xs max-h-48 object-contain"
        />
      ) : (
        <div
          contentEditable
          suppressContentEditableWarning
          className="min-w-[100px] min-h-[50px] p-2 border border-gray-300 rounded"
        >
          {item.content}
        </div>
      )}
    </div>
  );
};

export default DraggableItem; 