import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';

interface Item {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
}

const MoodBoard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleDrop = (item: Item, position: { x: number; y: number }) => {
    setItems(prevItems =>
      prevItems.map(i =>
        i.id === item.id ? { ...i, position } : i
      )
    );
  };

  const addItem = (type: 'image' | 'text') => {
    const newItem: Item = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Double click to edit' : 'https://via.placeholder.com/150',
      position: { x: 0, y: 0 }
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => addItem('image')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Add Image
          </button>
          <button
            onClick={() => addItem('text')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Add Text
          </button>
        </div>
        <DropZone onDrop={handleDrop}>
          {items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              position={item.position}
            />
          ))}
        </DropZone>
      </div>
    </DndProvider>
  );
};

export default MoodBoard; 