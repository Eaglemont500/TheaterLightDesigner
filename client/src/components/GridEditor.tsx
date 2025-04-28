import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
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
import { Layer as LayerType } from "@shared/schema";
import { 
  Trash2Icon, 
  Undo2Icon, 
  SaveIcon, 
  MoveIcon,
  PencilIcon,
  XIcon
} from "lucide-react";

interface GridEditorProps {
  onSave: (lines: { id: string; points: number[]; color: string; width: number }[]) => void;
}

export default function GridEditor({ onSave }: GridEditorProps) {
  const [lines, setLines] = useState<{ id: string; points: number[]; color: string; width: number }[]>([]);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "move">("pencil");
  const [open, setOpen] = useState(false);
  const stageRef = useRef<any>(null);

  // Handle start drawing
  const handleMouseDown = (e: any) => {
    if (tool !== "pencil") return;
    
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine([pos.x, pos.y]);
  };

  // Handle drawing movement
  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine(currentLine.concat([pos.x, pos.y]));
  };

  // Handle finish drawing
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentLine.length > 2) { // Only add if line has at least two points
      const newLine = {
        id: nanoid(),
        points: currentLine,
        color: "#888888",
        width: 2
      };
      setLines([...lines, newLine]);
      setCurrentLine([]);
    }
  };

  // Clear all lines
  const handleClear = () => {
    setLines([]);
  };

  // Undo last line
  const handleUndo = () => {
    const newLines = [...lines];
    newLines.pop();
    setLines(newLines);
  };

  // Save the grid
  const handleSave = () => {
    onSave(lines);
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
            Draw your own grid layout by clicking and dragging to create line segments.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div>
            <Button 
              variant={tool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("pencil")}
              className="mr-2"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Draw
            </Button>
            <Button 
              variant={tool === "move" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("move")}
            >
              <MoveIcon className="h-4 w-4 mr-2" />
              Move
            </Button>
          </div>
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo}
              disabled={lines.length === 0}
              className="mr-2"
            >
              <Undo2Icon className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClear}
              disabled={lines.length === 0}
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Clear
            </Button>
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
            ref={stageRef}
            style={{ 
              backgroundColor: "#111111",
              cursor: tool === "pencil" ? "crosshair" : "move"
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

              {/* Current line being drawn */}
              {isDrawing && (
                <Line
                  points={currentLine}
                  stroke="#888888"
                  strokeWidth={2}
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