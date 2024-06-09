import { PluginErrorType, createErrorResponse } from '@lobehub/chat-plugin-sdk';
import { RequestData } from '@/type';
import { pipeline } from 'transformers'; // Изменено

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const { description } = (await req.json()) as RequestData;

  try {
    const generator = await pipeline('text-to-image', 'openskyml/dalle-3-xl'); 

    const image = await generator(description, { 
      // Дополнительные параметры модели 
    });

    const imageBuffer = await image.toBuffer('png'); 
    const imageBase64 = imageBuffer.toString('base64');

    const result = `![result](data:image/png;base64,${imageBase64})`;

    return new Response(result);

  } catch (error) {
    console.error("Ошибка при генерации изображения:", error);
    return createErrorResponse(PluginErrorType.Unknown, "Ошибка при генерации изображения");
  }
};
