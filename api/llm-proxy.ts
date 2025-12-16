// Vercel Serverless Function - LLM Proxy to bypass CORS
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider, apiKey, model, systemPrompt, userPrompt, baseUrl } = req.body;

  if (!provider || !apiKey || !model) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    let response;

    if (provider === 'gemini') {
      // Handle Gemini with Google SDK
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model: model,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      });
      
      const result = await geminiModel.generateContent(userPrompt);
      const text = result.response.text();
      return res.status(200).json({ content: text });
      
    } else {
      // Handle OpenAI-compatible providers (Qwen, Kimi, DeepSeek, etc.)
      let endpoint = baseUrl || '';
      
      // Auto-append path if missing
      if (!endpoint.includes('/chat/completions')) {
        if (endpoint.includes('bigmodel.cn') && !endpoint.includes('/api/paas/v4')) {
          endpoint = `${endpoint.replace(/\/$/, '')}/api/paas/v4/chat/completions`;
        } else {
          endpoint = `${endpoint.replace(/\/$/, '')}/chat/completions`;
        }
      }

      const requestBody: any = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        stream: false
      };

      // Only add response_format for OpenAI
      if (endpoint.includes('openai.com')) {
        requestBody.response_format = { type: "json_object" };
      }

      const fetchResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json().catch(() => ({}));
        throw new Error(`API Error: ${fetchResponse.status} - ${errorData.error?.message || fetchResponse.statusText}`);
      }

      const data = await fetchResponse.json();
      const content = data.choices?.[0]?.message?.content || "";
      return res.status(200).json({ content });
    }
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    });
  }
}
