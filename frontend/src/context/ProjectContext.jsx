import React, { createContext, useState, useContext, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projectData, setProjectData] = useState({
        global_health: 0,
        security_score: 0,
        maintainability_score: 0,
        issues_open: 0,
        issues_fixed: 0,
        complexity: "N/A",
        graph_nodes: [],
        graph_links: []
    });

    // Initial Default Snippets
    const defaultFiles = {
        'UserManager.java': {
            language: 'java',
            filename: 'UserManager.java',
            code: `public class UserManager {
    // God Class Code Smell detected
    private Database db;
    private EmailService email;
    private Logger logger;
    private PaymentGateway payment;
    private Analytics analytics;

    public void registerUser(User user) {
        if (user.getName() == null) {
            // Hardcoded secret scent
            String secret = "AWS_KEY_12345"; 
            logger.log("Invalid user");
            return;
        }
        db.save(user); // SQL Injection risk potentially here
        email.sendWelcome(user);
    }
}`
        },
        'data_processor.py': {
            language: 'python',
            filename: 'data_processor.py',
            code: `def process_data(data):
    # Shotgun Surgery risk: changing this requires changes in 5 other files
    if not data:
        return None
    
    result = []
    for item in data:
        # Complexity hotspot
        if item.type == 'A':
            if item.value > 100:
                result.append(transform_a(item))
            else:
                result.append(discard(item))
        elif item.type == 'B':
             result.append(transform_b(item))
    
    return result`
        }
    };

    const [files, setFiles] = useState(defaultFiles);
    const [activeFilename, setActiveFilename] = useState('UserManager.java');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Fetch initial health data
    const fetchSystemHealth = async () => {
        try {
            const response = await fetch('http://localhost:8000/system-health');
            const data = await response.json();
            setProjectData(data);
        } catch (error) {
            console.error("Failed to fetch system health:", error);
        }
    };

    useEffect(() => {
        fetchSystemHealth();
        // Poll every 30s to keep alive, but relying mostly on user action
        const interval = setInterval(fetchSystemHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const runAnalysis = async (fileContent, filename) => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: "java", // Auto-detect in future
                    code: fileContent,
                    filename: filename
                })
            });
            const result = await response.json();
            setAnalysisResults(result);

            // Re-fetch global health as the backend state has updated
            await fetchSystemHealth();
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const addFile = (fileObj) => {
        setFiles(prev => ({ ...prev, [fileObj.filename]: fileObj }));
        setActiveFilename(fileObj.filename);
        runAnalysis(fileObj.code, fileObj.filename);
    };

    const removeFile = (filename) => {
        setFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[filename];

            // Handle if active file is deleted
            if (activeFilename === filename) {
                const remainingKeys = Object.keys(newFiles);
                if (remainingKeys.length > 0) {
                    // Switch to first available
                    const nextFile = newFiles[remainingKeys[0]];
                    setActiveFilename(nextFile.filename);
                    runAnalysis(nextFile.code, nextFile.filename);
                } else {
                    setActiveFilename(null);
                    setAnalysisResults(null);
                }
            }
            return newFiles;
        });
    };

    return (
        <ProjectContext.Provider value={{
            projectData,
            analysisResults,
            runAnalysis,
            isAnalyzing,
            files,
            activeFilename,
            setActiveFilename,
            addFile,
            removeFile
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);
