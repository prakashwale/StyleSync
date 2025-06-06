import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import type { DropTargetMonitor } from 'react-dnd';

interface Props {
  children: React.ReactNode;
  onDrop: (item: any, position: { x: number; y: number }) => void;
}

const DropZone: React.FC<Props> = ({ children, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: (item: any, monitor: DropTargetMonitor) => {
      const offset = monitor.getClientOffset();
      if (offset && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const position = {
          x: offset.x - rect.left,
          y: offset.y - rect.top,
        };
        onDrop(item, position);
      }
    },
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className="relative w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </div>
  );
};

export default DropZone; 