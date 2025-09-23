# SmartSkinAnalysis - API Documentation

## Overview

SmartSkinAnalysis integrates with Google Gemini AI to provide intelligent skin analysis and recommendations. This document outlines the API usage and integration details.

## 🔑 Authentication

### Google Gemini AI API

The application uses Google Gemini AI API for:
- Image analysis
- Text generation
- Structured response generation

**Setup:**
1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## 📡 API Endpoints

### Google Gemini AI Integration

The application doesn't expose its own API endpoints but integrates with Google Gemini AI through the following service functions:

#### Image Analysis
```typescript
analyzeImageWithNanoBanana(imageBase64: string): Promise<string>
```
- **Purpose**: Analyzes uploaded skin images
- **Model**: `gemini-2.5-flash-image-preview`
- **Input**: Base64 encoded image
- **Output**: Detailed skin condition description

#### Diagnosis Generation
```typescript
generateDiagnosisReport(
  formData: FormData,
  formType: FormType,
  imageBase64: string | null,
  aiStyle: string,
  aiLength: string
): Promise<DiagnosisReport>
```
- **Purpose**: Generates structured diagnosis report
- **Model**: `gemini-2.5-flash`
- **Input**: Form data, image, style preferences
- **Output**: Structured JSON with diagnosis and treatment plan

#### Chat Session
```typescript
startChatSession(history: ChatMessage[]): Chat
sendMessage(chat: Chat, message: string): Promise<string>
```
- **Purpose**: Interactive Q&A based on diagnosis
- **Model**: `gemini-2.5-flash`
- **Input**: Chat history and user message
- **Output**: AI response text

## 📊 Data Structures

### FormData
```typescript
type FormData = Record<string, FormDataValue>;
type FormDataValue = string | string[] | Record<string, string | string[]>;
```

### DiagnosisReport
```typescript
interface DiagnosisReport {
  diagnosis: string;
  plan: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
  formType?: FormType;
  date?: string;
}
```

### ChatMessage
```typescript
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
```

## 🔧 Configuration

### Response Schema

The API uses structured responses for diagnosis generation:

```typescript
const diagnosisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: {
      type: Type.STRING,
      description: "Comprehensive skin condition summary"
    },
    plan: {
      type: Type.OBJECT,
      properties: {
        phase1: { type: Type.STRING },
        phase2: { type: Type.STRING },
        phase3: { type: Type.STRING }
      },
      required: ["phase1", "phase2", "phase3"]
    }
  },
  required: ["diagnosis", "plan"]
};
```

### AI Style Configuration

**Available Styles:**
- `professional`: Professional, objective, scientific
- `empathetic`: Empathetic, warm, encouraging
- `concise`: Concise, direct, focused

**Available Lengths:**
- `standard`: Moderate length covering key points
- `detailed`: Comprehensive with in-depth explanations
- `summary`: Summary format with core essentials

## 🚨 Error Handling

### Common Error Scenarios

1. **API Key Issues**
   ```typescript
   if (!API_KEY) {
     throw new Error("API_KEY environment variable not set");
   }
   ```

2. **Image Analysis Failures**
   ```typescript
   catch (error) {
     console.error("Error analyzing image:", error);
     return "图像分析失败。";
   }
   ```

3. **Diagnosis Generation Failures**
   ```typescript
   catch (error) {
     console.error("Error generating diagnosis:", error);
     throw new Error("无法从 AI 获取有效的诊断结果。");
   }
   ```

## 📈 Rate Limits

Google Gemini AI has the following rate limits:
- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher limits available

**Best Practices:**
- Implement request queuing for multiple rapid requests
- Add retry logic with exponential backoff
- Cache responses when appropriate

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for key storage
- Rotate keys regularly
- Monitor API usage for anomalies

### Data Privacy
- Images are processed by Google AI but not stored
- All user data remains in local browser storage
- No personal data is sent to application servers

## 📝 Example Usage

### Basic Diagnosis Flow
```typescript
// 1. Analyze image (if provided)
const imageAnalysis = await analyzeImageWithNanoBanana(imageBase64);

// 2. Generate diagnosis report
const report = await generateDiagnosisReport(
  formData,
  'sensitive',
  imageBase64,
  'professional',
  'standard'
);

// 3. Start chat session
const chat = startChatSession([]);

// 4. Send follow-up questions
const response = await sendMessage(chat, "How often should I use this treatment?");
```

### Error Handling Example
```typescript
try {
  const report = await generateDiagnosisReport(formData, formType, image, style, length);
  setDiagnosisReport(report);
} catch (error) {
  console.error('Diagnosis failed:', error);
  showToast('AI 诊断失败，请稍后重试。', 'error');
}
```

## 🛠️ Development Tools

### API Testing
- Use browser developer tools to monitor network requests
- Test with various image formats and sizes
- Verify error handling with invalid inputs

### Debugging
```typescript
// Enable detailed logging
console.log('Form data:', formData);
console.log('Image size:', imageBase64?.length);
console.log('API response:', response);
```

## 📞 Support

For API-related issues:
- Check Google AI Studio documentation
- Review console errors for details
- Contact support: yuxiaodong@beaucare.org

---

*Last updated: January 2025*