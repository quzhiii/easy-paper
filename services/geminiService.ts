
import { EvaluationInput, EvaluationResult, Language, UserSettings } from "../types";
import { generateLLMResponse } from "./llmService";

const mapLanguageToPrompt = (lang: Language) => lang === 'zh' ? 'Chinese (Simplified) and ONLY Chinese' : 'English';

const cleanJson = (text: string): string => {
  if (!text) return "{}";

  // 1. Remove Markdown Code Blocks (Standard)
  let clean = text.replace(/```json\s*/g, '').replace(/```/g, '');
  
  // 2. Locate JSON boundaries (find outermost braces strictly)
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  
  if (start !== -1 && end !== -1 && end > start) {
    clean = clean.substring(start, end + 1);
  } else {
    // Fallback logic handled by caller or repair
  }

  // 3. Remove single-line comments (risky but handles some LLM outputs)
  clean = clean.replace(/^\s*\/\/.*$/gm, '');

  return clean;
};

// Helper to repair common JSON string issues like unescaped newlines
const repairJsonString = (jsonStr: string): string => {
  let inString = false;
  let fixed = '';
  let i = 0;
  
  while (i < jsonStr.length) {
    const char = jsonStr[i];
    
    // Check for quote (toggle string state if not escaped)
    if (char === '"' && (i === 0 || jsonStr[i - 1] !== '\\')) {
      inString = !inString;
    }
    
    // If inside string, escape newlines and tabs
    if (inString) {
      if (char === '\n') {
        fixed += '\\n';
      } else if (char === '\r') {
        // Skip CR
      } else if (char === '\t') {
        fixed += '\\t';
      } else {
        fixed += char;
      }
    } else {
      fixed += char;
    }
    i++;
  }
  return fixed;
};

export const evaluateResearchTopic = async (
  input: EvaluationInput,
  language: Language,
  settings: UserSettings
): Promise<EvaluationResult> => {

  const schemaStructure = {
    metadata: {
      project_id: "string",
      version: "string",
      generated_at: "string",
      model_used: "string",
      user_input_summary: "string",
      assumptions: "string",
      confidence_overall: "High | Medium | Low",
      confidence_reason: ["string"]
    },
    evidence_trace: {
      status: "complete | partial | missing",
      search_sources: ["string"],
      search_time_window: "string",
      queries: { en: "string", zh: "string" },
      hits_count: { "source_name": "number" },
      screening_rule: "string",
      key_references: [{
        title: "string",
        year: "string",
        journal: "string",
        relevance_note: "string",
        link: "string",
        doi: "string"
      }]
    },
    executive_summary: {
      research_question: "string",
      hypothesis_primary: "string",
      hypothesis_secondary: "string",
      why_it_matters: ["string"],
      novelty_claims: [{ claim: "string", status: "Verified | Unverified | Partial", evidence: "string" }],
      scores: {
        novelty: 0,
        feasibility: 0,
        value: 0
      },
      score_rationales: {
        novelty: ["string"],
        feasibility: ["string"],
        value: ["string"]
      },
      bottom_line: "Recommended | Not Recommended | Conditional",
      next_steps: ["string"]
    },
    methodology: {
      pico: { P: "string", E: "string", C: "string", O: "string" },
      estimand: {
        primary: "string",
        treatment_assignment: "string",
        time_zero: "string",
        follow_up: "string"
      },
      candidate_designs: [{
        name: "string",
        type: "Primary | Alternative",
        description: "string",
        data_requirement: "string",
        key_assumptions: "string",
        threats: "string",
        diagnostics: "string",
        python_code: "string (single line with \\n)"
      }],
      dag: {
        nodes: ["string"],
        mermaid_code: "string",
        adjustment_set: ["string"],
        do_not_adjust: ["string"]
      },
      model_specification: {
        formula: "string (LaTeX)",
        se_clustering: "string",
        fixed_effects: "string",
        weights: "string",
        missing_data_strategy: "string"
      },
      robustness_checks: [{ name: "string", description: "string", threshold: "string" }]
    },
    refined_topics: [{
      title: "string",
      one_sentence_rq: "string",
      estimand: "string",
      design: "string",
      data_gate: "string",
      risk_level: "Low | Medium | High",
      risk_reason: "string",
      publishability: "string",
      why_better: ["string"]
    }],
    mvp_route: "string",
    high_standard_route: "string",
    journal_fit: [{
      name: "string",
      tier: "string",
      fit_reason: "string",
      similar_papers: ["string"],
      submission_requirements: "string",
      positioning_tip: "string",
      risk_notes: "string"
    }]
  };

  const hasUploads = input.references && input.references.length > 20;

  const systemPrompt = `
    You are a world-class Senior Research Methodologist and Chief Editor acting in "Expert Mode".
    Your goal is to generate a comprehensive "Research Design Pack" (JSON) for a PhD-level researcher.

    **CONFIGURATION**
    - **Language**: Output JSON VALUES in ${mapLanguageToPrompt(language)}. Keys must be English.
    - **Strict Constraint**: You must ONLY speak ${mapLanguageToPrompt(language)} in the content values.
    - **Mode**: ${input.enableOnlineSearch ? "HYBRID (Uploads + Internal Knowledge)" : "STRICT (Uploads ONLY)"}

    **CRITICAL RULES:**
    1. **EVIDENCE SOURCE TRUTHFULNESS (ZERO HALLUCINATION)**: 
       ${!input.enableOnlineSearch ? 
       `- **STRICT MODE ACTIVE (UPLOAD ONLY)**: 
        - You are RESTRICTED to the "USER UPLOADED BIBLIOGRAPHY".
        - **search_sources**: MUST be exactly ["User Uploaded Files"].
        - **queries**: MUST be set to "N/A (File Analysis)" for both en/zh.
        - **hits_count**: Set to {"User Files": number_of_refs}.
        - If bibliography is empty, set 'evidence_trace.status' to "missing".` 
       : 
       `- **HYBRID MODE ACTIVE (UPLOAD + ACADEMIC KNOWLEDGE)**: 
        - **PRIMARY SOURCE**: Analyze "User Uploaded Files" first.
        - **SECONDARY SOURCE**: Supplement with your internal academic knowledge base (e.g. PubMed/WoS corpus).
        - **CITATION RULE**: When citing external sources (not in uploads), they MUST be **REAL, EXISTING** academic papers.
        - **PROHIBITED**: DO NOT use the word "Simulated". DO NOT invent references.
        - **search_sources**: List actual sources used, e.g., ["User Uploaded Files", "PubMed", "CNKI"].`
       }

    2. **JSON SYNTAX SAFETY**:
       - **OUTPUT FORMAT**: Single valid JSON object. No markdown.
       - **ESCAPE CHARACTERS**: Escape double quotes inside strings.
       - **NO NEWLINES**: Use \\n in strings.
       - **PYTHON/MERMAID**: Single-line strings with \\n.

    3. **Methodology Depth**:
       - Provide at least TWO \`candidate_designs\`.
       - \`python_code\` must be specific to the Primary design.
       - Translate 'se_clustering' and 'fixed_effects'.

    **Output JSON Structure**:
    ${JSON.stringify(schemaStructure)}
  `;

  let userPrompt = `
    Topic: ${input.topic}
    Population: ${input.population}
    Data Available: ${input.data}
    Timeframe: ${input.timeframe} years
    Language Preference: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'} (MUST FOLLOW)
  `;

  if (hasUploads) {
      userPrompt += `
      
      ======================================================
      *** USER UPLOADED BIBLIOGRAPHY (Evidence Pack) ***
      The user has provided the following raw reference text. 
      Please parse these entries and use them to support your analysis.
      ======================================================
      
      ${input.references}
      
      ======================================================
      `;
  } else if (!input.enableOnlineSearch) {
      userPrompt += `
      
      *** WARNING: NO UPLOADS PROVIDED AND ONLINE SEARCH IS DISABLED ***
      The user has strictly disabled online search but provided no files.
      You must report that evidence is missing, but proceed with Methodological Design based on the topic.
      `;
  }

  // Force language again at the end of prompt for stubborn models
  userPrompt += `\n\nREMINDER: ALL VALUE FIELDS IN THE JSON MUST BE IN ${language === 'zh' ? 'SIMPLIFIED CHINESE' : 'ENGLISH'}.`;

  try {
    // Pass enableSearch flag to LLM service for potential future tool usage, 
    // though currently we rely on Prompt engineering for JSON stability.
    const responseText = await generateLLMResponse({
      systemPrompt,
      userPrompt,
      settings
    });

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const cleanedText = cleanJson(responseText);
    
    try {
      return JSON.parse(cleanedText) as EvaluationResult;
    } catch (parseError) {
      console.warn("Initial JSON Parse Failed. Attempting repair...", parseError);
      try {
        const repairedText = repairJsonString(cleanedText);
        return JSON.parse(repairedText) as EvaluationResult;
      } catch (repairError) {
         console.error("JSON Repair Failed:", repairError);
         console.log("Failed Text Snippet:", cleanedText.slice(0, 500));
         throw new Error(`Evaluation logic failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    }
  } catch (error) {
    console.error("Evaluation logic failed:", error);
    throw error;
  }
};
