import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';

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

const CARD_WIDTH = 600;
const CARD_HEIGHT = 900;

const TEMPLATES: Array<{
  type: 'image' | 'text';
  content: string;
  size: { width: number; height: number };
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}> = [
  {
    type: 'text',
    content: 'Inspiration',
    size: { width: 200, height: 100 },
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Arial',
  },
  {
    type: 'text',
    content: 'Mood Board',
    size: { width: 200, height: 100 },
    color: '#4A90E2',
    fontSize: 32,
    fontFamily: 'Helvetica',
  },
  {
    type: 'image',
    content: 'https://images.unsplash.com/photo-1493612276216-ee3925520721',
    size: { width: 300, height: 200 },
  },
];

const MoodBoard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only allow items to be dropped within the card area
  const handleDrop = (item: Item, position: { x: number; y: number }) => {
    const snappedPosition = {
      x: Math.max(0, Math.min(Math.round(position.x / 20) * 20, CARD_WIDTH - (item.size?.width || 100))),
      y: Math.max(0, Math.min(Math.round(position.y / 20) * 20, CARD_HEIGHT - (item.size?.height || 100))),
    };
    setItems(prevItems =>
      prevItems.map(i =>
        i.id === item.id ? { ...i, position: snappedPosition } : i
      )
    );
  };

  const addItem = (type: 'image' | 'text', template?: any) => {
    const newItem: Item = {
      id: Date.now().toString(),
      type,
      content: template?.content || (type === 'text' ? 'Double click to edit' : ''),
      position: { x: 50, y: 50 },
      size: template?.size || { width: type === 'text' ? 200 : 150, height: type === 'text' ? 100 : 150 },
      color: template?.color || '#000000',
      fontSize: template?.fontSize || 16,
      fontFamily: template?.fontFamily || 'Arial',
      layer: items.length,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addItem('image', {
            content: event.target.result,
            size: { width: 300, height: 200 },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const data = JSON.stringify(items);
    localStorage.setItem('moodboard', data);
    alert('Moodboard saved!');
  };

  const handleLoad = () => {
    const data = localStorage.getItem('moodboard');
    if (data) {
      setItems(JSON.parse(data));
    }
  };

  const handleItemSelect = (id: string) => {
    setSelectedItem(id);
  };

  const handleItemUpdate = (id: string, updates: Partial<Item>) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleLayerChange = (id: string, direction: 'up' | 'down') => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex === -1) return prevItems;
      const newItems = [...prevItems];
      const item = newItems[itemIndex];
      if (direction === 'up' && itemIndex < newItems.length - 1) {
        newItems[itemIndex] = newItems[itemIndex + 1];
        newItems[itemIndex + 1] = item;
      } else if (direction === 'down' && itemIndex > 0) {
        newItems[itemIndex] = newItems[itemIndex - 1];
        newItems[itemIndex - 1] = item;
      }
      return newItems.map((item, index) => ({ ...item, layer: index }));
    });
  };

  // Delete selected item with Delete/Backspace
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItem) {
      setItems(prevItems => prevItems.filter(item => item.id !== selectedItem));
      setSelectedItem(null);
    }
  }, [selectedItem]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
          <div className="font-bold text-lg mb-2">Options</div>
          <button
            onClick={() => addItem('image')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Image
          </button>
          <button
            onClick={() => addItem('text')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Text
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Upload Image
          </button>
          <div className="font-semibold mt-4">Templates</div>
          <div className="flex flex-col space-y-2">
            {TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => addItem(template.type, template)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                {template.type === 'text' ? template.content : 'Image Template'}
              </button>
            ))}
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleLoad}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Load
            </button>
          </div>
        </div>
        {/* Centered Card Editor */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative shadow-2xl rounded-2xl bg-white flex items-center justify-center"
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          >
            <DropZone onDrop={handleDrop}>
              {items.map(item => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  position={item.position}
                  size={item.size}
                  zoom={1}
                  isSelected={selectedItem === item.id}
                  onSelect={() => handleItemSelect(item.id)}
                  onUpdate={(updates) => handleItemUpdate(item.id, updates)}
                  onLayerChange={(direction) => handleLayerChange(item.id, direction)}
                />
              ))}
            </DropZone>
            {/* Card border overlay for visual effect */}
            <div className="absolute inset-0 rounded-2xl border-4 border-gray-200 pointer-events-none" />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MoodBoard; 