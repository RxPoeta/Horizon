import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { text, title } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // Fallback for missing API key so the UI doesn't break completely during testing
      return NextResponse.json({ 
        summary: `[Modo Demo] Resumen de "${title}": El artículo detalla los avances tecnológicos recientes. (Configura GOOGLE_GENERATIVE_AI_API_KEY para resúmenes reales).` 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Resume la siguiente noticia en un párrafo corto y profesional (máximo 3 frases) en español. 
    Título: ${title}
    Contenido: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
