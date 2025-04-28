import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Transformer } from "react-konva";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Trash2Icon, 
  Undo2Icon, 
  SaveIcon, 
  MoveIcon,
  PlusIcon,
  PencilIcon,
  XIcon,
  MousePointerIcon,
  SplitIcon
} from "lucide-react";

interface LineItem {
  id: string;
  points: number[];
  color: string;
  width: number;
  isDragging?: boolean;
  isSelected?: boolean;
}

interface GridEditorProps {
  onSave: (lines: { id: string; points: number[]; color: string; width: number }[]) => void;
}

const LineComponent = ({ 
  shapeProps, 
  isSelected, 
  onSelect, 
  onChange 
}: {
  shapeProps: LineItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: LineItem) => void;
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current) {
      // Attach transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        points={shapeProps.points}
        stroke={shapeProps.color}
        strokeWidth={shapeProps.width}
        tension={0}
        lineCap="round"
        lineJoin="round"
        draggable
        onDragStart={() => {
          onChange({
            ...shapeProps,
            isDragging: true,
          });
        }}
        onDragEnd={(e) => {
          // Update line position after drag
          onChange({
            ...shapeProps,
            isDragging: false,
            points: translatePoints(shapeProps.points, e.target.x(), e.target.y()),
          });
          // Reset position as points already include the translation
          e.target.x(0);
          e.target.y(0);
        }}
        onTransformEnd={() => {
          // Transformer changes scale and rotate, but for Line
          // we only want to change the points
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          // Reset scale, as scale is applied to points
          node.scaleX(1);
          node.scaleY(1);
          
          // Scale points
          const scaledPoints = shapeProps.points.map((point, i) => {
            if (i % 2 === 0) {
              return point * scaleX;
            } else {
              return point * scaleY;
            }
          });
          
          onChange({
            ...shapeProps,
            points: scaledPoints,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize to a minimum size
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right'
          ]}
        />
      )}
    </>
  );
};

// Translate points by an offset
const translatePoints = (points: number[], offsetX: number, offsetY: number): number[] => {
  return points.map((point, i) => {
    if (i % 2 === 0) {
      return point + offsetX;
    } else {
      return point + offsetY;
    }
  });
};

export default function GridEditor({ onSave }: GridEditorProps) {
  const [lines, setLines] = useState<LineItem[]>([]);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"select" | "move" | "pencil" | "line">("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [lineColor, setLineColor] = useState("#888888");
  const [lineWidth, setLineWidth] = useState(2);
  const stageRef = useRef<any>(null);

  // Clear selection when tool changes
  useEffect(() => {
    setSelectedId(null);
  }, [tool]);

  // Handle stage click - deselect when clicking on empty space
  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // Handle start drawing for pencil tool
  const handleMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.parent?.className === "Layer";
    
    // Handle selection
    if (tool === "select") {
      if (!clickedOnEmpty) {
        // Don't deselect when clicking on a shape in select mode
        return;
      }
      setSelectedId(null);
      return;
    }
    
    // Drawing tools
    if (tool === "pencil" || tool === "line") {
      if (isDrawing) return;
      setIsDrawing(true);
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const { x, y } = pointerPosition;
      setCurrentLine([x, y]); // Start point
    }
  };

  // Handle drawing movement
  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (tool === "pencil") {
      // For pencil, we add points to create a freehand path
      setCurrentLine([...currentLine, pointerPosition.x, pointerPosition.y]);
    } else if (tool === "line") {
      // For line, we only keep start point and current point to create a straight line
      setCurrentLine([currentLine[0], currentLine[1], pointerPosition.x, pointerPosition.y]);
    }
  };

  // Handle finish drawing
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentLine.length >= 4) { // Need at least 2 points (4 values)
      const newLine: LineItem = {
        id: nanoid(),
        points: currentLine,
        color: lineColor,
        width: lineWidth
      };
      setLines([...lines, newLine]);
      setCurrentLine([]);
    }
  };

  // Handle changes to a line
  const handleLineChange = (updatedLine: LineItem) => {
    const updatedLines = lines.map(line => {
      if (line.id === updatedLine.id) {
        return updatedLine;
      }
      return line;
    });
    setLines(updatedLines);
  };

  // Delete selected line
  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setLines(lines.filter(line => line.id !== selectedId));
    setSelectedId(null);
  };

  // Clear all lines
  const handleClear = () => {
    setLines([]);
    setSelectedId(null);
  };

  // Undo last line
  const handleUndo = () => {
    const newLines = [...lines];
    newLines.pop();
    setLines(newLines);
    if (selectedId && newLines.findIndex(line => line.id === selectedId) === -1) {
      setSelectedId(null);
    }
  };

  // Add a new horizontal or vertical line
  const addPredefinedLine = (orientation: "horizontal" | "vertical") => {
    const stageWidth = 770;
    const stageHeight = 400;
    
    const newLine: LineItem = {
      id: nanoid(),
      points: orientation === "horizontal" 
        ? [0, stageHeight / 2, stageWidth, stageHeight / 2] // Horizontal line
        : [stageWidth / 2, 0, stageWidth / 2, stageHeight], // Vertical line
      color: lineColor,
      width: lineWidth
    };
    
    setLines([...lines, newLine]);
  };

  // Save the grid
  const handleSave = () => {
    // Filter out any UI-specific properties before saving
    const cleanedLines = lines.map(({ id, points, color, width }) => ({
      id, points, color, width
    }));
    onSave(cleanedLines);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Design Custom Grid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Custom Grid Designer</DialogTitle>
          <DialogDescription>
            Design your own lighting grid by adding, drawing, and arranging lines.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={tool === "select" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("select")}
              className="h-9"
            >
              <MousePointerIcon className="h-4 w-4 mr-2" />
              Select
            </Button>
            <Button 
              variant={tool === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("line")}
              className="h-9"
            >
              <SplitIcon className="h-4 w-4 mr-2" />
              Line
            </Button>
            <Button 
              variant={tool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("pencil")}
              className="h-9"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Freehand
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => addPredefinedLine("horizontal")}
              className="h-9"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Horizontal
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => addPredefinedLine("vertical")}
              className="h-9"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Vertical
            </Button>
            
            {selectedId && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteSelected}
                className="h-9 ml-auto"
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo}
              disabled={lines.length === 0}
              className="h-9 ml-auto"
            >
              <Undo2Icon className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClear}
              disabled={lines.length === 0}
              className="h-9"
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
            <strong>Tip:</strong> Select a line to move or resize it. Use the Line or Freehand tool to draw new lines.
          </div>
        </div>

        <div 
          className="border border-border rounded-md overflow-hidden"
          style={{ height: '400px' }}
        >
          <Stage
            width={770}
            height={400}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onClick={handleStageClick}
            ref={stageRef}
            style={{ 
              backgroundColor: "#111111",
              cursor: tool === "pencil" ? "crosshair" : tool === "line" ? "crosshair" : "default"
            }}
          >
            <Layer>
              {/* Grid background */}
              <Rect
                width={770}
                height={400}
                fill="#111111"
              />

              {/* Grid helper lines */}
              <Line
                points={[0, 200, 770, 200]}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Line
                points={[385, 0, 385, 400]}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                dash={[5, 5]}
              />

              {/* Existing lines */}
              {lines.map((line) => (
                <LineComponent
                  key={line.id}
                  shapeProps={line}
                  isSelected={line.id === selectedId}
                  onSelect={() => {
                    if (tool === "select") {
                      setSelectedId(line.id);
                    }
                  }}
                  onChange={(newAttrs) => handleLineChange(newAttrs)}
                />
              ))}

              {/* Current line being drawn */}
              {isDrawing && (
                <Line
                  points={currentLine}
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  tension={0}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
            </Layer>
          </Stage>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={lines.length === 0}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Grid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}