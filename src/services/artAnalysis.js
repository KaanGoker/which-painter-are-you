import { getApiKey } from './apiKeyService';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Errors the result screen turns into a "set your key" prompt instead of a raw message.
const keyError = (code) => {
    const error = new Error(code);
    error.code = code;
    return error;
};

const buildRequest = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) throw keyError('NO_API_KEY');
    return { endpoint: GEMINI_API_URL, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey } };
};

// Gemini flash-lite occasionally returns 503 (high demand) or 429 (rate limit).
// Retry those transparently with linear backoff so the user does not see a spurious error.
const postWithRetry = async (body, retries = 3) => {
    let response;
    const { endpoint, headers } = await buildRequest();
    for (let attempt = 0; attempt <= retries; attempt++) {
        response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        if (response.ok) return response;
        if ((response.status === 503 || response.status === 429) && attempt < retries) {
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
            continue;
        }
        return response;
    }
    return response;
};

const imageToBase64 = async (imageUri) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Base64 conversion error:', error);
        throw error;
    }
};

const getPrompt = (mode = 'standard') => {
    const modeInstruction = mode === 'alternative'
        ? 'Focus especially on color palette, emotional tone, and atmospheric mood rather than technique.'
        : '';

    return `You are an expert art historian with deep knowledge of art movements from ancient times to contemporary digital art, including Western, non-Western, and emerging artists.
${modeInstruction ? `\nADDITIONAL FOCUS: ${modeInstruction}\n` : ''}
STEP 1 - IMAGE CLASSIFICATION (internal reasoning only, do not include in output):
Classify the image as one of:
A) Intentional artwork: painting, drawing, print, digital illustration, sculpture photo
B) Aesthetically composed photograph: documentary, portrait, landscape, street photography with clear compositional intent
C) Casual or non-art image: selfie, product photo, screenshot, plain document, heavily compressed/low-quality image

If (C): output exactly this JSON and stop:
{"type":"non_artwork","artists":[],"note":"Image does not appear to be artwork or an intentionally composed photograph."}

STEP 2 - VISUAL ANALYSIS (internal reasoning only, do not include in output):
For type (A) or (B), systematically analyze:
- Composition and spatial structure
- Color palette and tonal handling
- Texture and mark-making (or photographic qualities)
- Subject matter and theme
- Period and movement markers

STEP 3 - SCORING (internal reasoning only, do not include in output):
Compare your analysis against the full art historical canon. Identify 3-5 artists whose work shares measurable visual characteristics with this image. Draw from the full canon — do not default to famous names if lesser-known artists are a better match.

For each candidate artist, score these 5 dimensions from 0-20:
- Technique / mark-making similarity
- Color palette / tonal similarity
- Compositional similarity
- Subject and thematic similarity
- Period / movement style similarity

Sum each artist's scores. Normalize all sums so artist totals add up to 100. Include only artists with genuine similarity — do not pad to reach 3 if fewer match.

STEP 4 - OUTPUT:
Return valid JSON only. No markdown fences. No preamble. No commentary after the JSON.

{"type":"artwork","dominant_movement":"e.g. Post-Impressionism","dominant_period":"e.g. Late 19th century","artists":[{"name":"Full Artist Name","percentage":45,"reason":"25-45 word explanation citing specific visible elements — never just similar style or comparable technique"}]}

STRICT RULES:
1. Percentages must sum to exactly 100
2. Sort artists by percentage descending
3. reason: 25-45 words, must cite specific visible elements
4. Return JSON only — no markdown fences, no commentary before or after`;
};

export const analyzeArtwork = async (imageUri, mode = 'standard') => {
    try {
        const base64Image = await imageToBase64(imageUri);
        const prompt = getPrompt(mode);

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
            },
        };

        const response = await postWithRetry(requestBody);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            if (errorData.error?.details?.some((d) => d.reason === 'API_KEY_INVALID')) {
                throw keyError('INVALID_API_KEY');
            }
            throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            throw new Error('API response is empty');
        }

        // JSON extraction with fallback
        let jsonString = textContent;
        const fenceMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (fenceMatch) {
            jsonString = fenceMatch[1];
        } else {
            const jsonStart = textContent.indexOf('{');
            const jsonEnd = textContent.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                jsonString = textContent.substring(jsonStart, jsonEnd + 1);
            }
        }

        const result = JSON.parse(jsonString);

        return {
            type: result.type || 'artwork',
            dominant_movement: result.dominant_movement || null,
            dominant_period: result.dominant_period || null,
            artists: result.artists || [],
            note: result.note || null,
        };
    } catch (error) {
        console.error('Analysis error:', error);
        throw error;
    }
};

export const analyzeEnrichment = async (imageUri, topArtistName, topPercentage) => {
    try {
        const base64Image = await imageToBase64(imageUri);

        const prompt = `This image resembles ${topArtistName}'s style at ${topPercentage}% similarity.

Answer in JSON only (no markdown fences):
{
  "mood": "1-2 sentences describing the emotional tone and feeling this image evokes",
  "styleHints": ["tip 1", "tip 2", "tip 3"]
}

styleHints: 2-3 practical, concrete tips for how someone could compose, photograph, or create something more in ${topArtistName}'s style. Focus on lighting, composition, color choices, or subject matter — not "study their work" advice.`;

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
                ],
            }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
        };

        const response = await postWithRetry(requestBody);

        if (!response.ok) return null;

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) return null;

        let jsonString = textContent;
        const fenceMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (fenceMatch) jsonString = fenceMatch[1];
        else {
            const s = textContent.indexOf('{');
            const e = textContent.lastIndexOf('}');
            if (s !== -1 && e !== -1) jsonString = textContent.substring(s, e + 1);
        }

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Enrichment error:', error);
        return null;
    }
};

export default { analyzeArtwork, analyzeEnrichment };
