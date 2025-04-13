export interface Node {
  id: string;
  type: 'input' | 'default' | 'output';
  data: { label: string };
  position: { x: number; y: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
}