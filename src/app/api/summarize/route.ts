import { NextResponse } from 'next/server';

// This is a mock implementation of AI summarization.
// In a real scenario, you would integrate Gemini or another LLM here.
export async function POST(request: Request) {
  try {
    const { text, title } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Simulation of AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock summary logic
    const summary = `Resumen de Aura AI: El artículo "${title}" analiza profundamente los desarrollos recientes en el sector. Los puntos clave incluyen la optimización de procesos mediante nuevas tecnologías y el impacto esperado en el mercado global para el cierre del trimestre. Se destaca la necesidad de adaptación continua ante los cambios rápidos de la industria.`;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
