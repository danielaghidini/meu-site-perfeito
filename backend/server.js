import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

// Simulação de banco de dados
const posts = [
	{
		id: 1,
		date: new Date().toISOString(),
		slug: "bem-vindo-ao-meu-site",
		title: { rendered: "Bem-vindo ao Meu Site Perfeito (Via API!)" },
		content: {
			rendered:
				"<p>Este post agora vem do seu próprio backend em Node.js!</p>",
		},
		excerpt: {
			rendered: "Estamos oficialmente separados em Frontend e Backend.",
		},
	},
];

// Rotas
app.get("/api/posts", (req, res) => {
	res.json(posts);
});

app.get("/api/posts/:slug", (req, res) => {
	const post = posts.find((p) => p.slug === req.params.slug);
	if (post) {
		res.json(post);
	} else {
		res.status(404).json({ message: "Post não encontrado" });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
