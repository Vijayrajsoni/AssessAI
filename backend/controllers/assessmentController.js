const fs = require("fs");
const path = require("path");

const Project = require("../models/Project");

const ai = require("../config/gemini");
const groq = require("../config/groq");

const pdfParseModule = require("pdf-parse");

// ======================================================
// PDF TEXT EXTRACTION
// ======================================================

const extractPdfText = async (pdfPath) => {
  let parser = null;

  try {
    console.log("=================================");
    console.log("📄 STARTING PDF EXTRACTION");
    console.log("📄 PDF Path:", pdfPath);
    console.log("=================================");

    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file does not exist.");
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    console.log("📄 PDF Size:", pdfBuffer.length, "bytes");

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF file is empty.");
    }

    // pdf-parse V2
    if (pdfParseModule.PDFParse) {
      parser = new pdfParseModule.PDFParse({
        data: pdfBuffer,
      });

      const result = await parser.getText();

      const text = result?.text?.trim() || "";

      console.log("✅ PDF extraction completed");
      console.log("📄 Extracted Characters:", text.length);

      if (!text) {
        throw new Error(
          "Could not extract readable text from the PDF."
        );
      }

      return text;
    }

    // Legacy pdf-parse support
    if (typeof pdfParseModule === "function") {
      const result = await pdfParseModule(pdfBuffer);

      const text = result?.text?.trim() || "";

      console.log("✅ PDF extraction completed");
      console.log("📄 Extracted Characters:", text.length);

      if (!text) {
        throw new Error(
          "Could not extract readable text from the PDF."
        );
      }

      return text;
    }

    throw new Error(
      "pdf-parse library could not be initialized."
    );
  } catch (error) {
    console.error("=================================");
    console.error("❌ PDF EXTRACTION FAILED");
    console.error("❌ Error:", error);
    console.error("❌ Message:", error.message);
    console.error("=================================");

    throw new Error(
      `PDF processing failed: ${error.message}`
    );
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error(
          "⚠️ PDF parser cleanup error:",
          destroyError.message
        );
      }
    }
  }
};

// ======================================================
// GEMINI ERROR HANDLER
// ======================================================

const generateGeminiAssessment = async (requestData) => {
  try {
    console.log("=================================");
    console.log("🟡 Sending request to Gemini...");
    console.log("=================================");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing in .env"
      );
    }

    const response =
      await ai.models.generateContent(requestData);

    console.log("✅ Gemini response received");

    return response;
  } catch (error) {
    const message = String(
      error?.message || ""
    );

    console.error("❌ Gemini Error:");
    console.error(message);

    // Daily quota
    if (
      message.includes(
        "GenerateRequestsPerDayPerProject-FreeTier"
      ) ||
      message.includes(
        "generate_content_free_tier_requests"
      ) ||
      message.includes(
        "GenerateRequestsPerDayPerProjectPerModel-FreeTier"
      )
    ) {
      const quotaError = new Error(
        "AI_DAILY_QUOTA_EXCEEDED"
      );

      quotaError.code =
        "AI_DAILY_QUOTA_EXCEEDED";

      throw quotaError;
    }

    // Temporary rate limit
    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED")
    ) {
      const rateError = new Error(
        "AI_RATE_LIMITED"
      );

      rateError.code = "AI_RATE_LIMITED";

      throw rateError;
    }

    throw error;
  }
};

// ======================================================
// COMMON AI PROMPT
// ======================================================

const createAssessmentPrompt = ({
  projectTitle,
  projectAbstract,
  pdfText,
}) => {
  return `
You are an expert academic project evaluator for AssessAI.

Evaluate this student mini-project using ONLY the information provided below.

PROJECT TITLE:
${projectTitle}

PROJECT ABSTRACT:
${projectAbstract}

PROJECT REPORT TEXT:
${pdfText}

Evaluate these six criteria:

1. Documentation Quality
2. Project Completeness
3. Code Structure
4. Innovation
5. Technology Stack
6. Missing Modules

Give each criterion a score from 0 to 100.

Also provide:

- Exactly 3 strengths
- Exactly 4 improvements
- One final recommendation

IMPORTANT RULES:

- Scores must be numbers.
- Scores must be between 0 and 100.
- Do not return null.
- Do not invent features.
- Use only information available in the abstract and project report.
- Keep feedback academic and constructive.
- For Missing Modules, give a higher score when fewer important modules are missing.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap JSON inside code fences.

Return exactly this JSON structure:

{
  "documentationQuality": 0,
  "projectCompleteness": 0,
  "codeStructure": 0,
  "innovation": 0,
  "technologyStack": 0,
  "missingModules": 0,
  "strengths": [
    "",
    "",
    ""
  ],
  "improvements": [
    "",
    "",
    "",
    ""
  ],
  "recommendation": ""
}
`;
};

// ======================================================
// GROQ PRIMARY AI
// ======================================================

const generateGroqAssessment = async (prompt) => {
  try {
    console.log("=================================");
    console.log("🟢 Sending assessment request to Groq...");
    console.log("🤖 Model: openai/gpt-oss-120b");
    console.log("=================================");

    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is missing in .env"
      );
    }

    console.log(
      "📝 Prompt characters:",
      prompt.length
    );

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content:
              "You are an expert academic project evaluator. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        response_format: {
          type: "json_object",
        },

        // Keep output controlled.
        max_tokens: 1200,
      });

    const resultText =
      response?.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error(
        "Groq returned an empty response."
      );
    }

    console.log("✅ Groq response received");

    console.log("🤖 Groq Result:");
    console.log(resultText);

    return JSON.parse(resultText);
  } catch (error) {
    console.error("=================================");
    console.error("❌ GROQ ASSESSMENT FAILED");
    console.error("❌ Error:", error);
    console.error(
      "❌ Message:",
      error?.message
    );
    console.error("=================================");

    throw error;
  }
};

// ======================================================
// GEMINI FALLBACK
// ======================================================

const generateGeminiFallback = async ({
  projectTitle,
  projectAbstract,
  pdfBase64,
}) => {
  console.log("=================================");
  console.log(
    "🟡 Groq failed. Trying Gemini fallback..."
  );
  console.log("=================================");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing in .env"
    );
  }

  const prompt = `
You are an expert academic project evaluator for AssessAI.

Evaluate this student mini-project.

PROJECT TITLE:
${projectTitle}

PROJECT ABSTRACT:
${projectAbstract}

A project report PDF is attached.

Evaluate these six criteria:

1. Documentation Quality
2. Project Completeness
3. Code Structure
4. Innovation
5. Technology Stack
6. Missing Modules

Give each criterion a score from 0 to 100.

Also provide:

- Exactly 3 strengths
- Exactly 4 improvements
- One final recommendation

IMPORTANT:

- Scores must be numbers.
- Scores must be between 0 and 100.
- Do not return null.
- Do not invent features.
- Use only information available in the abstract and PDF.
- Keep feedback academic and constructive.
- Return only valid JSON.

Use this exact JSON structure:

{
  "documentationQuality": 0,
  "projectCompleteness": 0,
  "codeStructure": 0,
  "innovation": 0,
  "technologyStack": 0,
  "missingModules": 0,
  "strengths": [],
  "improvements": [],
  "recommendation": ""
}
`;

  const geminiRequest = {
    model: "gemini-3.7-flash",

    contents: [
      {
        role: "user",

        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
        ],
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          documentationQuality: {
            type: "number",
          },

          projectCompleteness: {
            type: "number",
          },

          codeStructure: {
            type: "number",
          },

          innovation: {
            type: "number",
          },

          technologyStack: {
            type: "number",
          },

          missingModules: {
            type: "number",
          },

          strengths: {
            type: "array",
            items: {
              type: "string",
            },
          },

          improvements: {
            type: "array",
            items: {
              type: "string",
            },
          },

          recommendation: {
            type: "string",
          },
        },

        required: [
          "documentationQuality",
          "projectCompleteness",
          "codeStructure",
          "innovation",
          "technologyStack",
          "missingModules",
          "strengths",
          "improvements",
          "recommendation",
        ],
      },
    },
  };

  const response =
    await generateGeminiAssessment(
      geminiRequest
    );

  let resultText = "";

  if (typeof response?.text === "function") {
    resultText = response.text();
  } else {
    resultText = response?.text || "";
  }

  resultText = String(resultText).trim();

  if (!resultText) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  console.log("🤖 Gemini Fallback Result:");
  console.log(resultText);

  return JSON.parse(resultText);
};

// ======================================================
// START AI ASSESSMENT
// ======================================================

const assessProject = async (req, res) => {
  const { projectId } = req.params;

  let project = null;

  try {
    console.log("");
    console.log("=================================");
    console.log("🚀 STARTING AI ASSESSMENT");
    console.log("📌 Project ID:", projectId);
    console.log("👤 User ID:", req.user.id);
    console.log("=================================");

    // ==================================================
    // FIND PROJECT
    // ==================================================

    project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.log(
      "📌 Project:",
      project.projectTitle
    );

    // ==================================================
    // PDF PATH
    // ==================================================

    const pdfPath = path.join(
      __dirname,
      "../uploads",
      project.reportFile
    );

    console.log(
      "📄 PDF Path:",
      pdfPath
    );

    // ==================================================
    // CHECK PDF
    // ==================================================

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "Report PDF not found",
      });
    }

    const pdfStats =
      fs.statSync(pdfPath);

    console.log(
      "📄 PDF Size:",
      pdfStats.size,
      "bytes"
    );

    // ==================================================
    // PROCESSING
    // ==================================================

    project.status = "Processing";

    await project.save();

    console.log(
      "🔄 Project status changed to Processing"
    );

    // ==================================================
    // READ PDF BASE64
    // ==================================================

    console.log(
      "📄 Reading PDF..."
    );

    const pdfBase64 = fs
      .readFileSync(pdfPath)
      .toString("base64");

    console.log(
      "✅ PDF converted to Base64"
    );

    // ==================================================
    // EXTRACT PDF TEXT
    // ==================================================

    const pdfText =
      await extractPdfText(pdfPath);

    console.log(
      "✅ PDF text extraction successful"
    );

    console.log(
      "📄 Total extracted characters:",
      pdfText.length
    );

    // ==================================================
    // LIMIT PDF TEXT
    // ==================================================

    // IMPORTANT:
    // Groq organization limit = 8000 TPM
    // Keep input safely below that limit.

    const MAX_PDF_CHARACTERS = 18000;

    const limitedPdfText =
      pdfText.length >
      MAX_PDF_CHARACTERS
        ? pdfText.substring(
            0,
            MAX_PDF_CHARACTERS
          ) +
          "\n\n[Report text truncated because it is very large.]"
        : pdfText;

    // ==================================================
    // LIMIT ABSTRACT
    // ==================================================

    const limitedAbstract =
      String(
        project.abstract || ""
      ).substring(0, 3000);

    console.log(
      "📄 PDF text used for Groq:",
      limitedPdfText.length,
      "characters"
    );

    console.log(
      "📝 Abstract used for Groq:",
      limitedAbstract.length,
      "characters"
    );

    console.log(
      "📦 Total source characters:",
      limitedPdfText.length +
        limitedAbstract.length
    );

    // ==================================================
    // CREATE PROMPT
    // ==================================================

    const prompt =
      createAssessmentPrompt({
        projectTitle:
          String(
            project.projectTitle || ""
          ).substring(0, 500),

        projectAbstract:
          limitedAbstract,

        pdfText:
          limitedPdfText,
      });

    console.log(
      "📝 Final Groq prompt characters:",
      prompt.length
    );

    // ==================================================
    // GROQ PRIMARY → GEMINI FALLBACK
    // ==================================================

    let result = null;
    let aiProvider = "";

    let groqErrorMessage = "";
    let geminiErrorMessage = "";

    // ==================================================
    // TRY GROQ
    // ==================================================

    try {
      result =
        await generateGroqAssessment(
          prompt
        );

      aiProvider = "Groq";

      console.log(
        "🟢 Assessment generated using Groq"
      );
    } catch (groqError) {
      groqErrorMessage =
        groqError?.message ||
        String(groqError);

      console.error(
        "❌ Groq failed:",
        groqErrorMessage
      );

      // ==================================================
      // TRY GEMINI
      // ==================================================

      try {
        result =
          await generateGeminiFallback({
            projectTitle:
              project.projectTitle,

            projectAbstract:
              limitedAbstract,

            pdfBase64,
          });

        aiProvider = "Gemini";

        console.log(
          "🟡 Assessment generated using Gemini fallback"
        );
      } catch (geminiError) {
        geminiErrorMessage =
          geminiError?.message ||
          String(geminiError);

        console.error(
          "❌ Gemini fallback also failed:",
          geminiErrorMessage
        );

        // Preserve Gemini quota errors

        if (
          geminiError?.code ===
          "AI_DAILY_QUOTA_EXCEEDED"
        ) {
          throw geminiError;
        }

        if (
          geminiError?.code ===
          "AI_RATE_LIMITED"
        ) {
          throw geminiError;
        }

        const combinedError =
          new Error(
            `Groq Error: ${groqErrorMessage} | Gemini Error: ${geminiErrorMessage}`
          );

        combinedError.code =
          "BOTH_AI_FAILED";

        throw combinedError;
      }
    }

    // ==================================================
    // CHECK RESULT
    // ==================================================

    if (!result) {
      throw new Error(
        "AI returned no assessment result."
      );
    }

    // ==================================================
    // PARSE SCORES
    // ==================================================

    const documentationQuality =
      Number(
        result.documentationQuality
      );

    const projectCompleteness =
      Number(
        result.projectCompleteness
      );

    const codeStructure =
      Number(
        result.codeStructure
      );

    const innovation =
      Number(
        result.innovation
      );

    const technologyStack =
      Number(
        result.technologyStack
      );

    const missingModules =
      Number(
        result.missingModules
      );

    // ==================================================
    // VALIDATE SCORES
    // ==================================================

    const scores = [
      documentationQuality,
      projectCompleteness,
      codeStructure,
      innovation,
      technologyStack,
      missingModules,
    ];

    const invalidScore =
      scores.some(
        (score) =>
          !Number.isFinite(score) ||
          score < 0 ||
          score > 100
      );

    if (invalidScore) {
      throw new Error(
        "AI returned invalid score values. Scores must be between 0 and 100."
      );
    }

    // ==================================================
    // CALCULATE OVERALL SCORE
    // ==================================================

    const overallScore =
      scores.reduce(
        (sum, score) =>
          sum + score,
        0
      ) / scores.length;

    const finalScore =
      Number(
        overallScore.toFixed(2)
      );

    // ==================================================
    // AI CONFIDENCE SCORE
    // ==================================================

    const scoreAverage =
      scores.reduce(
        (sum, score) =>
          sum + score,
        0
      ) / scores.length;

    const scoreVariance =
      scores.reduce(
        (sum, score) =>
          sum +
          Math.pow(
            score - scoreAverage,
            2
          ),
        0
      ) / scores.length;

    const scoreStdDev =
      Math.sqrt(scoreVariance);

    let confidenceScore =
      100 - scoreStdDev;

    confidenceScore =
      Math.max(
        50,
        Math.min(
          98,
          confidenceScore
        )
      );

    confidenceScore =
      Number(
        confidenceScore.toFixed(2)
      );

    console.log(
      "🤖 AI Confidence:",
      confidenceScore + "%"
    );

    // ==================================================
    // STRENGTHS
    // ==================================================

    const strengths =
      Array.isArray(
        result.strengths
      )
        ? result.strengths
            .filter(
              (item) =>
                typeof item ===
                "string"
            )
            .slice(0, 3)
        : [];

    // ==================================================
    // IMPROVEMENTS
    // ==================================================

    const improvements =
      Array.isArray(
        result.improvements
      )
        ? result.improvements
            .filter(
              (item) =>
                typeof item ===
                "string"
            )
            .slice(0, 4)
        : [];

    // ==================================================
    // RECOMMENDATION
    // ==================================================

    const recommendation =
      typeof result.recommendation ===
      "string"
        ? result.recommendation
        : "";

    // ==================================================
    // FINAL LOG
    // ==================================================

    console.log("");
    console.log("=================================");
    console.log("📊 FINAL AI ASSESSMENT");
    console.log("=================================");

    console.log(
      "Documentation:",
      documentationQuality
    );

    console.log(
      "Completeness:",
      projectCompleteness
    );

    console.log(
      "Code Structure:",
      codeStructure
    );

    console.log(
      "Innovation:",
      innovation
    );

    console.log(
      "Technology Stack:",
      technologyStack
    );

    console.log(
      "Missing Modules:",
      missingModules
    );

    console.log(
      "⭐ Overall Score:",
      finalScore
    );

    console.log(
      "🤖 AI Confidence:",
      confidenceScore + "%"
    );

    console.log(
      "🤖 AI Provider:",
      aiProvider
    );

    console.log("=================================");

    // ==================================================
    // SAVE ASSESSMENT
    // ==================================================

    project.assessment = {
      documentationQuality,

      projectCompleteness,

      codeStructure,

      innovation,

      technologyStack,

      missingModules,

      overallScore:
        finalScore,

      confidenceScore:
        confidenceScore,

      strengths,

      improvements,

      recommendation,
    };

    // ==================================================
    // MAIN SCORE
    // ==================================================

    project.score =
      finalScore;

    // ==================================================
    // SUGGESTIONS
    // ==================================================

    project.suggestions =
      improvements;

    // ==================================================
    // COMPLETED
    // ==================================================

    project.status =
      "Completed";

    // ==================================================
    // SAVE
    // ==================================================

    await project.save();

    console.log(
      "💾 Assessment saved to MongoDB"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "AI assessment completed successfully",

      projectId:
        project._id,

      provider:
        aiProvider,

      assessment:
        project.assessment,
    });
  } catch (error) {
    console.error("");
    console.error("=================================");
    console.error("❌ AI ASSESSMENT ERROR");
    console.error(
      "❌ Code:",
      error?.code
    );
    console.error(
      "❌ Message:",
      error?.message
    );
    console.error(
      "❌ Full Error:",
      error
    );
    console.error("=================================");

    // ==================================================
    // FAILED STATUS
    // ==================================================

    try {
      if (project) {
        await Project.findOneAndUpdate(
          {
            _id: projectId,

            user: req.user.id,
          },
          {
            status: "Failed",
          }
        );
      }
    } catch (updateError) {
      console.error(
        "❌ Status Update Error:",
        updateError.message
      );
    }

    // ==================================================
    // GEMINI DAILY QUOTA
    // ==================================================

    if (
      error?.code ===
      "AI_DAILY_QUOTA_EXCEEDED"
    ) {
      return res.status(429).json({
        success: false,

        code:
          "AI_DAILY_QUOTA_EXCEEDED",

        message:
          "⚠️ Gemini daily AI limit has been reached. Please try again after the quota resets.",
      });
    }

    // ==================================================
    // AI RATE LIMIT
    // ==================================================

    if (
      error?.code ===
      "AI_RATE_LIMITED"
    ) {
      return res.status(429).json({
        success: false,

        code:
          "AI_RATE_LIMITED",

        message:
          "⚠️ AI service is temporarily busy. Please try again after some time.",
      });
    }

    // ==================================================
    // PDF ERROR
    // ==================================================

    if (
      error?.message?.startsWith(
        "PDF processing failed:"
      )
    ) {
      return res.status(400).json({
        success: false,

        code:
          "PDF_PROCESSING_FAILED",

        message:
          error.message,
      });
    }

    // ==================================================
    // BOTH AI FAILED
    // ==================================================

    if (
      error?.code ===
      "BOTH_AI_FAILED"
    ) {
      return res.status(500).json({
        success: false,

        code:
          "BOTH_AI_FAILED",

        message:
          "AI assessment failed. Both Groq and Gemini were unable to process the project.",

        error:
          error.message,
      });
    }

    // ==================================================
    // GENERAL ERROR
    // ==================================================

    return res.status(500).json({
      success: false,

      message:
        "AI assessment failed.",

      error:
        error?.message ||
        "Unknown server error",
    });
  }
};

// ======================================================
// GET ASSESSMENT REPORT
// ======================================================

const getAssessment = async (
  req,
  res
) => {
  try {
    const { projectId } =
      req.params;

    console.log("=================================");
    console.log(
      "📄 Getting Assessment:",
      projectId
    );

    console.log(
      "👤 Logged User:",
      req.user.id
    );

    // ==================================================
    // FIND PROJECT
    // ==================================================

    const project =
      await Project.findOne({
        _id: projectId,

        user: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,

        message:
          "Project not found",
      });
    }

    console.log(
      "📌 Project:",
      project.projectTitle
    );

    console.log(
      "📌 Status:",
      project.status
    );

    console.log(
      "📊 Assessment:",
      project.assessment
    );

    // ==================================================
    // CHECK STATUS
    // ==================================================

    if (
      project.status !==
      "Completed"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Assessment is not completed yet",
      });
    }

    // ==================================================
    // CHECK ASSESSMENT
    // ==================================================

    if (!project.assessment) {
      return res.status(404).json({
        success: false,

        message:
          "Assessment report not available",
      });
    }

    // ==================================================
    // CHECK SCORE
    // ==================================================

    if (
      project.assessment
        .overallScore === null ||
      project.assessment
        .overallScore ===
        undefined
    ) {
      return res.status(404).json({
        success: false,

        message:
          "Assessment scores are not available. Please run AI assessment again.",
      });
    }

    // ==================================================
    // CREATE REPORT
    // ==================================================

    const assessment = {
      projectId:
        project._id,

      projectTitle:
        project.projectTitle,

      documentationQuality:
        project.assessment
          .documentationQuality,

      projectCompleteness:
        project.assessment
          .projectCompleteness,

      codeStructure:
        project.assessment
          .codeStructure,

      innovation:
        project.assessment
          .innovation,

      technologyStack:
        project.assessment
          .technologyStack,

      missingModules:
        project.assessment
          .missingModules,

      overallScore:
        project.assessment
          .overallScore,

      confidenceScore:
        project.assessment
          .confidenceScore,

      strengths:
        project.assessment
          .strengths || [],

      improvements:
        project.assessment
          .improvements || [],

      recommendation:
        project.assessment
          .recommendation || "",

      status:
        project.status,

      score:
        project.score,

      createdAt:
        project.createdAt,

      updatedAt:
        project.updatedAt,
    };

    console.log(
      "✅ Assessment report found"
    );

    console.log(
      "⭐ Overall Score:",
      assessment.overallScore
    );

    console.log(
      "🤖 AI Confidence:",
      assessment.confidenceScore
    );

    console.log("=================================");

    return res.status(200).json({
      success: true,

      assessment,
    });
  } catch (error) {
    console.error(
      "❌ Get Assessment Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load assessment report",

      error:
        error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  assessProject,
  getAssessment,
};