// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs on Supabase Edge Runtime (Deno).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestPayload {
  text: string;
  categories?: { id: string; name: string }[];
  currentDate?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not configured in Supabase Edge Function secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: RequestPayload = await req.json();
    const { text, categories = [], currentDate = new Date().toISOString() } = body;

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const categoriesList = categories.length > 0
      ? categories.map((c) => `- ${c.name} (id: ${c.id})`).join("\n")
      : "- Eco Ingeniería (id: cat-eco)\n- Ocupamor (id: cat-ocup)\n- Solo Guayas (id: cat-guayas)\n- Personal (id: cat-pers)\n- Trabajo personal (id: cat-trab)\n- Team Nox (id: cat-nox)\n- Ocio (id: cat-ocio)\n- Otros (id: cat-otro)";

    const systemPrompt = `
Eres DHARMA CORE, el motor semántico de inteligencia artificial del Centro de Mando Personal DHARMA.
Tu misión es recibir texto libre o transcripciones informales en español y extraer información estructurada (tareas, categorías, fechas y prioridades).

REGLAS DE EXTRACCIÓN:
1. Divide el texto en tareas atómicas y claras. Si el usuario menciona varias acciones (por ejemplo usando "y", "también", "además", "recordarle a"), crea una tarea para cada acción separada.
2. Cada título de tarea debe redactarse en infinitivo o imperativo claro, limpio y accionable (ejemplo: "Revisar publicaciones de Ocupamor", "Recordarle a Anderling enviar las fotos").
3. Asigna la categoría más coherente entre las siguientes disponibles:
${categoriesList}
4. Detecta fechas relativas respecto a la fecha actual (${currentDate}). Por ejemplo "mañana", "hoy", "el jueves", "la próxima semana".
5. Extrae la prioridad sugerida: "baja", "media", "alta" o "vital" (por defecto "media" salvo si se indica urgencia o criticidad).

DEBES RESPONDER EXCLUSIVAMENTE EN FORMATO JSON VÁLIDO CON ESTA ESTRUCTURA:
{
  "summary": "Resumen conciso de lo encontrado (ej: He encontrado 2 tareas para Ocupamor fechadas para mañana)",
  "detectedCategory": "Nombre de la categoría principal detectada",
  "detectedCategoryId": "id_de_la_categoria",
  "detectedDateLabel": "mañana / hoy / fecha relativa en texto",
  "detectedDateISO": "YYYY-MM-DD",
  "tasks": [
    {
      "title": "Título de la tarea",
      "description": "Detalles adicionales si los hay",
      "categoryId": "id_de_la_categoria",
      "dueDate": "YYYY-MM-DD o etiqueta",
      "dueDateLabel": "mañana / hoy / etc",
      "priority": "baja" | "media" | "alta" | "vital"
    }
  ]
}
`;

    // Call Gemini 1.5 Flash API with structured JSON output
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: `Texto del usuario para analizar:\n"${text}"` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: "Gemini API call failed", details: errText }),
        {
          status: geminiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const geminiData = await geminiResponse.json();
    const candidateText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const parsedOutput = JSON.parse(candidateText);

    return new Response(JSON.stringify(parsedOutput), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error in Dharma Core Edge Function",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
