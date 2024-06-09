import { PluginErrorType, createErrorResponse } from '@lobehub/chat-plugin-sdk';
import { RequestData } from '@/type';
import { pipeline } from '@xenova/transformers';

export const config = {
  runtime: 'edge',
};

// Загружаем пайплайн для генерации изображений из модели
const generator = await pipeline('text-to-image', 'openskyml/dalle-3-xl'); 

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const { description, params } = (await req.json()) as RequestData;

  try {
    // Генерируем изображение с помощью модели
    const image = await generator(description, { /* Дополнительные параметры модели */ });

    // Конвертируем изображение в формат, подходящий для отправки в ответе 
    const imageBuffer = await image.toBuffer('png'); // Или другой формат, например 'jpeg'
    const imageBase64 = imageBuffer.toString('base64');

    const result = `![result](data:image/png;base64,${imageBase64})`;

    return new Response(result);
    
  } catch (error) {
    console.error("Ошибка при генерации изображения:", error);
    return createErrorResponse(PluginErrorType.Unknown, "Ошибка при генерации изображения");
  }
};
