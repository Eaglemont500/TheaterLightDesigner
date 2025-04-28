import { useEffect, useRef } from "react";
import { Group, Rect, Line, Text, Transformer } from "react-konva";
import { type Layer as LayerType } from "@shared/schema";

interface GridElementProps {
  element: LayerType["elements"][0];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updatedElement: LayerType["elements"][0]) => void;
  draggable: boolean;
}

// Custom component for rendering automatic lighting grid elements
export const GridElement = ({ element, isSelected, onSelect, onChange, draggable }: GridElementProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  
  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Get grid properties
  const direction = element.properties?.direction || "horizontal";
  const spacing = element.properties?.spacing || 24;
  const barColor = element.properties?.barColor || "#888888";
  const barWidth = element.properties?.barWidth || 2;
  
  // Calculate grid lines based on spacing
  const generateGridLines = () => {
    const width = element.width || 800;
    const height = element.height || 400;
    const lines = [];
    
    if (direction === "horizontal" || direction === "both") {
      // Horizontal bars
      const numBars = Math.floor(height / spacing) + 1;
      for (let i = 0; i < numBars; i++) {
        const y = i * spacing;
        if (y < height) {
          lines.push(
            <Line
              key={`h-${i}`}
              points={[0, y, width, y]}
              stroke={barColor}
              strokeWidth={barWidth}
            />
          );
        }
      }
    }
    
    if (direction === "vertical" || direction === "both") {
      // Vertical bars
      const numBars = Math.floor(width / spacing) + 1;
      for (let i = 0; i < numBars; i++) {
        const x = i * spacing;
        if (x < width) {
          lines.push(
            <Line
              key={`v-${i}`}
              points={[x, 0, x, height]}
              stroke={barColor}
              strokeWidth={barWidth}
            />
          );
        }
      }
    }
    
    return lines;
  };
  
  return (
    <>
      <Group
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable={draggable}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (shapeRef.current) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            
            // Reset scale and apply scaled width/height
            node.scaleX(1);
            node.scaleY(1);
            
            // Calculate new dimensions without enforcing minimum size
            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: newWidth,
              height: newHeight,
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Border outline for the grid */}
        <Rect
          width={element.width || 800}
          height={element.height || 400}
          stroke={barColor}
          strokeWidth={barWidth}
          fill="transparent"
        />
        
        {/* Grid lines */}
        {generateGridLines()}
        
        {/* Grid label */}
        <Text
          text={`LIGHTING GRID (${spacing}" ${direction === "both" ? "grid" : direction} spacing)`}
          fontSize={14}
          fill="#ffffff"
          width={element.width || 800}
          align="center"
          y={(element.height || 400) - 20}
          opacity={0.7}
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to a certain minimum
            if (newBox.width < 200 || newBox.height < 100) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Custom component for rendering custom-drawn lighting grid elements
export const CustomGridElement = ({ element, isSelected, onSelect, onChange, draggable }: GridElementProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  
  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Get custom grid lines from properties
  const customLines = element.properties?.lines || [];
  
  return (
    <>
      <Group
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable={draggable}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (shapeRef.current) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            
            // Reset scale and apply scaled width/height
            node.scaleX(1);
            node.scaleY(1);
            
            // Calculate new dimensions without enforcing minimum size
            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: newWidth,
              height: newHeight,
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Border outline for the grid */}
        <Rect
          width={element.width || 800}
          height={element.height || 400}
          stroke="#888888"
          strokeWidth={2}
          fill="transparent"
        />
        
        {/* Custom-drawn grid lines */}
        {customLines.map((line: any) => (
          <Line
            key={line.id}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.width}
            tension={0}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        
        {/* Grid label */}
        <Text
          text="CUSTOM LIGHTING GRID"
          fontSize={14}
          fill="#ffffff"
          width={element.width || 800}
          align="center"
          y={(element.height || 400) - 20}
          opacity={0.7}
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to a certain minimum
            if (newBox.width < 200 || newBox.height < 100) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};