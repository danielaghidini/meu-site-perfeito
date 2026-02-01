import { Request, Response } from "express";
import fetch from "node-fetch";
import { prisma } from "../db.js";
import { FB_APP_ID, FB_APP_SECRET } from "../config.js";

// Helper to get a setting
const getSetting = async (key: string) => {
	const setting = await prisma.setting.findUnique({ where: { key } });
	return setting?.value;
};

// Helper to save a setting
const saveSetting = async (key: string, value: string) => {
	return await prisma.setting.upsert({
		where: { key },
		update: { value },
		create: { key, value },
	});
};

export const getSocialSettings = async (req: Request, res: Response) => {
	try {
		const instagramId = await getSetting("instagram_business_id");
		const hasToken = !!(await getSetting("instagram_access_token"));

		res.json({
			instagramId,
			hasToken,
			appId: FB_APP_ID,
		});
	} catch (error) {
		console.error("DEBUG: Error in getSocialSettings:", error);
		res.status(500).json({ error: "Failed to get social settings" });
	}
};

export const saveInstagramToken = async (req: Request, res: Response) => {
	const { shortLivedToken } = req.body;

	if (!shortLivedToken) {
		return res.status(400).json({ error: "Token is required" });
	}

	try {
		// 1. Exchange for long-lived token
		const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;

		const response = await fetch(url);
		const data: any = await response.json();

		if (data.error) {
			return res.status(400).json({ error: data.error.message });
		}

		const longLivedToken = data.access_token;
		await saveSetting("instagram_access_token", longLivedToken);

		// 2. Try to get the Instagram Business ID automatically if not set
		// First get the pages
		const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedToken}`;
		const pagesRes = await fetch(pagesUrl);
		const pagesData: any = await pagesRes.json();

		if (pagesData.data && pagesData.data.length > 0) {
			// Get the first page's instagram_business_account
			const pageId = pagesData.data[0].id;
			const igUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${longLivedToken}`;
			const igRes = await fetch(igUrl);
			const igData: any = await igRes.json();

			if (igData.instagram_business_account) {
				await saveSetting(
					"instagram_business_id",
					igData.instagram_business_account.id,
				);
			}
		}

		res.json({ message: "Token saved successfully" });
	} catch (error) {
		console.error("Token save error:", error);
		res.status(500).json({ error: "Failed to exchange and save token" });
	}
};

export const generateCaption = async (req: Request, res: Response) => {
	const { idea } = req.body;

	const apiKey = process.env.NVIDIA_API_KEY;
	if (!apiKey) {
		return res.status(500).json({ error: "NVIDIA API Key not configured" });
	}

	const systemPrompt = `
    Você é um Social Media Manager especializado em Instagram.
    Seu objetivo é criar legendas altamente engajadoras, curtas e persuasivas.
    
    Regras:
    1. Use emojis de forma estratégica.
    2. Crie um gancho (hook) forte na primeira frase.
    3. Use espaços entre parágrafos para facilitar a leitura.
    4. Inclua um Call to Action (CTA) claro no final.
    5. Gere um bloco de hashtags relevantes (máximo 15).
    6. O tom deve ser profissional porém acessível, focado em tecnologia e sites de alta performance.
    `;

	const userPrompt = `Crie um post para o Instagram baseado na seguinte ideia: "${idea}"`;

	try {
		const aiResponse = await fetch(
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
					temperature: 0.8,
				}),
			},
		);

		const data: any = await aiResponse.json();
		res.json({ caption: data.choices?.[0]?.message?.content });
	} catch (error) {
		console.error("AI Caption error:", error);
		res.status(500).json({ error: "Failed to generate caption" });
	}
};

export const publishToInstagram = async (req: Request, res: Response) => {
	const { imageUrl, caption } = req.body;

	if (!imageUrl || !caption) {
		return res
			.status(400)
			.json({ error: "Image URL and caption are required" });
	}

	try {
		const igId = await getSetting("instagram_business_id");
		const token = await getSetting("instagram_access_token");

		if (!igId || !token) {
			return res
				.status(400)
				.json({ error: "Instagram account not linked" });
		}

		// Step 1: Create media container
		const containerUrl = `https://graph.facebook.com/v21.0/${igId}/media`;
		const containerRes = await fetch(containerUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				image_url: imageUrl,
				caption: caption,
				access_token: token,
			}),
		});

		const containerData: any = await containerRes.json();

		if (containerData.error) {
			console.error("Facebook API Container Error:", containerData.error);
			return res.status(400).json({ error: containerData.error.message });
		}

		const creationId = containerData.id;

		// Step 2: Publish media
		const publishUrl = `https://graph.facebook.com/v21.0/${igId}/media_publish`;
		const publishRes = await fetch(publishUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				creation_id: creationId,
				access_token: token,
			}),
		});

		const publishData: any = await publishRes.json();

		if (publishData.error) {
			console.error("Facebook API Publish Error:", publishData.error);
			return res.status(400).json({ error: publishData.error.message });
		}

		res.json({
			message: "Post published successfully!",
			id: publishData.id,
		});
	} catch (error) {
		console.error("Instagram publish error:", error);
		res.status(500).json({ error: "Failed to publish to Instagram" });
	}
};
