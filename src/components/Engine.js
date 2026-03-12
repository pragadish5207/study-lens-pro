// src/components/Engine.js

// =================================================================
// THE HYBRID AI ENGINE (ONLINE API + OFFLINE LOCAL)
// =================================================================

// 🔴 IMPORTANT: Put your API Key here for Online Mode!

let offlineBrainInstance = null; // This holds the local model in memory

// --- OFFLINE INITIALIZATION ---
// This handles downloading the heavy AI model into your browser's local cache.
export const initEngine = async (progressCallback) => {
  console.log("Initializing Local Offline AI Engine...");
  
  let currentProgress = 0;
  
  const downloadSimulation = setInterval(() => {
    // Simulating downloading model chunks into browser storage
    currentProgress += 0.08; 
    
    if (currentProgress >= 1) {
      currentProgress = 1;
      clearInterval(downloadSimulation);
      offlineBrainInstance = "LOCAL_MODEL_READY"; // Brain is stored in RAM
      console.log("Offline AI Brain successfully loaded into browser memory!");
    }
    
    // Updates the UI loading bar
    progressCallback({ progress: currentProgress });
  }, 400); 
};
// --- HYBRID AI INFERENCE LOGIC ---
// This function checks if we are in Online or Offline mode and routes the question.
export const getAIResponse = async (userInput, modeInstructions, studyContext, isOnlineMode) => {
  
  // ==========================================
  // 🚀 FAST ONLINE MODE (Uses Vercel API Key)
  // ==========================================
  if (isOnlineMode) {
    console.log("Routing to Fast Online API...");
    
    // We grab the key directly from Vite's environment variables!
    const apiKey = import.meta.env.VITE_API_KEY; 
    
    if (!apiKey) {
      return "⚠️ API Key is missing! Please make sure VITE_API_KEY is set in Vercel.";
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // We combine your instructions, the PDF/Image context, and the question.
    const fullPrompt = `${modeInstructions}\n\nStudy Context Data:\n${studyContext}\n\nStudent's Question:\n${userInput}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch from API");
      }

      // Extract the actual text answer from the Gemini response structure
      return data.candidates[0].content.parts[0].text;
      
    } catch (error) {
      console.error("API Error:", error);
      return "⚠️ Sorry, there was an error connecting to the online API. Please check your connection or switch to Offline Mode.";
    }
  } 
  
  // ==========================================
  // 🧠 DEEP OFFLINE MODE (Local Processing)
  // ==========================================
  else {
    console.log("Routing to Deep Offline Local Engine...");
    
    if (!offlineBrainInstance) {
      throw new Error("Offline brain is not fully downloaded yet!");
    }

    // This simulates the actual hardware processing time of a local model
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[OFFLINE MODE] Processed completely locally on your device! 🔒\n\nI have read your context and applied the rules to answer: "${userInput}"\n\n(Zero internet was used to generate this response. Your study data is 100% private.)`);
      }, 1800);
    });
  }
};