'use client';

import React, { useRef } from 'react';
import Draggable from 'react-draggable';

interface DraggableElementProps {
  children: React.ReactNode;
  onPositionChange: (pos: { x: number; y: number }) => void;
  position?: { x: number; y: number };
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  children,
  onPositionChange,
  position = { x: 0, y: 0 }
}) => {
  const nodeRef = useRef<HTMLDivElement>(null!);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={(e, data) => onPositionChange({ x: data.x, y: data.y })}
      onStop={(e, data) => onPositionChange({ x: data.x, y: data.y })}
    >
      <div ref={nodeRef} className="absolute">
        {children}
      </div>
    </Draggable>
  );
};

export default DraggableElement;