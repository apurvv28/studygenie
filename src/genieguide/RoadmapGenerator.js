import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Dialog } from "@headlessui/react";
import "../styles/RoadmapGenerator.css";

const API_KEY = "AIzaSyDGbkveivZzgelNFWl_jJ1oQknEZdWMr74";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default function RoadmapGenerator() {
  const [subject, setSubject] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subTopics, setSubTopics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!subject) {
      alert("Please enter a subject.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Generate a structured learning roadmap for ${subject}for engineering students. Provide only the main topics as a numbered list without subtopics.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      
      const topics = text.split("\n").filter(line => line.trim() !== "").slice(0, 10);
      const rootNode = { id: "0", data: { label: subject }, position: { x: 500, y: 50 } };
      const newNodes = [rootNode];
      const newEdges = [];
      
      topics.forEach((topic, i) => {
        const nodeId = `${i + 1}`;
        newNodes.push({
          id: nodeId,
          data: { label: topic.replace(/^[0-9]+\.\s*/, "") },
          position: { x: 500 + (i % 2 === 0 ? -200 : 200), y: (i + 1) * 120 },
        });
        newEdges.push({ id: `e0-${nodeId}`, source: "0", target: nodeId, animated: true });
      });
      
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error("Error with AI:", error);
      alert("Error generating roadmap. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubTopics = async (topic) => {
    setLoading(true);
    try {
      const prompt = `Provide detailed subtopics for the topic: ${topic}. Format it as a numbered list with each subtopic followed by a short description. Example format:
  1. Subtopic Name: Description
  2. Subtopic Name: Description
  Only return the list without any extra text.`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
  
      // Splitting the response into structured subtopics
      const formattedSubTopics = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "")
        .map(line => {
          const match = line.match(/^\d+\.\s*(.*?):\s*(.*)$/);
          return match ? { title: match[1], description: match[2] } : null;
        })
        .filter(item => item !== null);
  
      setSubTopics(formattedSubTopics);
      setSelectedTopic(topic);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
      alert("Error fetching subtopics. Try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const onNodeClick = (_, node) => {
    if (node.id !== "0") {
      fetchSubTopics(node.data.label);
    }
  };

  return (
    <div className="roadmap-container">
      <h1 className="roadmap-title">Roadmap Generator</h1>
      <div className="roadmap-input-container">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter a subject..."
          className="roadmap-input-box"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          className="generate-button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="flow-container">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      
      {isOpen && (
  <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="roadmap-modal-overlay">
    <div className="roadmap-modal-content">
      <h2 className="roadmap-modal-title">{selectedTopic}</h2>
      <ul className="roadmap-modal-list">
        {subTopics.map((subTopic, index) => (
          <li key={index} className="roadmap-modal-list-item">
            <strong>{subTopic.title}</strong>: {subTopic.description}
          </li>
        ))}
      </ul>
      <button onClick={() => setIsOpen(false)} className="close-button">
        Close
      </button>
    </div>
  </Dialog>
)}

    </div>
  );
}
