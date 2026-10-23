require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: "Say hello to AssessAI in one sentence.",
    });

    console.log("Gemini Response:");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini Error:");
    console.error(error.message);
  }
}

testGemini();