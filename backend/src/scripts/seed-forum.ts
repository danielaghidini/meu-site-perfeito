import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding forum posts...");

	// Find a user to be the author
	const user = await prisma.user.findFirst();

	if (!user) {
		console.error("No users found. Cannot seed posts without an author.");
		// Create a dummy user if none exists
		const newUser = await prisma.user.create({
			data: {
				email: "dragonborn@skyrim.com",
				password: "hashedpassword123", // In a real scenario, this should be hashed
				name: "Dovahkiin",
				role: "USER",
			},
		});
		console.log("Created dummy user:", newUser.email);
		return seedPosts(newUser.id);
	} else {
		return seedPosts(user.id);
	}
}

async function seedPosts(authorId: string) {
	const posts = [
		{
			title: "Feedback on Bjorn's voice acting",
			content:
				"I really like the new lines for Bjorn when he enters a tavern. It feels very immersive! However, sometimes he repeats the 'mead' line too often. Anyone else noticed this?",
			category: "General Discussion",
			authorId: authorId,
			slug: "feedback-on-bjorns-voice-acting-" + Date.now(),
			likes: 12,
		},
		{
			title: "Help with 'The Lost Sword'",
			content:
				"I'm stuck at the part where you need to find the sword in the cave near Windhelm. I used the clairvoyance spell but it points to a wall. Is this a bug or am I missing a hidden switch?",
			category: "Questions",
			authorId: authorId,
			slug: "help-with-the-lost-sword-" + Date.now(),
			likes: 5,
		},
		{
			title: "Crash when entering Solitude",
			content:
				"Hi everyone, checking if anyone has this issue. My game crashes consistently when I fast travel to Solitude with Bjorn as a follower. Disabling the mod fixes it. Any known conflicts with other city overhauls?",
			category: "Technical Issues",
			authorId: authorId,
			slug: "crash-when-entering-solitude-" + Date.now(),
			likes: 3,
		},
	];

	for (const post of posts) {
		// Check if similar slug exists to avoid unique constraint error just in case
		const exists = await prisma.forumPost.findFirst({
			where: { title: post.title },
		});
		if (!exists) {
			await prisma.forumPost.create({
				data: post,
			});
			console.log(`Created post: ${post.title}`);
		} else {
			console.log(`Skipping existing post: ${post.title}`);
		}
	}

	console.log("Forum posts seeded successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
