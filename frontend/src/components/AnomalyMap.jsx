import React, { useState, useEffect, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

// Generate complex mock data for codebase graph
const generateGraphData = () => {
  const nodes = [];
  const links = [];
  const categories = [
    { type: 'clean', color: '#00F5FF', severity: 0 },
    { type: 'warning', color: '#FF6B00', severity: 50 },
    { type: 'critical', color: '#FF0055', severity: 100 }
  ];

  const files = ['AuthService.java', 'UserController.java', 'DatabaseImpl.cpp', 'StringUtils.py', 'App.jsx', 'PaymentGateway.java', 'SecurityConfig.java', 'DataParser.cpp', 'VectorMath.py', 'NetworkHandler.java'];
  const issues = ['God Class', 'Long Method', 'Memory Leak', 'SQL Injection', 'Dead Code', 'XSS Vulnerability', 'Buffer Overflow'];

  for (let i = 1; i <= 40; i++) {
    // 60% clean, 25% warning, 15% critical
    const rand = Math.random();
    const isClean = rand < 0.6;
    const cat = isClean ? categories[0] : (rand < 0.85 ? categories[1] : categories[2]);
    
    // Unstable matter "rises" - assigning intended floating Z factor (handled by force graph engine optionally or post-processing)
    
    nodes.push({
      id: `node-${i}`,
      name: files[i % files.length],
      category: cat.type,
      color: cat.color,
      severity: cat.severity,
      issue: isClean ? 'None' : issues[Math.floor(Math.random() * issues.length)],
      val: isClean ? 1 : (cat.type === 'critical' ? 3 : 2)
    });
  }

  // Create dependency links
  for (let i = 0; i < 50; i++) {
    const source = `node-${Math.floor(Math.random() * 40) + 1}`;
    const target = `node-${Math.floor(Math.random() * 40) + 1}`;
    if (source !== target) {
      links.push({ source, target });
    }
  }

  return { nodes, links };
};

export default function AnomalyMap() {
  const graphRef = useRef();
  const [data, setData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setData(generateGraphData());
    
    const updateDim = () => {
      const w = Math.min(window.innerWidth - 40, 1000);
      setDimensions({ width: w, height: Math.min(window.innerHeight * 0.6, 600) });
    };
    window.addEventListener('resize', updateDim);
    updateDim();
    
    return () => window.removeEventListener('resize', updateDim);
  }, []);

  // Post process force layout to push bad code "up" (in 3D, z or y axis depending on camera)
  useEffect(() => {
    if (graphRef.current) {
      // Force bad nodes upward
      graphRef.current.d3Force('z', null); // clear default
      // Custom force
      const forceZ = () => {
        data.nodes.forEach(node => {
          if (node.severity > 0) {
            node.vz += node.severity * 0.001; // push upwards on Z axis (anti-gravity)
          }
        });
      };
      // Keep it somewhat bounded
      graphRef.current.d3Force('customZ', forceZ);
      
      // Look at center
      graphRef.current.cameraPosition({ x: 0, y: 150, z: 250 });
    }
  }, [data]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    
    // Zoom to node
    const distance = 60;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        1000  // ms transition duration
      );
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_40px_100px_-20px_rgba(191,0,255,0.2)]">
      
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="px-3 py-1 bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-white rounded-full text-xs font-space">Clean</span>
        <span className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-white rounded-full text-xs font-space">Warning</span>
        <span className="px-3 py-1 bg-[#FF0055]/10 border border-[#FF0055]/30 text-white rounded-full text-xs font-space">Critical</span>
      </div>

      <div className="cursor-crosshair bg-gz-bg/80 mix-blend-screen" style={{ width: dimensions.width, height: dimensions.height }}>
        <ForceGraph3D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeLabel="name"
          nodeColor="color"
          backgroundColor="rgba(0,0,0,0)"
          enableNodeDrag={false}
          onNodeClick={handleNodeClick}
          linkColor={() => 'rgba(255, 255, 255, 0.1)'}
          linkOpacity={0.3}
          linkWidth={1}
          nodeThreeObject={node => {
            // Best graph styled possible - custom nodes in ThreeJS
            const group = new THREE.Group();
            
            // Core node
            const geometry = new THREE.SphereGeometry(node.val * 3, 16, 16);
            const material = new THREE.MeshLambertMaterial({ 
              color: node.color, 
              emissive: node.color,
              emissiveIntensity: node.severity > 0 ? 0.8 : 0.2,
              transparent: true,
              opacity: 0.9
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Aura ring for critical nodes
            if (node.severity > 50) {
              const ringGeo = new THREE.RingGeometry(node.val * 4, node.val * 4.5, 32);
              const ringMat = new THREE.MeshBasicMaterial({ 
                color: node.color, 
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.5 
              });
              const ring = new THREE.Mesh(ringGeo, ringMat);
              // make ring face camera roughly or spin it
              ring.rotation.x = Math.PI / 2;
              group.add(ring);
            }

            return group;
          }}
        />
      </div>

      {/* Side Panel for clicked node */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-4 right-4 w-72 glass-panel p-5 border-l-4"
            style={{ borderLeftColor: selectedNode.color }}
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-2 right-3 text-white/50 hover:text-white"
            >
              ×
            </button>
            <h3 className="font-orbitron font-bold text-lg text-white mb-1 pr-4 truncate">{selectedNode.name}</h3>
            <p className="font-space text-xs text-white/60 mb-4 inline-block px-2 py-0.5 bg-white/5 rounded">ID: {selectedNode.id}</p>
            
            {selectedNode.severity === 0 ? (
              <div className="flex items-center gap-2 text-[#00F5FF]">
                <Info className="w-5 h-5" />
                <span className="font-exo text-sm">System stable. No anomalies detected.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg flex items-start gap-3 ${selectedNode.severity === 100 ? 'bg-[#FF0055]/10 border border-[#FF0055]/30' : 'bg-[#FF6B00]/10 border border-[#FF6B00]/30'}`}>
                  {selectedNode.severity === 100 ? <ShieldAlert className="w-5 h-5 text-[#FF0055] shrink-0" /> : <AlertTriangle className="w-5 h-5 text-[#FF6B00] shrink-0" />}
                  <div>
                    <p className="font-orbitron text-sm font-bold text-white leading-none mb-1">{selectedNode.issue}</p>
                    <p className="font-exo text-xs text-white/70">Structural instability detected. Recommend containment.</p>
                  </div>
                </div>
                
                <button className="w-full text-xs py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 font-space transition-colors">
                  View Source Code
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
