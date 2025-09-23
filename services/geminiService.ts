import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import { FormData, FormType, ChatMessage } from '../types';
import { DIAGNOSIS_FORMS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const diagnosisResponseSchema = {
    type: Type.OBJECT,
    properties: {
        diagnosis: {
            type: Type.STRING,
            description: "根据提供的数据和图像，对用户的皮肤状况进行全面总结。应以专业、有同理心的语气撰写。必须使用与用户输入相同的语言（简体中文）。",
        },
        plan: {
            type: Type.OBJECT,
            properties: {
                phase1: { type: Type.STRING, description: "第一阶段治疗的详细计划。必须使用与用户输入相同的语言（简体中文）。" },
                phase2: { type: Type.STRING, description: "第二阶段治疗的详细计划。必须使用与用户输入相同的语言（简体中文）。" },
                phase3: { type: Type.STRING, description: "第三阶段治疗的详细计划。必须使用与用户输入相同的语言（简体中文）。" },
            },
            required: ["phase1", "phase2", "phase3"],
        },
    },
    required: ["diagnosis", "plan"],
};

function formatFormDataForPrompt(formData: FormData, formType: FormType): string {
    const formTitle = DIAGNOSIS_FORMS[formType].title;
    let formattedString = `用户为《${formTitle}》提供的回答：\n\n`;

    for (const key in formData) {
        const value = formData[key];
        if (Array.isArray(value)) {
            formattedString += `- ${key}: ${value.join(', ')}\n`;
        } else if (typeof value === 'object' && value !== null) {
            formattedString += `- ${key}:\n`;
            for(const subKey in value) {
                const subValue = (value as Record<string, string | string[]>)[subKey];
                if (Array.isArray(subValue)) {
                    formattedString += `  - ${subKey}: ${subValue.join(', ')}\n`;
                } else {
                     formattedString += `  - ${subKey}: ${subValue}\n`;
                }
            }
        } 
        else if(value) {
            formattedString += `- ${key}: ${value}\n`;
        }
    }
    return formattedString;
}

/**
 * Step 1: Analyze the image with the specialized 'nano-banana' model.
 * This provides a detailed text description of the skin condition.
 */
const analyzeImageWithNanoBanana = async (imageBase64: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1],
        },
    };
    const textPart = {
        text: 'Analyze this skin image and describe any visible conditions in detail. Focus on aspects relevant to a dermatological diagnosis. The response must be in Simplified Chinese.',
    };
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
        });

        let analysisText = '';
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    analysisText += part.text;
                }
            }
        }
        return analysisText.trim() || "图像分析未能返回文本。";
    } catch (error) {
        console.error("Error analyzing image with nano-banana:", error);
        return "图像分析失败。";
    }
};

/**
 * Step 2: Generate the final diagnosis report.
 * It uses the image analysis from Step 1, the user's form data, and the original image
 * to provide comprehensive context to the main diagnostic model.
 */
export const generateDiagnosisReport = async (
    formData: FormData,
    formType: FormType,
    imageBase64: string | null,
    aiStyle: string,
    aiLength: string
): Promise<{ diagnosis: string; plan: { phase1: string; phase2: string; phase3: string; } }> => {
    let imageAnalysisText = '';
    // If an image is provided, first get a detailed analysis from the nano-banana model.
    if (imageBase64) {
        imageAnalysisText = await analyzeImageWithNanoBanana(imageBase64);
    }
    
    const formattedData = formatFormDataForPrompt(formData, formType);
    
    const styleInstruction = {
        professional: "文笔风格要求专业、客观、科学。",
        empathetic: "文笔风格要求富有同理心、温暖、鼓励。",
        concise: "文笔风格要求简洁、直接、重点突出。"
    }[aiStyle] || "文笔风格要求专业、客观、科学。";

    const lengthInstruction = {
        standard: "内容长度适中，覆盖所有关键点。",
        detailed: "内容长度详尽，对每个要点进行深入解释。",
        summary: "内容为摘要形式，只包含最核心的诊断和建议。"
    }[aiLength] || "内容长度适中，覆盖所有关键点。";

    const prompt = `
        请分析以下皮肤状况信息。如果提供了图像，请将其作为视觉分析的主要依据。文本数据提供了背景和症状。
        ${imageBase64 ? `对用户上传的图片进行了初步分析，得出以下描述：“${imageAnalysisText}”。请将此描述与原始图片和用户的表单答案结合起来，进行最终诊断。` : ''}
        请提供一份专业的皮肤诊断摘要和一个三阶段的治疗计划。
        ${styleInstruction}
        ${lengthInstruction}
        用户的输入语言是中文，因此请用简体中文回答。

        用户数据:
        ${formattedData}
    `;

    // The main model receives the comprehensive prompt and, if available, the original image for its own analysis.
    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
        parts.unshift({
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64.split(',')[1],
            },
        });
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                responseMimeType: 'application/json',
                responseSchema: diagnosisResponseSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;
    } catch (error) {
        console.error("Error generating diagnosis report:", error);
        throw new Error("无法从 AI 获取有效的诊断结果。请检查控制台以获取更多详细信息。");
    }
};

/**
 * Creates and returns a new stateful chat session.
 */
export const startChatSession = (history: ChatMessage[]): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `你是一位护肤专家助手。你的知识基于专业诊断表格中概述的精准护肤原则，涵盖敏感肌、痤疮、色斑、抗衰老和干性皮肤等状况。请根据此背景回答用户的问题。回答应有帮助性且信息丰富，但严格避免提供医疗建议。不要进行诊断或开具处方。你可以提供一般的护肤知识。请用简体中文回答。`
        },
        history,
    });
};

/**
 * Sends a message within an existing chat session.
 */
export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    const response = await chat.sendMessage({ message });
    return response.text;
};