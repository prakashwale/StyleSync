import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

interface Item {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  layer: number;
}

interface Props {
  item: Item;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zoom: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Item>) => void;
  onLayerChange: (direction: 'up' | 'down') => void;
}

const DraggableItem: React.FC<Props> = ({
  item,
  position,
  size,
  zoom,
  isSelected,
  onSelect,
  onUpdate,
  onLayerChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [currentSize, setCurrentSize] = useState(size);
  const [showControls, setShowControls] = useState(false);

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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing) {
      const dx = (e.clientX - resizeStart.x) / zoom;
      const dy = (e.clientY - resizeStart.y) / zoom;
      
      setCurrentSize(prev => ({
        width: Math.max(50, prev.width + dx),
        height: Math.max(50, prev.height + dy),
      }));
      
      setResizeStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    onUpdate({ size: currentSize });
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove as any);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove as any);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    onUpdate({ content: e.currentTarget.textContent || '' });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ color: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ fontSize: parseInt(e.target.value) });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ fontFamily: e.target.value });
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: currentSize.width,
        height: currentSize.height,
        opacity: isDragging ? 0.5 : 1,
        cursor: isResizing ? 'nwse-resize' : 'move',
        zIndex: item.layer,
      }}
      className="group"
      onClick={onSelect}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div 
        className={`w-full h-full bg-white rounded shadow-lg overflow-hidden ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {item.type === 'image' ? (
          <img
            src={item.content}
            alt="Mood board item"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleTextChange}
            style={{
              color: item.color,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily,
            }}
            className="w-full h-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item.content}
          </div>
        )}
      </div>

      {showControls && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-white rounded shadow-lg p-2 flex space-x-2">
          {item.type === 'text' && (
            <>
              <input
                type="color"
                value={item.color}
                onChange={handleColorChange}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <select
                value={item.fontSize}
                onChange={handleFontSizeChange}
                className="px-2 py-1 border rounded"
              >
                <option value="12">12px</option>
                <option value="16">16px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
                <option value="32">32px</option>
              </select>
              <select
                value={item.fontFamily}
                onChange={handleFontFamilyChange}
                className="px-2 py-1 border rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
              </select>
            </>
          )}
          <button
            onClick={() => onLayerChange('up')}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ↑
          </button>
          <button
            onClick={() => onLayerChange('down')}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ↓
          </button>
        </div>
      )}

      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-nwse-resize"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default DraggableItem; 