/* Enhanced Color Preview Component */

// React component for color preview with automatic background updates
import React, { useState } from 'react';
import './color-preview.css';

interface ColorPreviewProps {
  initialColor?: string;
  onColorChange?: (color: string) => void;
  className?: string;
  id?: string;
  label?: string;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({ 
  initialColor = '#ffffff', 
  onColorChange,
  className = 'color-preview',
  id = 'color-preview',
  label = 'Choose color'
}) => {
  const [currentColor, setCurrentColor] = useState(initialColor);

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    if (onColorChange) {
      onColorChange(newColor);
    }
  };

  return (
    <div 
      id={id}
      className={className}
      style={{ '--preview-color': currentColor } as React.CSSProperties}
    >
      <input
        type="color"
        value={currentColor}
        onChange={(e) => handleColorChange(e.target.value)}
        className="color-preview-input"
        aria-label={label}
        title={label}
      />
      <span className="color-preview-label">{currentColor}</span>
    </div>
  );
};

export default ColorPreview;