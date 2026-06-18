const { getGeminiModel } = require('../config/gemini');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// ─── Prompt Templates ────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are a travel document parser. Extract all travel information from the attached document.

Return ONLY valid JSON with no additional text, markdown, or code fences:
{
  "flights": [
    {
      "airline": "",
      "flightNumber": "",
      "departureCity": "",
      "arrivalCity": "",
      "departureTime": "",
      "arrivalTime": ""
    }
  ],
  "hotels": [
    {
      "hotelName": "",
      "checkIn": "",
      "checkOut": "",
      "location": ""
    }
  ],
  "trains": [
    {
      "trainName": "",
      "trainNumber": "",
      "from": "",
      "to": "",
      "departureTime": ""
    }
  ],
  "destination": "",
  "startDate": "",
  "endDate": "",
  "travelers": ""
}

If a field is not found in the document, use null. Return only valid JSON.`;

const buildItineraryPrompt = (extractedData) => `You are an expert travel planner. Create a comprehensive day-by-day travel itinerary based on the following travel details:

${JSON.stringify(extractedData, null, 2)}

Requirements:
- Create a day-wise plan from arrival to departure
- Include budget-friendly tourist attractions with time estimates
- Add food recommendations featuring local cuisine
- Include transportation tips between locations
- Add hotel check-in/check-out reminders on relevant days
- Suggest morning, afternoon, and evening activities for each day
- Keep it practical and actionable

Return the complete itinerary in clean Markdown format with ## Day X headers.`;

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Extract structured travel data from a document buffer using Gemini multimodal.
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @returns {Object} extractedData
 */
const extractTravelData = async (fileBuffer, mimeType) => {
  const model = getGeminiModel('gemini-2.5-flash');

  const filePart = {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType,
    },
  };

  let attempts = 0;
  const MAX_RETRIES = 2;

  while (attempts <= MAX_RETRIES) {
    try {
      const result = await model.generateContent([EXTRACTION_PROMPT, filePart]);
      const response = await result.response;
      let text = response.text().trim();

      // Strip markdown code fences if present
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

      const extracted = JSON.parse(text);
      logger.info('AI extraction successful');
      return extracted;
    } catch (err) {
      attempts++;
      logger.warn(`AI extraction attempt ${attempts} failed: ${err.message}`);
      if (attempts > MAX_RETRIES) {
        throw new AppError('Failed to extract travel data from document. Please try again.', 500);
      }
      // Brief wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }
};

/**
 * Generate a markdown itinerary from structured travel data.
 * @param {Object} extractedData
 * @returns {string} markdown itinerary
 */
const generateItinerary = async (extractedData) => {
  const model = getGeminiModel('gemini-2.5-flash');
  const prompt = buildItineraryPrompt(extractedData);

  let attempts = 0;
  const MAX_RETRIES = 2;

  while (attempts <= MAX_RETRIES) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const markdown = response.text().trim();
      logger.info('Itinerary generation successful');
      return markdown;
    } catch (err) {
      attempts++;
      logger.warn(`Itinerary generation attempt ${attempts} failed: ${err.message}`);
      if (attempts > MAX_RETRIES) {
        throw new AppError('Failed to generate itinerary. Please try again.', 500);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }
};

module.exports = { extractTravelData, generateItinerary };
