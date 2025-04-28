import { useState } from "react";
import { 
  LockIcon, 
  UnlockIcon, 
  TrashIcon, 
  CopyIcon, 
  MoveUpIcon, 
  MoveDownIcon, 
  PlusIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Layer } from "@shared/schema";
import { bringElementToFront, sendElementToBack } from "@/lib/layerUtils";

interface RightSidebarProps {
  layers: Layer[];
  activeLayerId: string;
  selectedElementId: string | null;
  onSelectLayer: (layerId: string) => void;
  onUpdateLayers: (updatedLayers: Layer[]) => void;
  onAddLayer: () => void;
  onDeleteLayer: () => void;
}

export default function RightSidebar({
  layers,
  activeLayerId,
  selectedElementId,
  onSelectLayer,
  onUpdateLayers,
  onAddLayer,
  onDeleteLayer
}: RightSidebarProps) {
  // Find the currently selected element across all layers
  const selectedElement = layers
    .flatMap(layer => layer.elements)
    .find(element => element.id === selectedElementId);

  // Find the active layer
  const activeLayer = layers.find(layer => layer.id === activeLayerId);
  
  // Handle toggling layer visibility
  const handleToggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible } 
        : layer
    );
    onUpdateLayers(updatedLayers);
  };
  
  // Handle toggling layer lock
  const handleToggleLayerLock = (layerId: string) => {
    const updatedLayers = layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, locked: !layer.locked } 
        : layer
    );
    onUpdateLayers(updatedLayers);
  };
  
  // Handle changing layer opacity
  const handleLayerOpacityChange = (opacity: number) => {
    if (!activeLayer) return;
    
    const updatedLayers = layers.map(layer => 
      layer.id === activeLayerId 
        ? { ...layer, opacity } 
        : layer
    );
    onUpdateLayers(updatedLayers);
  };
  
  // Handle updating element properties
  const handleUpdateElementProperty = (property: string, value: number) => {
    if (!selectedElement || !activeLayerId) return;
    
    const layerIndex = layers.findIndex(layer => 
      layer.elements.some(element => element.id === selectedElementId)
    );
    
    if (layerIndex === -1) return;
    
    const elementIndex = layers[layerIndex].elements.findIndex(
      element => element.id === selectedElementId
    );
    
    if (elementIndex === -1) return;
    
    const updatedLayers = [...layers];
    const element = { ...updatedLayers[layerIndex].elements[elementIndex] };
    
    // Update specific property
    if (property === "x" || property === "y") {
      element[property] = value;
    } else if (property === "rotation") {
      element.rotation = value;
    } else if (property === "width" || property === "height") {
      element[property] = value;
    }
    
    updatedLayers[layerIndex].elements[elementIndex] = element;
    onUpdateLayers(updatedLayers);
  };
  
  // Handle element operations
  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    
    const layerIndex = layers.findIndex(layer => 
      layer.elements.some(element => element.id === selectedElementId)
    );
    
    if (layerIndex === -1) return;
    
    const updatedLayers = [...layers];
    updatedLayers[layerIndex].elements = updatedLayers[layerIndex].elements.filter(
      element => element.id !== selectedElementId
    );
    
    onUpdateLayers(updatedLayers);
  };
  
  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    
    const layerIndex = layers.findIndex(layer => 
      layer.elements.some(element => element.id === selectedElementId)
    );
    
    if (layerIndex === -1) return;
    
    const duplicatedElement = {
      ...selectedElement,
      id: `${selectedElement.id}-copy-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    };
    
    const updatedLayers = [...layers];
    updatedLayers[layerIndex].elements.push(duplicatedElement);
    
    onUpdateLayers(updatedLayers);
  };

  return (
    <div id="right-sidebar" className="w-64 bg-card border-l border-border flex flex-col">
      {/* Properties Panel */}
      <div className="p-3 border-b border-border">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Properties</h2>
        
        {selectedElement ? (
          <div>
            <div className="mb-3">
              <Label className="block text-xs text-muted-foreground mb-1">Position</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <span className="text-xs">X:</span>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => handleUpdateElementProperty("x", parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs">Y:</span>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => handleUpdateElementProperty("y", parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <Label className="block text-xs text-muted-foreground mb-1">Rotation</Label>
              <Slider
                min={0}
                max={359}
                step={1}
                value={[selectedElement.rotation]}
                onValueChange={([value]) => handleUpdateElementProperty("rotation", value)}
                className="mb-1"
              />
              <div className="flex justify-between">
                <span className="text-xs">0°</span>
                <Input
                  type="number"
                  value={selectedElement.rotation}
                  onChange={(e) => handleUpdateElementProperty("rotation", parseInt(e.target.value) || 0)}
                  className="w-16 h-6 text-center"
                />
                <span className="text-xs">359°</span>
              </div>
            </div>
            
            <div className="mb-3">
              <Label className="block text-xs text-muted-foreground mb-1">Size</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <span className="text-xs">W:</span>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => handleUpdateElementProperty("width", parseInt(e.target.value) || 10)}
                    min={10}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs">H:</span>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => handleUpdateElementProperty("height", parseInt(e.target.value) || 10)}
                    min={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label className="block text-xs text-muted-foreground mb-1">Options</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDeleteElement}
                  className="flex items-center justify-center"
                >
                  <TrashIcon className="h-3 w-3 mr-1" /> Delete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDuplicateElement}
                  className="flex items-center justify-center"
                >
                  <CopyIcon className="h-3 w-3 mr-1" /> Duplicate
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={() => {
                    if (!selectedElementId) return;
                    
                    // Find the layer containing the selected element
                    const layerIndex = layers.findIndex(layer => 
                      layer.elements.some(element => element.id === selectedElementId)
                    );
                    
                    if (layerIndex === -1) return;
                    const layerId = layers[layerIndex].id;
                    
                    // Use the utility function to bring the element to front
                    const updatedLayers = bringElementToFront(layers, layerId, selectedElementId);
                    onUpdateLayers(updatedLayers);
                  }}
                >
                  <MoveUpIcon className="h-3 w-3 mr-1" /> Bring Front
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={() => {
                    if (!selectedElementId) return;
                    
                    // Find the layer containing the selected element
                    const layerIndex = layers.findIndex(layer => 
                      layer.elements.some(element => element.id === selectedElementId)
                    );
                    
                    if (layerIndex === -1) return;
                    const layerId = layers[layerIndex].id;
                    
                    // Use the utility function to send the element to back
                    const updatedLayers = sendElementToBack(layers, layerId, selectedElementId);
                    onUpdateLayers(updatedLayers);
                  }}
                >
                  <MoveDownIcon className="h-3 w-3 mr-1" /> Send Back
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4">
            Select an element to edit properties
          </div>
        )}
      </div>
      
      {/* Layers Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border flex justify-between items-center">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Layers</h2>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onAddLayer}
              title="Add Layer"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onDeleteLayer}
              title="Delete Layer"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {layers.map((layer) => (
            <div 
              key={layer.id}
              className={`p-2 border-b border-border flex items-center ${
                layer.id === activeLayerId ? "bg-secondary/30" : ""
              } hover:bg-secondary/10`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="mr-2">
                <Checkbox
                  checked={layer.visible}
                  onCheckedChange={() => handleToggleLayerVisibility(layer.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex-1">
                <span className="text-sm">{layer.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLayerLock(layer.id);
                }}
                title={layer.locked ? "Unlock Layer" : "Lock Layer"}
              >
                {layer.locked ? (
                  <LockIcon className="h-3 w-3" />
                ) : (
                  <UnlockIcon className="h-3 w-3" />
                )}
              </Button>
            </div>
          ))}
        </div>
        
        {/* Layer Opacity Control */}
        <div className="p-3 border-t border-border">
          <Label className="block text-xs text-muted-foreground mb-1">Layer Opacity</Label>
          <div className="flex items-center">
            <Slider
              disabled={!activeLayer}
              min={0}
              max={100}
              step={1}
              value={[activeLayer?.opacity || 100]}
              onValueChange={([value]) => handleLayerOpacityChange(value)}
              className="flex-1"
            />
            <span className="ml-2 text-sm">{activeLayer?.opacity || 100}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
