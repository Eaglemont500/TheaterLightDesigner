import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import Canvas from "./Canvas";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { 
  LightbulbIcon, 
  FileIcon, 
  SaveIcon, 
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  Upload as UploadIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ProjectDataSchema, 
  type ProjectData, 
  type Layer, 
  type GridSettings 
} from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Default project data
const DEFAULT_PROJECT_DATA: ProjectData = {
  layers: [
    {
      id: nanoid(),
      name: "Layer 1",
      visible: true,
      locked: false,
      opacity: 100,
      elements: []
    },
    {
      id: nanoid(),
      name: "Background",
      visible: true,
      locked: true,
      opacity: 100,
      elements: []
    }
  ],
  activeLayerId: "0",
  gridSettings: {
    visible: true,
    spacing: 20,
    color: "rgba(255, 255, 255, 0.05)",
    style: "lines",
  },
  canvasWidth: 2000,
  canvasHeight: 1500,
  zoom: 1,
};

export default function TheatricalLightingDesigner() {
  // State
  const [projectData, setProjectData] = useState<ProjectData>(DEFAULT_PROJECT_DATA);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<"move" | "rotate" | "zoom" | "hand">("move");
  const [selectedAssetTab, setSelectedAssetTab] = useState<"lights" | "gels" | "grid">("lights");
  
  // Local project ID ref (for localStorage)
  const localProjectIdRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Load project from localStorage on mount
  useEffect(() => {
    try {
      const savedProjectDataString = localStorage.getItem("theatricalLighting_projectData");
      const savedProjectIdString = localStorage.getItem("theatricalLighting_projectId");
      
      if (savedProjectDataString) {
        const parsedData = JSON.parse(savedProjectDataString);
        const validatedData = ProjectDataSchema.parse(parsedData);
        setProjectData(validatedData);
      }
      
      if (savedProjectIdString) {
        localProjectIdRef.current = parseInt(savedProjectIdString, 10);
      }
    } catch (error) {
      console.error("Error loading saved project data:", error);
      // Fallback to default project data
      setProjectData(DEFAULT_PROJECT_DATA);
    }
  }, []);

  // Auto-save to localStorage whenever projectData changes
  useEffect(() => {
    localStorage.setItem("theatricalLighting_projectData", JSON.stringify(projectData));
    
    // Debounced save to backend if we have a project ID
    const timeoutId = setTimeout(() => {
      if (localProjectIdRef.current) {
        saveProjectMutation.mutate({
          id: localProjectIdRef.current,
          data: projectData,
          lastModified: new Date().toISOString(),
        });
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [projectData]);

  // Fetch project if we have an ID
  const { data: fetchedProject } = useQuery({
    queryKey: ['/api/projects', localProjectIdRef.current],
    enabled: !!localProjectIdRef.current,
    staleTime: 60000, // 1 minute
  });

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async ({ id, data, lastModified }: { id: number, data: ProjectData, lastModified: string }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, { data, lastModified });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', localProjectIdRef.current] });
    }
  });

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: ProjectData) => {
      const res = await apiRequest("POST", "/api/projects", {
        name: "Untitled Theater Lighting Design",
        data: projectData,
        lastModified: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: (data) => {
      localProjectIdRef.current = data.id;
      localStorage.setItem("theatricalLighting_projectId", data.id.toString());
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    }
  });

  // Handlers for updating project data
  const handleUpdateLayers = (updatedLayers: Layer[]) => {
    setProjectData(prev => ({ ...prev, layers: updatedLayers }));
  };

  const handleUpdateGridSettings = (updatedGridSettings: GridSettings) => {
    setProjectData(prev => ({ ...prev, gridSettings: updatedGridSettings }));
  };

  const handleSelectLayer = (layerId: string) => {
    setProjectData(prev => ({ ...prev, activeLayerId: layerId }));
  };

  const handleUpdateZoom = (newZoom: number) => {
    setProjectData(prev => ({ ...prev, zoom: newZoom }));
  };

  const handleNewProject = () => {
    if (confirm("Create a new project? Unsaved changes will be lost.")) {
      localProjectIdRef.current = null;
      localStorage.removeItem("theatricalLighting_projectId");
      setProjectData(DEFAULT_PROJECT_DATA);
      toast({
        title: "New Project Created",
        description: "Started with a fresh canvas",
      });
    }
  };

  const handleSaveProject = async () => {
    if (localProjectIdRef.current) {
      await saveProjectMutation.mutate({
        id: localProjectIdRef.current,
        data: projectData,
        lastModified: new Date().toISOString(),
      });
    } else {
      await createProjectMutation.mutate(projectData);
    }
    
    toast({
      title: "Project Saved",
      description: "Your lighting design has been saved",
    });
  };

  const handleExportProject = () => {
    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'lighting-design.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Project Exported",
        description: "Your lighting design has been exported as JSON",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your lighting design",
        variant: "destructive",
      });
    }
  };
  
  const handleImportProject = () => {
    try {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      
      fileInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const reader = new FileReader();
          
          reader.onload = (e) => {
            try {
              const result = e.target?.result;
              if (typeof result === 'string') {
                const importedData = JSON.parse(result);
                
                // Validate imported data against schema
                const validatedData = ProjectDataSchema.parse(importedData);
                
                // Confirm with the user
                if (confirm("Are you sure you want to import this project? Current project data will be replaced.")) {
                  // Apply the imported data
                  setProjectData(validatedData);
                  
                  // Reset project ID so it's saved as a new project
                  localProjectIdRef.current = null;
                  localStorage.removeItem("theatricalLighting_projectId");
                  
                  toast({
                    title: "Project Imported",
                    description: "The imported lighting design has been loaded successfully",
                  });
                }
              }
            } catch (error) {
              console.error("Error parsing imported data:", error);
              toast({
                title: "Import Failed",
                description: "The file could not be imported. Make sure it's a valid lighting design file.",
                variant: "destructive",
              });
            }
          };
          
          reader.readAsText(file);
        }
      };
      
      // Trigger file input click
      fileInput.click();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the lighting design",
        variant: "destructive",
      });
    }
  };

  const activeLayer = projectData.layers.find(layer => layer.id === projectData.activeLayerId);
  const activeLayerIndex = projectData.layers.findIndex(layer => layer.id === projectData.activeLayerId);

  return (
    <div className="flex flex-col h-screen">
      {/* App Header */}
      <header className="bg-card border-b border-border flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <LightbulbIcon className="text-orange-500 h-6 w-6 mr-2" />
          <h1 className="text-xl font-semibold">Theater Lighting Designer</h1>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleNewProject}
            className="flex items-center"
          >
            <FileIcon className="mr-1 h-4 w-4" /> New
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveProject}
            className="flex items-center"
            disabled={saveProjectMutation.isPending || createProjectMutation.isPending}
          >
            <SaveIcon className="mr-1 h-4 w-4" /> 
            {(saveProjectMutation.isPending || createProjectMutation.isPending) ? "Saving..." : "Save"}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleImportProject}
            className="flex items-center"
          >
            <UploadIcon className="mr-1 h-4 w-4" /> Import
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleExportProject}
            className="flex items-center"
          >
            <DownloadIcon className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools & Assets */}
        <LeftSidebar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          selectedAssetTab={selectedAssetTab}
          setSelectedAssetTab={setSelectedAssetTab}
          gridSettings={projectData.gridSettings}
          onUpdateGridSettings={handleUpdateGridSettings}
          activeLayer={activeLayer}
          onAddElement={(element) => {
            if (activeLayer && activeLayerIndex !== -1) {
              // For custom grids, create a new layer
              if (element.type === "grid" && element.properties?.customGrid) {
                // Create a new layer specifically for this custom grid
                const gridElement = {
                  ...element,
                  x: 0, 
                  y: 0,
                  width: projectData.canvasWidth, // Make it span the whole canvas
                  height: projectData.canvasHeight
                };
                
                // Create a timestamp for a unique grid name
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const timestamp = `${hours}:${minutes}`;
                
                // Create a new layer with a descriptive name
                const newGridLayer: Layer = {
                  id: nanoid(),
                  name: `Custom Grid (${timestamp})`,
                  visible: true,
                  locked: true, // Lock the grid layer by default so it can't be moved
                  opacity: 100,
                  elements: [gridElement]
                };
                
                // Add this new layer to the project
                const updatedLayers = [...projectData.layers, newGridLayer];
                handleUpdateLayers(updatedLayers);
                
                // Automatically select the new grid layer
                handleSelectLayer(newGridLayer.id);
                
                // Show a success toast notification
                toast({
                  title: "Custom Grid Added",
                  description: "A new layer has been created with your custom grid",
                });
              } else {
                // Regular elements go to the active layer
                const updatedLayers = [...projectData.layers];
                updatedLayers[activeLayerIndex] = {
                  ...activeLayer,
                  elements: [...activeLayer.elements, element]
                };
                handleUpdateLayers(updatedLayers);
              }
            }
          }}
          onImport={handleImportProject}
          onExport={handleExportProject}
        />

        {/* Main Canvas Area */}
        <Canvas 
          projectData={projectData}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
          activeTool={activeTool}
          onUpdateLayers={handleUpdateLayers}
          onUpdateZoom={handleUpdateZoom}
        />

        {/* Right Sidebar - Layers & Properties */}
        <RightSidebar 
          layers={projectData.layers}
          activeLayerId={projectData.activeLayerId}
          selectedElementId={selectedElementId}
          onSelectLayer={handleSelectLayer}
          onUpdateLayers={handleUpdateLayers}
          onAddLayer={() => {
            const newLayer: Layer = {
              id: nanoid(),
              name: `Layer ${projectData.layers.length + 1}`,
              visible: true,
              locked: false,
              opacity: 100,
              elements: []
            };
            handleUpdateLayers([newLayer, ...projectData.layers]);
            handleSelectLayer(newLayer.id);
          }}
          onDeleteLayer={() => {
            if (projectData.layers.length <= 1) {
              toast({
                title: "Cannot Delete Layer",
                description: "You need at least one layer in your project",
                variant: "destructive"
              });
              return;
            }
            
            const updatedLayers = projectData.layers.filter(
              layer => layer.id !== projectData.activeLayerId
            );
            
            handleUpdateLayers(updatedLayers);
            handleSelectLayer(updatedLayers[0].id);
          }}
        />
      </div>

      {/* Auto-save notification on initial load */}
      {createProjectMutation.isPending && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg">
          Setting up auto-save...
        </div>
      )}
    </div>
  );
}
