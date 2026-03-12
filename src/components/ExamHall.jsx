import React, { useState } from 'react';
import { getAIResponse } from './Engine';

const ExamHall = ({ mockPaper, setMockPaper, isEngineReady, files }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // --- BUG FIX: THE TEXT FORMATTER ---
  // This function takes the raw AI text and translates its Markdown into actual HTML.
  const formatPaperText = (text) => {
    if (!text) return null;
    
    // Step 1: Split the text wherever there is a "new line" (\n)
    return text.split('\n').map((line, index) => {
      
      // Step 2: Look for **bold** text and wrap it in a React <strong> tag
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // slice(2, -2) removes the two asterisks from the start and end
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part; // Return normal text as-is
      });

      // Step 3: Wrap the finished line in a paragraph tag with some margin
      return (
        <p key={index} style={{ minHeight: '1.2rem', margin: '0.5rem 0', lineHeight: '1.6' }}>
          {formattedLine}
        </p>
      );
    });
  };

  const generateMockPaper = async () => {
    if (!isEngineReady || files.length === 0) {
      alert("Please upload study materials (PDF/Images) first!");
      return;
    }

    setIsGenerating(true);
    
    const prompt = "Based on the uploaded materials, generate a Mock Exam Paper with 5 important questions and their marking scheme.";
    const context = files.map(f => f.content).join("\n");
    const instructions = "You are an Exam Moderator. Create a balanced paper with Easy, Medium, and Hard questions.";

    try {
      // NOTE: We pass `true` as the 4th argument so the Exam Hall always uses 
      // the fast Online API to generate the heavy mock paper!
      const result = await getAIResponse(prompt, instructions, context, true);
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
            {isGenerating ? "Generating Paper... ⏳" : "Start Paper Generation"}
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
          
          {/* BUG FIX: We removed <pre> and use our new formatting function instead! */}
          <div className="paper-content formatted-paper">
            {formatPaperText(mockPaper)}
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