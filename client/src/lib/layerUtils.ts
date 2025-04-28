import { type Layer as LayerType } from "@shared/schema";

/**
 * Brings a layer one level forward in the z-index order
 * @param layers Current array of layers
 * @param layerId ID of the layer to bring forward
 * @returns Updated array of layers with the selected layer moved forward
 */
export function bringLayerForward(layers: LayerType[], layerId: string): LayerType[] {
  const layerIndex = layers.findIndex(layer => layer.id === layerId);
  
  // If layer not found or already at the top, don't change anything
  if (layerIndex === -1 || layerIndex === layers.length - 1) {
    return [...layers];
  }
  
  // Create a new array with the layer moved up one spot
  const newLayers = [...layers];
  const layerToMove = newLayers[layerIndex];
  newLayers.splice(layerIndex, 1); // Remove from current position
  newLayers.splice(layerIndex + 1, 0, layerToMove); // Insert at new position
  
  return newLayers;
}

/**
 * Sends a layer one level backward in the z-index order
 * @param layers Current array of layers
 * @param layerId ID of the layer to send backward
 * @returns Updated array of layers with the selected layer moved backward
 */
export function sendLayerBackward(layers: LayerType[], layerId: string): LayerType[] {
  const layerIndex = layers.findIndex(layer => layer.id === layerId);
  
  // If layer not found or already at the bottom, don't change anything
  if (layerIndex <= 0) {
    return [...layers];
  }
  
  // Create a new array with the layer moved down one spot
  const newLayers = [...layers];
  const layerToMove = newLayers[layerIndex];
  newLayers.splice(layerIndex, 1); // Remove from current position
  newLayers.splice(layerIndex - 1, 0, layerToMove); // Insert at new position
  
  return newLayers;
}

/**
 * Brings an element to the front of its layer
 * @param layers Current array of layers
 * @param layerId ID of the layer containing the element
 * @param elementId ID of the element to bring to front
 * @returns Updated array of layers with the element reordered
 */
export function bringElementToFront(layers: LayerType[], layerId: string, elementId: string): LayerType[] {
  const layerIndex = layers.findIndex(layer => layer.id === layerId);
  
  // If layer not found, don't change anything
  if (layerIndex === -1) {
    return [...layers];
  }
  
  const elements = [...layers[layerIndex].elements];
  const elementIndex = elements.findIndex(element => element.id === elementId);
  
  // If element not found, don't change anything
  if (elementIndex === -1) {
    return [...layers];
  }
  
  // Move element to the end of the array (top of the visual stack)
  const elementToMove = elements[elementIndex];
  elements.splice(elementIndex, 1); // Remove from current position
  elements.push(elementToMove); // Add to the end (top)
  
  // Create a new array with the updated layer
  const newLayers = [...layers];
  newLayers[layerIndex] = {
    ...newLayers[layerIndex],
    elements
  };
  
  return newLayers;
}

/**
 * Sends an element to the back of its layer
 * @param layers Current array of layers
 * @param layerId ID of the layer containing the element
 * @param elementId ID of the element to send to back
 * @returns Updated array of layers with the element reordered
 */
export function sendElementToBack(layers: LayerType[], layerId: string, elementId: string): LayerType[] {
  const layerIndex = layers.findIndex(layer => layer.id === layerId);
  
  // If layer not found, don't change anything
  if (layerIndex === -1) {
    return [...layers];
  }
  
  const elements = [...layers[layerIndex].elements];
  const elementIndex = elements.findIndex(element => element.id === elementId);
  
  // If element not found, don't change anything
  if (elementIndex === -1) {
    return [...layers];
  }
  
  // Move element to the start of the array (bottom of the visual stack)
  const elementToMove = elements[elementIndex];
  elements.splice(elementIndex, 1); // Remove from current position
  elements.unshift(elementToMove); // Add to the beginning (bottom)
  
  // Create a new array with the updated layer
  const newLayers = [...layers];
  newLayers[layerIndex] = {
    ...newLayers[layerIndex],
    elements
  };
  
  return newLayers;
}