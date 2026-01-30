import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useProject } from '../context/ProjectContext';
import { Loader2 } from 'lucide-react';

const GraphView = () => {
    const { projectData } = useProject();
    const fgRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        const updateDims = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener('resize', updateDims);
        updateDims();
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force('charge').strength(-100);
        }
    }, []);

    // Transform backend data to graph format if needed
    // Assuming backend returns { id, complexity } for nodes
    const graphData = {
        nodes: projectData?.graph_nodes.map(n => ({ ...n, val: n.complexity * 2 })) || [],
        links: projectData?.graph_links || []
    };

    if (!projectData || projectData.graph_nodes.length === 0) {
        return (
            <div className="p-8 h-[calc(100vh-2rem)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin text-lumina-accent-cyan" />
                    <span className="text-lumina-text-secondary">Waiting for Analysis Data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-700">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Code Property Graph</h1>
                <p className="text-lumina-text-secondary">Visualizing dependency complexity & hotspots</p>
            </div>

            <div className="flex-1 glass-panel overflow-hidden relative" ref={containerRef}>
                <div className="absolute top-4 left-4 z-10 glass-panel p-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs text-slate-300">High Complexity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-xs text-slate-300">Warning</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-slate-300">Stable</span>
                        </div>
                    </div>
                </div>

                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel="id"
                    nodeColor={node => {
                        if (node.complexity > 4) return '#ef4444'; // Red
                        if (node.complexity > 2) return '#f59e0b'; // Orange
                        return '#3b82f6'; // Blue
                    }}
                    nodeRelSize={6}
                    linkColor={() => "rgba(148, 163, 184, 0.2)"}
                    backgroundColor="rgba(0,0,0,0)"
                    d3AlphaDecay={0.02}
                    d3VelocityDecay={0.3}
                />
            </div>
        </div>
    );
};

export default GraphView;
