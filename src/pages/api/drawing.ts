import { PluginErrorType, createErrorResponse } from '@lobehub/chat-plugin-sdk';
import { RequestData } from '@/type';

export const config = {
  runtime: 'edge',
};

const API_URL = 'https://api-inference.huggingface.co/models/openskyml/dalle-3-xl';

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const { description } = (await req.json()) as RequestData;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: description })
    });

    if (!response.ok) {
      throw new Error(`Ошибка Hugging Face API: ${response.status}`);
    }

    const blob = await response.blob();
    const imageObjectURL = URL.createObjectURL(blob); 

    const result = `![result](${imageObjectURL})`;

    return new Response(result);

  } catch (error) {
    console.error("Ошибка при генерации изображения:", error);
    return createErrorResponse(PluginErrorType.Generic, "Ошибка при генерации изображения");
  }
};
