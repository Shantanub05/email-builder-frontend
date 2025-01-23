'use client';

import React, { useRef } from 'react';
import Draggable from 'react-draggable';

interface DraggableElementProps {
  children: React.ReactNode;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ children }) => {
  // Here we assert that the ref will never be null when used.
  const nodeRef = useRef<HTMLDivElement>(null!);

  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef}>{children}</div>
    </Draggable>
  );
};

export default DraggableElement;
