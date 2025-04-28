import { useState } from "react";
import { 
  MousePointerIcon, 
  RotateCwIcon, 
  ZoomInIcon, 
  HandIcon, 
  SearchIcon, 
  PlusIcon,
  ArrowUpDownIcon,
  ArrowDownUpIcon,
  ImportIcon,
  Download as ExportIcon,
  Upload as UploadIcon,
  HashIcon,
  PaletteIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { nanoid } from "nanoid";
import { type GridSettings, type Layer } from "@shared/schema";
import { etcLights } from "@/lib/etcLights";
import { roscoLuxGels, sortGelsByColor, sortGelsByNumber } from "@/lib/roscoLuxGels";

interface LeftSidebarProps {
  activeTool: "move" | "rotate" | "zoom" | "hand";
  setActiveTool: (tool: "move" | "rotate" | "zoom" | "hand") => void;
  selectedAssetTab: "lights" | "gels" | "grid";
  setSelectedAssetTab: (tab: "lights" | "gels" | "grid") => void;
  gridSettings: GridSettings;
  onUpdateGridSettings: (settings: GridSettings) => void;
  activeLayer: Layer | undefined;
  onAddElement: (element: Layer["elements"][0]) => void;
}

export default function LeftSidebar({
  activeTool,
  setActiveTool,
  selectedAssetTab,
  setSelectedAssetTab,
  gridSettings,
  onUpdateGridSettings,
  activeLayer,
  onAddElement
}: LeftSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Handle adding an element to the canvas
  const handleAddElement = (type: "light" | "gel", assetId: string) => {
    if (!activeLayer) return;
    
    const newElement = {
      id: nanoid(),
      type,
      x: 200,
      y: 150,
      width: type === "light" ? 40 : 30,
      height: type === "light" ? 60 : 30,
      rotation: 0,
      assetId,
      properties: {},
    };
    
    onAddElement(newElement);
  };
  
  // Gel sorting state
  const [gelSortType, setGelSortType] = useState<"color" | "number">("color");
  
  // Filter assets based on search term
  const filteredLights = etcLights.filter(light => 
    light.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (light.manufacturer && light.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredGels = roscoLuxGels.filter(gel => 
    gel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gel.number.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort gels based on sort type
  const sortedGels = gelSortType === "color" 
    ? filteredGels 
    : sortGelsByNumber(filteredGels);
  
  // Group lights by manufacturer
  const lightManufacturers = filteredLights.reduce((acc, light) => {
    const manufacturer = light.manufacturer || "Other";
    if (!acc[manufacturer]) {
      acc[manufacturer] = [];
    }
    acc[manufacturer].push(light);
    return acc;
  }, {} as Record<string, typeof etcLights>);
  
  // Group gels by category or just use the sorted list
  const gelCategories = gelSortType === "color" 
    ? sortedGels.reduce((acc, gel) => {
        if (!acc[gel.category]) {
          acc[gel.category] = [];
        }
        acc[gel.category].push(gel);
        return acc;
      }, {} as Record<string, typeof roscoLuxGels>)
    : { "By Number": sortedGels };

  return (
    <div id="left-sidebar" className="w-64 bg-card border-r border-border flex flex-col">
      {/* Tools Section */}
      <div className="p-3 border-b border-border">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Tools</h2>
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant={activeTool === "move" ? "default" : "ghost"}
            size="sm"
            className="h-14 flex flex-col items-center justify-center"
            onClick={() => setActiveTool("move")}
          >
            <MousePointerIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Move</span>
          </Button>
          
          <Button
            variant={activeTool === "rotate" ? "default" : "ghost"}
            size="sm"
            className="h-14 flex flex-col items-center justify-center"
            onClick={() => setActiveTool("rotate")}
          >
            <RotateCwIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Rotate</span>
          </Button>
          
          <Button
            variant={activeTool === "zoom" ? "default" : "ghost"}
            size="sm"
            className="h-14 flex flex-col items-center justify-center"
            onClick={() => setActiveTool("zoom")}
          >
            <ZoomInIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Zoom</span>
          </Button>
          
          <Button
            variant={activeTool === "hand" ? "default" : "ghost"}
            size="sm"
            className="h-14 flex flex-col items-center justify-center"
            onClick={() => setActiveTool("hand")}
          >
            <HandIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Hand</span>
          </Button>
        </div>
      </div>

      {/* Assets Tabs */}
      <div className="border-b border-border">
        <div className="flex border-b border-border">
          <Button
            variant="ghost"
            className={`flex-1 py-2 text-center text-sm border-b-2 rounded-none ${
              selectedAssetTab === "lights" 
                ? "border-primary" 
                : "border-transparent"
            }`}
            onClick={() => setSelectedAssetTab("lights")}
          >
            Lights
          </Button>
          
          <Button
            variant="ghost"
            className={`flex-1 py-2 text-center text-sm border-b-2 rounded-none ${
              selectedAssetTab === "gels" 
                ? "border-primary" 
                : "border-transparent"
            }`}
            onClick={() => setSelectedAssetTab("gels")}
          >
            Gels
          </Button>
          
          <Button
            variant="ghost"
            className={`flex-1 py-2 text-center text-sm border-b-2 rounded-none ${
              selectedAssetTab === "grid" 
                ? "border-primary" 
                : "border-transparent"
            }`}
            onClick={() => setSelectedAssetTab("grid")}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Asset Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Lights Tab Content */}
        {selectedAssetTab === "lights" && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search lights..."
                  className="w-full pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2">
              {Object.entries(lightManufacturers).map(([manufacturer, lights]) => (
                <div key={manufacturer} className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 mt-1">{manufacturer} Fixtures</h3>
                  
                  {lights.map((light) => (
                    <div 
                      key={light.id}
                      className="p-2 rounded flex items-center mb-2 hover:bg-secondary/50 cursor-pointer"
                      onClick={() => handleAddElement("light", light.id)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", JSON.stringify({
                          type: "light",
                          id: light.id
                        }));
                      }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-background rounded flex items-center justify-center">
                        <span className="text-xl" style={{ color: light.color }}>💡</span>
                      </div>
                      <div className="ml-2">
                        <h4 className="text-sm">{light.name}</h4>
                        <p className="text-xs text-muted-foreground">{light.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gels Tab Content */}
        {selectedAssetTab === "gels" && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative mb-2">
                <Input
                  type="text"
                  placeholder="Search gels..."
                  className="w-full pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              {/* Sorting UI */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Sort by:</span>
                  <div className="flex gap-1">
                    <Button
                      variant={gelSortType === "color" ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => setGelSortType("color")}
                    >
                      <PaletteIcon className="h-3 w-3 mr-1" />
                      Color
                    </Button>
                    <Button
                      variant={gelSortType === "number" ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => setGelSortType("number")}
                    >
                      <HashIcon className="h-3 w-3 mr-1" />
                      Number
                    </Button>
                  </div>
                </div>
                
                {/* Import/Export Buttons */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs flex-1"
                    onClick={() => {
                      // Create a hidden file input
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files && target.files[0]) {
                          const file = target.files[0];
                          const reader = new FileReader();
                          
                          reader.onload = (fileEvent) => {
                            try {
                              const jsonData = JSON.parse(fileEvent.target?.result as string);
                              // Here you would handle the import data
                              console.log('Imported data:', jsonData);
                              // You would trigger an action here to load the design
                              alert('Design imported successfully!');
                            } catch (error) {
                              console.error('Error parsing imported file:', error);
                              alert('Failed to import design. Invalid file format.');
                            }
                          };
                          
                          reader.readAsText(file);
                        }
                      };
                      
                      // Trigger the file input
                      input.click();
                    }}
                  >
                    <UploadIcon className="h-3 w-3 mr-1" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs flex-1"
                    onClick={() => {
                      // Here you would create the export data
                      // For now, we'll use placeholder data
                      const exportData = {
                        // Example data that would be replaced with actual project data
                        name: "My Lighting Design",
                        date: new Date().toISOString(),
                        layers: [], // This would be filled with actual layer data
                      };
                      
                      // Create a blob with the JSON data
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      
                      // Create a download link
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `lighting-design-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      
                      // Clean up
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <ExportIcon className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 mt-1">RoscoLux Gels</h3>
              
              {Object.entries(gelCategories).map(([category, gels]) => (
                <div key={category} className="mb-3">
                  <h4 className="text-xs font-semibold mb-1">{category}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {gels.map((gel) => (
                      <div
                        key={gel.id}
                        className="p-2 rounded text-center hover:bg-secondary/50 cursor-pointer"
                        onClick={() => handleAddElement("gel", gel.id)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", JSON.stringify({
                            type: "gel",
                            id: gel.id
                          }));
                        }}
                      >
                        <div 
                          className="w-5 h-5 mx-auto rounded" 
                          style={{ backgroundColor: gel.color }}
                        ></div>
                        <div className="text-xs mt-1">{gel.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid Tab Content */}
        {selectedAssetTab === "grid" && (
          <div className="h-full flex flex-col p-3">
            <h3 className="text-sm font-medium mb-3">Grid Settings</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="grid-toggle" className="text-sm">Show Grid</Label>
                <Checkbox 
                  id="grid-toggle" 
                  checked={gridSettings.visible}
                  onCheckedChange={(checked) => 
                    onUpdateGridSettings({
                      ...gridSettings,
                      visible: checked === true
                    })
                  }
                />
              </div>
              
              <Label className="block text-sm mb-1 mt-3">Grid Spacing</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="grid-spacing"
                  min={10}
                  max={100}
                  step={1}
                  value={[gridSettings.spacing]}
                  onValueChange={([value]) => 
                    onUpdateGridSettings({
                      ...gridSettings,
                      spacing: value
                    })
                  }
                />
                <span className="text-sm font-mono w-12 text-right">{gridSettings.spacing}px</span>
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="block text-sm mb-1">Grid Color</Label>
              <div className="grid grid-cols-6 gap-1 mt-1">
                {[
                  "rgba(255,255,255,0.05)", 
                  "rgba(255,255,255,0.1)",
                  "rgba(255,0,0,0.1)", 
                  "rgba(0,255,0,0.1)", 
                  "rgba(0,0,255,0.1)",
                  "rgba(255,255,0,0.1)"
                ].map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded ${gridSettings.color === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateGridSettings({ ...gridSettings, color })}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="grid-style" className="block text-sm mb-1">Grid Style</Label>
              <Select
                value={gridSettings.style}
                onValueChange={(value: "lines" | "dots" | "dashed") => 
                  onUpdateGridSettings({
                    ...gridSettings,
                    style: value
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grid style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="dashed">Dashed Lines</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Stage Layout</h4>
              <Button 
                className="w-full"
                onClick={() => {
                  if (!activeLayer) return;
                  
                  const newElement = {
                    id: nanoid(),
                    type: "stage" as const,
                    x: 100,
                    y: 100,
                    width: 800,
                    height: 400,
                    rotation: 0,
                    assetId: "stage-outline",
                    properties: {
                      stageType: "proscenium"
                    },
                  };
                  
                  onAddElement(newElement);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Stage Outline
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
