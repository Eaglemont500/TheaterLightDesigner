import { useEffect, useRef, useState } from "react";
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
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Light fixture body */}
        <Rect
          width={element.width || 40}
          height={element.height || 60}
          fill="#333"
          cornerRadius={5}
        />
        
        {/* Light beam */}
        <Rect
          width={(element.width || 40) * 0.6}
          height={10}
          x={(element.width || 40) * 0.2}
          y={(element.height || 60) - 5}
          fill={lightColor}
          cornerRadius={2}
        />
        
        {/* Indicator dot */}
        <Rect
          width={6}
          height={6}
          x={(element.width || 40) - 8}
          y={(element.height || 60) - 8}
          fill="#0D7AFF"
          cornerRadius={3}
        />
        
        {/* Label */}
        <Text
          text={lightDetails?.name || "Light"}
          fontSize={12}
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
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      >
        {/* Gel representation */}
        <Rect
          width={element.width || 30}
          height={element.height || 30}
          fill={gelColor}
          opacity={0.7}
          cornerRadius={5}
        />
        
        {/* Indicator dot */}
        <Rect
          width={6}
          height={6}
          x={(element.width || 30) - 8}
          y={(element.height || 30) - 8}
          fill="#0D7AFF"
          cornerRadius={3}
        />
        
        {/* Label */}
        <Text
          text={gelDetails?.name || "Gel"}
          fontSize={12}
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
              width: Math.max(100, node.width() * scaleX),
              height: Math.max(100, node.height() * scaleY),
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
                  const isDraggable = activeTool === "move" && !layer.locked;
                  
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
