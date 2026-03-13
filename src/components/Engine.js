// src/components/Engine.js
import { CreateMLCEngine } from "@mlc-ai/web-llm";
// =================================================================
// THE HYBRID AI ENGINE (ONLINE API + OFFLINE LOCAL)
// =================================================================

// 🔴 IMPORTANT: Put your API Key here for Online Mode!

let offlineBrainInstance = null; // This holds the local model in memory

// --- DYNAMIC MODEL DISCOVERY (Future-Proofing) ---
// Auto-discovers the newest, fastest Gemini model available on Google's servers
async function getBestAvailableModel(apiKey) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    // Filter to find models that can generate text AND are built for speed ("flash")
    // Filter to find models that can generate text, are built for speed ("flash"),
    // AND explicitly block specialized image/preview models that have zero free quota.
    const availableModels = data.models.filter(m => 
      m.supportedGenerationMethods && 
      m.supportedGenerationMethods.includes('generateContent') && 
      m.name.includes('flash') &&
      !m.name.includes('image') && // 👈 THIS BLOCKS THE IMAGE MODEL
      !m.name.includes('vision')   // 👈 THIS BLOCKS OLD VISION MODELS
    );
    
    // Grab the newest one from the list
    if (availableModels.length > 0) {
      const bestModel = availableModels[availableModels.length - 1].name;
      console.log("Auto-selected model for Study-Lens Pro:", bestModel);
      return bestModel; 
    }
    
    // Fallback just in case the fetch fails
    return "models/gemini-2.5-flash"; 
  } catch (error) {
    console.error("Failed to fetch model list, using fallback.", error);
    return "models/gemini-2.5-flash";
  }
}

// --- OFFLINE INITIALIZATION ---
// This handles downloading the heavy AI model into your browser's local cache.
// --- TRUE OFFLINE INITIALIZATION (WebLLM & WebGPU) ---
// This downloads a real 1GB+ AI model into your browser's IndexedDB cache.
// It only downloads fully the first time! After that, it loads from cache.

const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC"; 

export const initEngine = async (progressCallback) => {
  console.log("Initializing True Local Offline AI Engine...");
  
  try {
    offlineBrainInstance = await CreateMLCEngine(
      SELECTED_MODEL,
      {
        initProgressCallback: (progressData) => {
          console.log(progressData.text); // Logs the actual download MBs in the console!
          // WebLLM provides progress from 0.0 to 1.0, which perfectly matches our UI!
          progressCallback({ progress: progressData.progress });
        }
      }
    );
    console.log("True Offline AI Brain successfully loaded into GPU memory!");
  } catch (error) {
    console.error("Failed to load the local AI model. Your device might not support WebGPU.", error);
    // Fallback so the UI doesn't freeze forever if their hardware fails
    progressCallback({ progress: 1 }); 
  }
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

    // 1. Dynamically find the best model name first
    const bestModelName = await getBestAvailableModel(apiKey);

    // 2. Inject that exact name dynamically into the URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${bestModelName}:generateContent?key=${apiKey}`;
    
    const fullPrompt = `
🚨 STRICT SYSTEM DIRECTIVE 🚨
You are an advanced AI tutor. You MUST format your response EXACTLY according to the active mode rules below. If the mode requires bullet points, short answers, or a specific teaching style, YOU MUST OBEY IT. Do not output a standard paragraph if the mode asks for something else!

[ACTIVE MODE RULES]:
${modeInstructions}

[CONTEXT MATERIALS]:
${studyContext ? studyContext : "No uploaded documents."}

[STUDENT'S QUESTION]:
${userInput}
`;

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
  // 🧠 TRUE DEEP OFFLINE MODE (Local WebLLM)
  // ==========================================
  else {
    console.log("Routing to True Deep Offline Local Engine...");
    
    // Check if the engine is actually loaded and isn't just our old placeholder string
    if (!offlineBrainInstance || typeof offlineBrainInstance === 'string') {
      return "⚠️ Offline brain is still downloading or hasn't been initialized yet. Please wait for the loading bar to finish!";
    }

    try {
      // WebLLM uses a standard message format (System + User)
      const systemPrompt = `You are a helpful AI tutor.\n\nRULES:\n${modeInstructions}\n\nCONTEXT:\n${studyContext}`;
      
      const reply = await offlineBrainInstance.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput }
        ],
        temperature: 0.7, // Balances creativity and accuracy
      });

      // We add a little tag so you know it's the real local model working!
      return "🔒 [TRUE OFFLINE] " + reply.choices[0].message.content;
      
    } catch (error) {
      console.error("Local AI generation failed:", error);
      return "⚠️ Sorry, your device ran out of memory trying to run the local AI, or the model failed to load.";
    }
  }
};