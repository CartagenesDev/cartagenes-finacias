import { GoogleGenAI } from "@google/genai";
import { NewsArticle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketNews = async (): Promise<NewsArticle[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Você é um jornalista financeiro sênior do mercado brasileiro (B3).
      Gere 5 notícias fictícias, porém realistas e impactantes, sobre o mercado financeiro atual (ações, inflação, juros, commodities, tecnologia).
      
      Para cada notícia, forneça:
      - title: Manchete impactante
      - summary: Resumo curto de 2 frases
      - category: Uma categoria curta (ex: MERCADO, TECH, COMMODITIES, POLITICA)
      
      Responda APENAS em JSON no seguinte formato de array:
      [
        {
          "title": "...",
          "summary": "...",
          "category": "..."
        },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");
    
    const parsed = JSON.parse(text);
    
    // Add generic images to the articles
    return parsed.map((item: any, index: number) => ({
      id: `news-${index}`,
      ...item,
      imageUrl: `https://picsum.photos/seed/${index + 42}/800/600`
    }));

  } catch (error) {
    console.error("Error generating news:", error);
    // Fallback data
    return [
      {
        id: '1',
        title: "Ibovespa opera em alta com otimismo externo",
        summary: "Investidores reagem positivamente aos dados de inflação nos EUA. Dólar apresenta leve queda frente ao real.",
        category: "MERCADO",
        imageUrl: "https://picsum.photos/seed/1/800/600"
      },
      {
        id: '2',
        title: "Petrobras anuncia novo plano de investimentos",
        summary: "Estatal foca em energias renováveis para o próximo quinquênio. Ações sobem 2% no pregão de hoje.",
        category: "EMPRESAS",
        imageUrl: "https://picsum.photos/seed/2/800/600"
      },
      {
        id: '3',
        title: "Copom sinaliza manutenção da taxa Selic",
        summary: "Ata da última reunião indica cautela com o cenário fiscal. Analistas preveem estabilidade até o fim do ano.",
        category: "ECONOMIA",
        imageUrl: "https://picsum.photos/seed/3/800/600"
      },
       {
        id: '4',
        title: "Dólar fecha em queda com fluxo estrangeiro",
        summary: "Entrada de capital externo impulsiona a moeda brasileira. Setor exportador monitora volatilidade.",
        category: "MOEDAS",
        imageUrl: "https://picsum.photos/seed/4/800/600"
      },
       {
        id: '5',
        title: "Techs brasileiras ganham destaque global",
        summary: "Startups nacionais atraem investimentos de fundos do Vale do Silício. Setor de fintechs lidera rodadas.",
        category: "TECNOLOGIA",
        imageUrl: "https://picsum.photos/seed/5/800/600"
      }
    ];
  }
};

export const getFinancialTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Dê uma dica curta e única de investimento para iniciantes (máximo 15 palavras).",
    });
    return response.text || "Diversifique sua carteira para reduzir riscos.";
  } catch (error) {
    return "Invista com consistência e foco no longo prazo.";
  }
};