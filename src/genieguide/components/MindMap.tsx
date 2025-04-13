import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  NodeMouseHandler,
} from 'react-flow-renderer';
import { toPng } from 'html-to-image';
import { generateSubtopics, generateVisualExplanation, generateVisualMindmap } from '../services/gemini';
import { Image, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import '../styles/MindMap.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'mainTopic',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 250 },
  },
];

const CustomNode = ({ data }: { data: any }) => (
  <div className={`custom-node ${data.type || ''}`}>
    <div className="node-header">
      {data.label}
    </div>
    {data.theory && (
      <div className="node-content">
        <div className="theory">
          <div className="theory-content">{data.theory}</div>
        </div>
        {data.scenario && (
          <div className="scenario">
            <div className="scenario-label">Example:</div>
            <div className="scenario-content">{data.scenario}</div>
          </div>
        )}
        {data.connections && data.connections.length > 0 && (
          <div className="connections">
            {data.connections.map((conn: string, i: number) => (
              <div key={i} className="connection-tag">
                <ArrowRight size={14} className="connection-icon" />
                <span>{conn}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    theory: '',
    imageUrl: '',
    loading: false,
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleNodeClick: NodeMouseHandler = useCallback(async (event, node) => {
    if (node.type !== 'subtopic') return;

    setModalState({
      isOpen: true,
      title: node.data.label,
      theory: '',
      imageUrl: '',
      loading: true,
    });

    try {
      const explanation = await generateVisualExplanation(node.data.label, node.data.theory);
      setModalState(prev => ({
        ...prev,
        theory: explanation.theory,
        imageUrl: explanation.imageUrl,
        loading: false,
      }));
    } catch (error) {
      console.error('Error generating visual explanation:', error);
      setModalState(prev => ({
        ...prev,
        theory: 'Failed to generate visual explanation. Please try again.',
        loading: false,
      }));
    }
  }, []);

  const createNodeLayout = (data: any) => {
    const centerX = 500;
    const centerY = 300;
    const radius = 540;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const totalSubtopics = data.subtopics.length;
  
    // Main topic node
    newNodes.push({
      id: 'main',
      type: 'mainTopic',
      data: { label: topic, type: 'main' },
      position: { x: centerX, y: centerY },
    });
  
    // Arrange subtopics in a circular pattern
    data.subtopics.forEach((subtopic: any, index: number) => {
      const angle = (index / totalSubtopics) * 2 * Math.PI;
      const nodeX = centerX + radius * Math.cos(angle);
      const nodeY = centerY + radius * Math.sin(angle);
      const nodeId = `subtopic-${index}`;
      
      newNodes.push({
        id: nodeId,
        type: 'subtopic',
        data: { 
          label: subtopic.title,
          theory: subtopic.theory,
          scenario: subtopic.scenario,
          connections: subtopic.connections,
          type: 'subtopic'
        },
        position: { x: nodeX, y: nodeY },
      });
  
      // Connect each subtopic to the main topic
      newEdges.push({
        id: `edge-main-${nodeId}`,
        source: 'main',
        target: nodeId,
        animated: true,
      });
    });
  
    return { nodes: newNodes, edges: newEdges };
  };
  

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    try {
      const data = await generateSubtopics(topic);
      const layout = createNodeLayout(data);
      setNodes(layout.nodes);
      setEdges([]);
      setTimeout(() => setEdges(layout.edges), 500);
    } catch (error) {
      console.error('Error creating mindmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualExplanation = async () => {
    if (!topic) return;

    setModalState({
      isOpen: true,
      title: topic,
      theory: '',
      imageUrl: '',
      loading: true,
    });

    try {
      const visualExplanation = await generateVisualMindmap(topic);
      setModalState(prev => ({
        ...prev,
        theory: visualExplanation.theory,
        imageUrl: visualExplanation.imageUrl,
        loading: false,
      }));
    } catch (error) {
      console.error('Error generating visual mindmap:', error);
      setModalState(prev => ({
        ...prev,
        theory: 'Failed to generate visual mindmap. Please try again.',
        loading: false,
      }));
    }
  };

  const exportToPng = () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      toPng(element, {
        backgroundColor: '#1a1a1a',
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'mindmap.png';
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const nodeTypes = {
    mainTopic: CustomNode,
    subtopic: CustomNode,
  };

  return (
    <div className="mindmap-container">
      <div className="controls-container">
        <form onSubmit={handleTopicSubmit} className="topic-form">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic to learn (e.g., Complex Algorithms, Logical Concepts)"
            className="topic-input"
            disabled={isLoading}
          />
          <button type="submit" className="generate-btn" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Learning Path'}
          </button>
          <button
            type="button"
            onClick={handleVisualExplanation}
            className="visual-btn"
            disabled={!topic || isLoading}
          >
            <Image className="w-5 h-5 mr-2" />
            Real-world Example
          </button>
        </form>
        <button onClick={exportToPng} className="export-btn" disabled={isLoading}>
          Export as PNG
        </button>
      </div>
      
      <div className="mindmap-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#333" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        theory={modalState.theory}
        imageUrl={modalState.imageUrl}
        loading={modalState.loading}
      />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Generating your learning path...</p>
        </div>
      )}
    </div>
  );
}