import React, { useState } from 'react';
import { getAIResponse } from './Engine';

const ExamHall = ({ mockPaper, setMockPaper, isEngineReady, files }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMockPaper = async () => {
    if (!isEngineReady || files.length === 0) {
      alert("Please upload study materials (PDF/Images) first!");
      return;
    }

    setIsGenerating(true);
    
    // We tell the offline brain to specifically create an exam paper
    const prompt = "Based on the uploaded materials, generate a Mock Exam Paper with 5 important questions and their marking scheme.";
    const context = files.map(f => f.content).join("\n");
    const instructions = "You are an Exam Moderator. Create a balanced paper with Easy, Medium, and Hard questions.";

    try {
      const result = await getAIResponse(prompt, instructions, context);
      setMockPaper(result);
    } catch (error) {
      console.error("Exam generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="exam-hall-container">
      {/* Introduction Card */}
      {!mockPaper && (
        <div className="exam-intro-card">
          <div className="exam-icon-large">🎯</div>
          <h3>Generate Mock Paper</h3>
          <p>The AI will analyze your uploaded materials to create a custom practice exam tailored to your syllabus.</p>
          
          <button 
            className={`generate-paper-btn ${isGenerating ? 'loading' : ''}`}
            onClick={generateMockPaper}
            disabled={isGenerating || !isEngineReady}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Paper...
              </>
            ) : "Start Paper Generation"}
          </button>
          
          {files.length === 0 && (
            <p className="warning-text">⚠️ No materials found. Upload a syllabus or notes first.</p>
          )}
        </div>
      )}

      {/* The Actual Paper View */}
      {mockPaper && (
        <div className="mock-paper-view">
          <div className="paper-header">
            <h4>Practice Exam Paper</h4>
            <button className="reset-paper-btn" onClick={() => setMockPaper(null)}>
              New Paper
            </button>
          </div>
          
          <div className="paper-content">
            <pre>{mockPaper}</pre>
          </div>
          
          <div className="paper-footer">
            <p>Tip: Solve this in Exam Mode for the best results.</p>
            <button className="print-btn" onClick={() => window.print()}>
              🖨️ Print Paper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamHall;