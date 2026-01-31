import { Request, Response } from "express";
import fetch from "node-fetch";

export const generateArticleContent = async (req: Request, res: Response) => {
	const { title, prompt } = req.body;

	const apiKey = process.env.NVIDIA_API_KEY;
	if (!apiKey) {
		return res.status(500).json({ error: "NVIDIA API Key not configured" });
	}

	const systemPrompt = `
    Você é um redator profissional especializado em Copywriting e SEO (Search Engine Optimization). 
    Seu objetivo é escrever artigos que não apenas informem, mas que também ranqueiem bem nos motores de busca (como Google) e sejam altamente persuasivos.
    
    REGRAS DE SEO E ESTRUTURA:
    1. Estrutura de Títulos: Use uma hierarquia lógica (H2 para os tópicos principais e H3 para sub-tópicos). Inclua a palavra-chave principal ou termos relacionados nos títulos.
    2. Introdução Cativante: Comece com um parágrafo que prenda a atenção e inclua a ideia central logo nas primeiras linhas.
    3. Escaneabilidade: Use listas (ul/li) para quebrar o texto e facilitar a leitura rápida.
    4. Palavras-chave Semânticas: Utilize sinônimos e termos relacionados ao tema para aumentar a relevância contextual.
    5. Conclusão e CTA: Termine sempre com uma conclusão forte e, se possível, uma chamada para ação (CTA).
    
    FORMATO TÉCNICO (HTML):
    - Utilize apenas tags HTML (<h2>, <h3>, <ul>, <li>, <p>, <strong>, <em>, <blockquote>).
    - É PROIBIDO o uso de Markdown ou de cores de fundo/estilos que prejudiquem o contraste.
    - Use <hr style="border: 0; border-top: 1px solid #333; margin: 25px 0;"> para separar as grandes seções do artigo.
    
    Crie um conteúdo que seja autoridade no assunto e tecnicamente perfeito para SEO.
    `;

	const userPrompt = `Escreva um artigo completo sobre "${title}". ${prompt || "O artigo deve ser informativo e bem estruturado."}`;

	try {
		const response = await fetch(
			"https://integrate.api.nvidia.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: "meta/llama-3.1-70b-instruct",
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user", content: userPrompt },
					],
					temperature: 0.7,
					max_tokens: 2048,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.text();
			return res.status(response.status).json({ error });
		}

		const data: any = await response.json();
		const content = data.choices?.[0]?.message?.content;

		if (!content) {
			return res.status(500).json({ error: "Empty response from AI" });
		}

		res.json({ content });
	} catch (error) {
		console.error("AI Generation Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
