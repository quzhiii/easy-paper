
import { GoogleGenAI } from "@google/genai";
import { LLMProviderId, UserSettings } from "../types";

// Default Models
export const DEFAULT_MODELS = {
  qwen: 'qwen-turbo',
  kimi: 'moonshot-v1-8k',
  gemini: 'gemini-2.5-flash',
  deepseek: 'deepseek-v3.2',
  zhipu: 'glm-4.6',
  openai: 'gpt-5.2'
};

// Available Models for Dropdown
export const PROVIDER_MODELS = {
  qwen: [
    { value: 'qwen-turbo', label: 'Qwen Turbo (Default - Fast & Cheap)' },
    { value: 'qwen-plus', label: 'Qwen Plus (Balanced)' },
    { value: 'qwen-max', label: 'Qwen Max (Best Performance)' },
    { value: 'qwen-long', label: 'Qwen Long (Long Context)' },
  ],
  kimi: [
    { value: 'moonshot-v1-8k', label: 'Moonshot V1 8k' },
    { value: 'moonshot-v1-32k', label: 'Moonshot V1 32k' },
    { value: 'moonshot-v1-128k', label: 'Moonshot V1 128k' },
    { value: 'moonshot-k2', label: 'Moonshot K2 (Latest)' },
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-3-pro-preview', label: 'Gemini 3.0 Pro Preview' },
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Exp' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek V3' },
    { value: 'deepseek-v3.2', label: 'DeepSeek V3.2 (Latest)' },
    { value: 'deepseek-reasoner', label: 'DeepSeek R1 (Reasoner)' },
  ],
  zhipu: [
    { value: 'glm-4-flash', label: 'GLM-4 Flash (Fast)' },
    { value: 'glm-4-plus', label: 'GLM-4 Plus' },
    { value: 'glm-4-air', label: 'GLM-4 Air' },
    { value: 'glm-4.6', label: 'GLM-4.6 (Latest)' },
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-5.1', label: 'GPT-5.1 (Preview)' },
    { value: 'gpt-5.2', label: 'GPT-5.2 (Latest)' },
    { value: 'gpt-5.2-thinking', label: 'GPT-5.2 Thinking' },
  ]
};

// Default Endpoints
export const DEFAULT_ENDPOINTS = {
  qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  kimi: 'https://api.moonshot.cn/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com',
  deepseek: 'https://api.deepseek.com/chat/completions',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions'
};

// --- API Calls ---

interface GenerateParams {
  systemPrompt: string;
  userPrompt: string;
  settings: UserSettings;
}

// Qwen, Kimi, DeepSeek, Zhipu, OpenAI (OpenAI Compatible)
const callOpenAICompatible = async (
  endpoint: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
) => {
  let finalEndpoint = endpoint;
  // Auto-append path if missing for standard endpoints (simple heuristic)
  // Most providers use /chat/completions, but users might paste base URL only
  if (!endpoint.includes('/chat/completions') && !endpoint.includes('googleapis')) {
     // Special case for Zhipu which has a deeper path structure often pasted partially
     if (endpoint.includes('bigmodel.cn') && !endpoint.includes('/api/paas/v4')) {
         finalEndpoint = `${endpoint.replace(/\/$/, '')}/api/paas/v4/chat/completions`;
     } else {
         finalEndpoint = `${endpoint.replace(/\/$/, '')}/chat/completions`;
     }
  }

  try {
      // Build request body
      const requestBody: any = {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          stream: false
      };

      // Only add response_format for OpenAI (GPT models)
      if (endpoint.includes('openai.com')) {
          requestBody.response_format = { type: "json_object" };
      }

      const response = await fetch(finalEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMsg = err.error?.message || err.message || response.statusText;
        throw new Error(`API Error (${response.status}): ${errorMsg}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
  } catch (error: any) {
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError' || error.message?.includes('NetworkError')) {
           throw new Error("Network Error: Could not connect to API. This is usually caused by: (1) CORS restrictions - you may need to use a proxy or backend service; (2) Incorrect API endpoint; (3) Network connectivity issues. Please check your API configuration.");
      }
      throw error;
  }
};

// Gemini
const callGemini = async (apiKey: string, model: string, baseUrl: string, systemPrompt: string, userPrompt: string) => {
  const clientOptions: any = { apiKey };
  if (baseUrl && baseUrl !== DEFAULT_ENDPOINTS.gemini) {
      clientOptions.baseUrl = baseUrl;
  }

  const ai = new GoogleGenAI(clientOptions);
  
  // Try non-streaming first for better CORS compatibility
  try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      });

      const fullText = response.response?.text() || "";
      return fullText;
  } catch (error: any) {
      // Handle GoogleGenAI specific error structures or network errors
      const errorMessage = error.message || error.toString();
      
      // Check for common network/CORS errors
      if (errorMessage.includes('0') || errorMessage.includes('fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('CORS')) {
          throw new Error("Gemini Connection Failed: This is likely a CORS issue. Gemini API requires server-side calls or proper CORS configuration. Solutions: (1) Use a backend proxy server; (2) Try a different provider; (3) Check your API key and endpoint.");
      }
      
      // Check for API key issues
      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('401') || errorMessage.includes('403')) {
          throw new Error(`Gemini API Key Error: ${errorMessage}. Please verify your API key in Settings.`);
      }
      
      // If it's a structured error from SDK
      if (error.statusText) {
          throw new Error(`Gemini API Error: ${error.statusText} (${error.status || 'unknown'})`);
      }
      
      throw new Error(`Gemini Error: ${errorMessage}`);
  }
};

// --- Main Service Function ---

export const generateLLMResponse = async ({ systemPrompt, userPrompt, settings }: GenerateParams): Promise<string> => {
  
  const provider = settings.provider;
  const apiKey = settings.keys[provider];
  
  if (!apiKey) {
      throw new Error("Missing API Key. Please configure it in Settings.");
  }

  let modelName = settings.models[provider];
  if (!modelName) modelName = DEFAULT_MODELS[provider];

  let endpoint = settings.baseUrls[provider];
  if (!endpoint) endpoint = DEFAULT_ENDPOINTS[provider];

  // Check if we're in production (Vercel/deployed) and should use proxy
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const useProxy = isProduction || provider === 'gemini';

  let text = "";
  try {
    if (useProxy) {
      // Use Vercel serverless function proxy
      const proxyEndpoint = '/api/llm-proxy';
      const response = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          apiKey,
          model: modelName,
          systemPrompt,
          userPrompt,
          baseUrl: endpoint
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Proxy error: ${response.status}`);
      }

      const data = await response.json();
      text = data.content || "";
    } else {
      // Direct call (development mode for non-Gemini providers)
      switch (provider) {
        case 'qwen':
        case 'kimi':
        case 'deepseek':
        case 'zhipu':
        case 'openai':
          text = await callOpenAICompatible(endpoint, apiKey, modelName, systemPrompt, userPrompt);
          break;
        case 'gemini':
          text = await callGemini(apiKey, modelName, endpoint, systemPrompt, userPrompt);
          break;
        default:
          throw new Error("Unsupported provider");
      }
    }
  } catch (error: any) {
    if (error.message?.includes('401') || error.message?.includes('403')) {
      throw new Error("Invalid API Key. Please check your credentials.");
    }
    throw error;
  }

  return text;
};
