const OpenAI = require("openai");

let client = null;
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("your_actual_api_key_here")) {
  try {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (err) {
    console.error("OpenAI initialization error:", err.message);
  }
}

// Fallback intelligent prompt generator for seamless operation
function generateFallbackPrompt(request, type, category = "AI") {
  const cleanReq = request.trim();

  if (type === "Improve") {
    return `Act as an expert ${category || "domain"} specialist and consultant.

Objective:
${cleanReq}

Instructions:
1. Provide a comprehensive, step-by-step solution addressing the core requirements with maximum precision.
2. Detail key architectural or conceptual decisions, highlighting trade-offs and best practices.
3. Include concrete, production-ready examples and structured implementation steps.
4. Highlight common pitfalls, edge cases, and optimization strategies.

Output Format:
- Summary & Executive Overview
- Detailed Step-by-Step Breakdown
- Practical Implementation / Example Code
- Verification & Best Practice Checklist`;
  }

  if (type === "Rewrite") {
    return `Act as a senior professional advisor in ${category || "General Studies"}.

Context & Task:
Please address the following requirement with technical rigor and clarity:
"${cleanReq}"

Requirements:
- Structure your response logically using clear markdown headers and bullet points.
- Maintain an authoritative, professional, and accessible tone.
- Clarify any underlying assumptions before presenting conclusions.
- Provide actionable next steps or recommendations.`;
  }

  // Default: "Generate"
  return `You are an elite AI assistant specializing in ${category || "technology and productivity"}.

Task:
${cleanReq}

Guidelines:
1. Deconstruct the problem thoroughly before proposing solutions.
2. Deliver clean, modular, and well-explained solutions with complete clarity.
3. Include real-world examples, practical scenarios, or runnable code where applicable.
4. Mention performance considerations, security implications, and scalability best practices.

Constraints:
- Be concise yet comprehensive.
- Avoid generic placeholders; provide concrete recommendations.`;
}

const generatePrompt = async (req, res) => {
  try {
    const { request, type = "Generate", category = "AI" } = req.body;

    if (!request || !request.trim()) {
      return res.status(400).json({
        message: "Request is required.",
      });
    }

    let systemInstructions;

    if (type === "Improve") {
      systemInstructions =
        "You are an expert prompt engineer. Improve the user's idea into an exceptionally clear, highly effective, structured AI prompt. Return only the improved prompt text with no conversational filler.";
    } else if (type === "Rewrite") {
      systemInstructions =
        "You are an expert prompt engineer. Rewrite the user's idea as a standardized, professional, role-based AI system prompt while preserving the original intent. Return only the rewritten prompt text.";
    } else {
      systemInstructions =
        "You are an expert prompt engineer. Create a comprehensive, clear, detailed, and reusable AI prompt based on the user's request. Return only the generated prompt text.";
    }

    // Try OpenAI API if client is available
    if (client) {
      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstructions },
            { role: "user", content: `Category: ${category}\nTask: ${request.trim()}` },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const generatedText = response.choices?.[0]?.message?.content?.trim();
        if (generatedText) {
          return res.json({
            result: generatedText,
            source: "openai",
          });
        }
      } catch (apiError) {
        console.warn(
          "OpenAI API call failed (e.g. quota, network, or billing). Falling back to smart prompt engine:",
          apiError.message
        );
      }
    }

    // Graceful smart prompt fallback
    const fallbackResult = generateFallbackPrompt(request, type, category);

    return res.json({
      result: fallbackResult,
      source: "prompt-engine",
    });
  } catch (error) {
    console.error("AI Generation controller error:", error);

    res.status(500).json({
      message: error.message || "Unable to generate the AI prompt.",
    });
  }
};

module.exports = {
  generatePrompt,
};