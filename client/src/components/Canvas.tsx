import { useEffect, useRef, useState, useMemo, memo } from "react";
import { Stage, Layer, Group, Rect, Text, Transformer, Line, Circle } from "react-konva";
import { nanoid } from "nanoid";
import { type ProjectData, type Layer as LayerType } from "@shared/schema";
import { getEtcLightByAssetId } from "@/lib/etcLights";
import { getRoscoLuxGelByAssetId } from "@/lib/roscoLuxGels";
import { 
  ZoomInIcon, 
  ZoomOutIcon, 
  MaximizeIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasElementProps {
  element: LayerType["elements"][0];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updatedElement: LayerType["elements"][0]) => void;
  draggable: boolean;
}

// Custom component for rendering light elements
const LightElement = ({ element, isSelected, onSelect, onChange, draggable }: CanvasElementProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Get light details
  const lightDetails = getEtcLightByAssetId(element.assetId);
  
  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const lightColor = lightDetails?.color || "#ffa500";
  
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
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: Math.max(40, node.width() * scaleX),
              height: Math.max(60, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Light fixture base housing */}
        <Rect
          width={element.width || 40}
          height={(element.height || 60) * 0.6}
          fill="#444"
          cornerRadius={5}
          stroke="#555"
          strokeWidth={1}
        />
        
        {/* Light front housing (elliptical) */}
        <Circle
          radius={(element.width || 40) * 0.35}
          x={(element.width || 40) * 0.5}
          y={(element.height || 60) * 0.3}
          fill="#222"
          stroke="#666"
          strokeWidth={1.5}
        />
        
        {/* Lens */}
        <Circle
          radius={(element.width || 40) * 0.25}
          x={(element.width || 40) * 0.5}
          y={(element.height || 60) * 0.3}
          fill={lightColor}
          opacity={0.8}
        />
        
        {/* Light fixture top mounting bracket */}
        <Rect
          width={(element.width || 40) * 0.5}
          height={5}
          x={(element.width || 40) * 0.25}
          y={0}
          fill="#555"
          cornerRadius={2}
        />
        
        {/* C-clamp */}
        <Circle
          radius={5}
          x={(element.width || 40) * 0.5}
          y={-3}
          fill="#777"
          stroke="#555"
          strokeWidth={1}
        />
        
        {/* Light beam cone */}
        <Line
          points={[
            (element.width || 40) * 0.5, (element.height || 60) * 0.3,
            (element.width || 40) * 0.2, (element.height || 60),
            (element.width || 40) * 0.8, (element.height || 60),
            (element.width || 40) * 0.5, (element.height || 60) * 0.3
          ]}
          fill={lightColor}
          closed={true}
          opacity={0.2}
        />
        
        {/* Fixture knobs */}
        <Circle
          radius={3}
          x={(element.width || 40) * 0.15}
          y={(element.height || 60) * 0.5}
          fill="#777"
        />
        
        <Circle
          radius={3}
          x={(element.width || 40) * 0.85}
          y={(element.height || 60) * 0.5}
          fill="#777"
        />
        
        {/* Label */}
        <Text
          text={lightDetails?.name || "Light"}
          fontSize={11}
          fill="#fff"
          width={element.width || 40}
          align="center"
          y={(element.height || 60) + 5}
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to a certain minimum
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Custom component for rendering gel elements
const GelElement = ({ element, isSelected, onSelect, onChange, draggable }: CanvasElementProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Get gel details
  const gelDetails = getRoscoLuxGelByAssetId(element.assetId);
  
  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const gelColor = gelDetails?.color || "#ffffff";
  
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
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: Math.max(30, node.width() * scaleX),
              height: Math.max(30, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Gel frame representation */}
        <Rect
          width={element.width || 30}
          height={element.height || 30}
          fill="#333"
          cornerRadius={2}
          stroke="#555"
          strokeWidth={1}
        />
        
        {/* Gel color area */}
        <Rect
          width={(element.width || 30) - 6}
          height={(element.height || 30) - 6}
          x={3}
          y={3}
          fill={gelColor}
          opacity={0.85}
          cornerRadius={1}
        />
        
        {/* Gel frame highlights (top and left edges) */}
        <Line
          points={[0, 0, 0, element.height || 30, element.width || 30, element.height || 30]}
          stroke="#222"
          strokeWidth={1}
        />
        
        {/* Gel frame highlights (bottom and right edges) */}
        <Line
          points={[0, 0, element.width || 30, 0, element.width || 30, element.height || 30]}
          stroke="#666"
          strokeWidth={1}
        />
        
        {/* Gel number indicator */}
        <Text
          text={gelDetails?.number || ""}
          fontSize={10}
          fontStyle="bold"
          fill="#fff"
          width={element.width || 30}
          align="center"
          y={(element.height || 30) / 2 - 6}
        />
        
        {/* Label */}
        <Text
          text={gelDetails?.name || "Gel"}
          fontSize={10}
          fill="#fff"
          width={element.width || 30}
          align="center"
          y={(element.height || 30) + 5}
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to a certain minimum
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};


// Legacy Grid component definition - kept for reference but not used
const GridElement = ({ element, isSelected, onSelect, onChange, draggable }: CanvasElementProps) => {
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
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
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

// Legacy Custom Grid component definition - kept for reference but not used
const CustomGridElement = ({ element, isSelected, onSelect, onChange, draggable }: CanvasElementProps) => {
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
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
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

// Custom component for rendering stage outline elements
const StageOutlineElement = ({ element, isSelected, onSelect, onChange, draggable }: CanvasElementProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  
  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Get stage type from properties or default to proscenium
  const stageType = element.properties?.stageType || "proscenium";
  
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
            
            onChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
              rotation: node.rotation(),
            });
          }
        }}
      >
        {stageType === "proscenium" && (
          <>
            {/* Main stage outline */}
            <Rect
              width={element.width || 800}
              height={element.height || 400}
              stroke="#ffffff"
              strokeWidth={2}
              fill="rgba(30, 30, 30, 0.5)"
              cornerRadius={0}
            />
            
            {/* Front of stage line (apron) */}
            <Line
              points={[0, 0, element.width || 800, 0]}
              stroke="#ffffff"
              strokeWidth={3}
              dash={[10, 5]}
            />
            
            {/* Center line */}
            <Line
              points={[(element.width || 800) / 2, 0, (element.width || 800) / 2, element.height || 400]}
              stroke="#ffffff"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.5}
            />
            
            {/* Stage label */}
            <Text
              text="STAGE"
              fontSize={20}
              fill="#ffffff"
              width={element.width || 800}
              align="center"
              y={(element.height || 400) / 2 - 10}
              opacity={0.3}
            />
          </>
        )}
        
        {stageType === "thrust" && (
          <>
            {/* Thrust stage has audience on three sides */}
            <Rect
              width={element.width || 800}
              height={element.height || 400}
              stroke="#ffffff"
              strokeWidth={2}
              fill="rgba(30, 30, 30, 0.5)"
              cornerRadius={0}
            />
            
            {/* Audience area indicators */}
            <Line
              points={[0, 0, element.width || 800, 0]}
              stroke="#ffffff"
              strokeWidth={3}
              dash={[10, 5]}
            />
            
            <Line
              points={[0, 0, 0, element.height || 400]}
              stroke="#ffffff"
              strokeWidth={3}
              dash={[10, 5]}
            />
            
            <Line
              points={[element.width || 800, 0, element.width || 800, element.height || 400]}
              stroke="#ffffff"
              strokeWidth={3}
              dash={[10, 5]}
            />
            
            {/* Center line */}
            <Line
              points={[(element.width || 800) / 2, 0, (element.width || 800) / 2, element.height || 400]}
              stroke="#ffffff"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.5}
            />
            
            {/* Stage label */}
            <Text
              text="THRUST STAGE"
              fontSize={20}
              fill="#ffffff"
              width={element.width || 800}
              align="center"
              y={(element.height || 400) / 2 - 10}
              opacity={0.3}
            />
          </>
        )}
        
        {stageType === "arena" && (
          <>
            {/* Arena/in-the-round stage */}
            <Circle
              radius={(Math.min(element.width || 800, element.height || 400)) / 2}
              stroke="#ffffff"
              strokeWidth={2}
              fill="rgba(30, 30, 30, 0.5)"
            />
            
            {/* Cross lines */}
            <Line
              points={[0, (element.height || 400) / 2, element.width || 800, (element.height || 400) / 2]}
              stroke="#ffffff"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.5}
            />
            
            <Line
              points={[(element.width || 800) / 2, 0, (element.width || 800) / 2, element.height || 400]}
              stroke="#ffffff"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.5}
            />
            
            {/* Stage label */}
            <Text
              text="ARENA"
              fontSize={20}
              fill="#ffffff"
              width={element.width || 800}
              align="center"
              y={(element.height || 400) / 2 - 10}
              opacity={0.3}
            />
          </>
        )}
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

interface CanvasProps {
  projectData: ProjectData;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  activeTool: "move" | "rotate" | "zoom" | "hand";
  onUpdateLayers: (updatedLayers: LayerType[]) => void;
  onUpdateZoom: (zoom: number) => void;
}

export default function Canvas({
  projectData,
  selectedElementId,
  setSelectedElementId,
  activeTool,
  onUpdateLayers,
  onUpdateZoom
}: CanvasProps) {
  const stageRef = useRef<any>(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  
  const { gridSettings, layers, canvasWidth, canvasHeight, zoom } = projectData;

  // Handle selecting canvas elements
  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
  };

  // Handle updating an element
  const handleElementChange = (updatedElement: LayerType["elements"][0], layerId: string) => {
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex === -1) return;
    
    const elementIndex = layers[layerIndex].elements.findIndex(el => el.id === updatedElement.id);
    if (elementIndex === -1) return;
    
    const updatedLayers = [...layers];
    updatedLayers[layerIndex].elements[elementIndex] = updatedElement;
    
    onUpdateLayers(updatedLayers);
  };

  // Handle stage click (deselect when clicking on empty canvas)
  const handleStageClick = (e: any) => {
    // If we click on the stage but not on any shape, clear selection
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  // Handle zooming
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 3);
    onUpdateZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.3);
    onUpdateZoom(newZoom);
  };

  const handleFitToView = () => {
    onUpdateZoom(1);
    setStagePosition({ x: 0, y: 0 });
  };

  // Handle wheel zoom
  const handleWheel = (e: any) => {
    if (activeTool === "zoom") {
      e.evt.preventDefault();
      
      const scaleBy = 1.1;
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      
      const pointerPosition = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerPosition.x - stage.x()) / oldScale,
        y: (pointerPosition.y - stage.y()) / oldScale,
      };
      
      // Determine zoom direction based on delta
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      
      // Update zoom in the state
      onUpdateZoom(newScale);
      
      const newPos = {
        x: pointerPosition.x - mousePointTo.x * newScale,
        y: pointerPosition.y - mousePointTo.y * newScale,
      };
      
      setStagePosition(newPos);
    }
  };

  // Create grid lines for background
  const renderGrid = () => {
    if (!gridSettings.visible) return null;
    
    const gridLines = [];
    const spacing = gridSettings.spacing;
    
    // Determine grid color based on settings
    const gridColor = gridSettings.color;
    
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += spacing) {
      gridLines.push(
        <Rect
          key={`v-${x}`}
          x={x}
          y={0}
          width={1}
          height={canvasHeight}
          fill={gridColor}
        />
      );
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += spacing) {
      gridLines.push(
        <Rect
          key={`h-${y}`}
          x={0}
          y={y}
          width={canvasWidth}
          height={1}
          fill={gridColor}
        />
      );
    }
    
    return gridLines;
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div id="canvas-container" className="w-full h-full overflow-auto">
        <Stage
          ref={stageRef}
          width={window.innerWidth - 500} // Adjust for sidebars 
          height={window.innerHeight - 50} // Adjust for header
          scaleX={zoom}
          scaleY={zoom}
          x={stagePosition.x}
          y={stagePosition.y}
          onClick={handleStageClick}
          onTap={handleStageClick}
          draggable={activeTool === "hand"}
          onDragStart={() => setIsDraggingStage(true)}
          onDragEnd={(e) => {
            setStagePosition({ x: e.target.x(), y: e.target.y() });
            setIsDraggingStage(false);
          }}
          onWheel={handleWheel}
        >
          {/* Grid Layer */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill="#121212"
            />
            {renderGrid()}
          </Layer>
          
          {/* Content Layers */}
          {layers.map((layer) => {
            if (!layer.visible) return null;
            
            return (
              <Layer key={layer.id} opacity={layer.opacity / 100}>
                {layer.elements.map((element) => {
                  const isSelected = selectedElementId === element.id;
                  
                  // Determine if this element should be draggable
                  // Background elements and grid elements should not be draggable by default
                  const isBackgroundLayer = layer.name === "Background";
                  const isGridElement = element.type === "grid";
                  const isStageElement = element.type === "stage";
                  const isCustomGridLayer = layer.name.startsWith("Custom Grid");
                  
                  // Elements should not be draggable if:
                  // 1. The layer is locked, or
                  // 2. We're not in move mode, or
                  // 3. It's a grid or stage element in any layer
                  // 4. It's any element in the background layer
                  const isDraggable = activeTool === "move" && 
                                     !layer.locked && 
                                     !isGridElement &&
                                     !isStageElement &&
                                     !isBackgroundLayer;
                  
                  // Render different element types
                  if (element.type === "light") {
                    return (
                      <LightElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelectElement(element.id)}
                        onChange={(updatedElement) => handleElementChange(updatedElement, layer.id)}
                        draggable={isDraggable}
                      />
                    );
                  } else if (element.type === "gel") {
                    return (
                      <GelElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelectElement(element.id)}
                        onChange={(updatedElement) => handleElementChange(updatedElement, layer.id)}
                        draggable={isDraggable}
                      />
                    );
                  } else if (element.type === "grid") {
                    if (element.properties?.customGrid) {
                      return (
                        <CustomGridElement
                          key={element.id}
                          element={element}
                          isSelected={isSelected}
                          onSelect={() => handleSelectElement(element.id)}
                          onChange={(updatedElement) => handleElementChange(updatedElement, layer.id)}
                          draggable={isDraggable}
                        />
                      );
                    } else {
                      return (
                        <GridElement
                          key={element.id}
                          element={element}
                          isSelected={isSelected}
                          onSelect={() => handleSelectElement(element.id)}
                          onChange={(updatedElement) => handleElementChange(updatedElement, layer.id)}
                          draggable={isDraggable}
                        />
                      );
                    }
                  } else if (element.type === "stage") {
                    return (
                      <StageOutlineElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelectElement(element.id)}
                        onChange={(updatedElement) => handleElementChange(updatedElement, layer.id)}
                        draggable={isDraggable}
                      />
                    );
                  }
                  
                  return null;
                })}
              </Layer>
            );
          })}
        </Stage>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 bg-card rounded shadow-lg flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomOut}
          className="h-8 w-8"
        >
          <ZoomOutIcon className="h-4 w-4" />
        </Button>
        <span className="text-xs px-2">{Math.round(zoom * 100)}%</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomIn}
          className="h-8 w-8"
        >
          <ZoomInIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleFitToView}
          className="h-8 w-8 ml-1"
        >
          <MaximizeIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
