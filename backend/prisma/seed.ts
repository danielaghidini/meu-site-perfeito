import { prisma } from "../src/db.ts";

async function main() {
	console.log("Seeding Quests...");

	const quests = [
		{
			title: "Past Shadows",
			slug: "past-shadows",
			order: 1,
			isMainQuest: true,
			summary:
				"Bjorn decides to confront his past and seeks to find out what happened to his sister. With the help of the player, he revisits Nordholm, their former village, only to find it in ruins.",
			description: `Bjorn decides to confront his past and seeks to find out what happened to his sister. With the help of the player, he revisits Nordholm, their former village, only to find it in ruins and overgrown with vegetation, indicating that it has been abandoned for a long time.

Upon arrival, Bjorn is overwhelmed with guilt and regret for not intervening when he had the chance to save his sister. He reflects on the choices he made and the consequences they had on his family.

The player and Bjorn encounter an old orc in the village who reveals more about the atrocities committed by the bandits, including the enslavement of Adielle and other villagers. The orc mentions that Adielle orchestrated a rebellion against the bandits, leading to the destruction of the village and her departure.

Realizing that his sister is alive and has endured unimaginable suffering, Bjorn feels a mix of relief and anguish. He vows to find Adielle and make amends for abandoning her.

The old orc points out that a warrior who knows more about what happened is in Narzulbur, an Orc stronghold. There, they meet Thruzar, an orc who provides them with Adielle's diary, detailing her experiences and her quest for revenge.

Reading Adielle's diary, Bjorn learns about the horrors she endured and the actions she took to free herself and seek justice.`,
		},
		{
			title: "Heart Whispers",
			slug: "heart-whispers",
			order: 2,
			isMainQuest: true,
			summary:
				"Unaware of Adielle's past, Astrid recruited her under the alias 'Little Shadow'. Following the game's quests, the player can encounter her in the Dark Brotherhood or Thieves Guild.",
			description: `Unaware of Adielle's past, Astrid, leader of the Dark Brotherhood, recruited her under the alias "Little Shadow," drawn by her reputation for vengeance and destruction.

Following the game's quests, the player can encounter Little Shadow in the Dark Brotherhood or the Thieves' Guild as an "associate," whom Delvin asks for help with specific cases.

After some conversation with Little Shadow, Bjorn suspects that she might be Adielle and confronts her, but she denies being Adielle, even after seeing the diary. If the player is a member of the Dark Brotherhood, they may be chosen as "The Listener," and Little Shadow remarks that everything would have been different if the listener existed before. They then decide to resume the search for Thruzar. The orc warrior expresses his suspicions about Chief Mauhulak after finding a suspicious letter. Additionally, he informs the player that Groshak has numerous ebony mines with slave labor, controlled by bandits paid with ebony weapons.

Thruzar also gives a hint about where to go next, the Direclaw Camp. But the only clue they find there is a note instructing them to wait for a shipment of ebony from an unknown mine. Unsure of its importance and with no more leads to follow, Bjorn asks the player for some time to think and suggests they can talk better at an inn.`,
		},
		{
			title: "Fire Bonds",
			slug: "fire-bonds",
			order: 3,
			isMainQuest: true,
			summary:
				"Bjorn has an idea to inquire at the docks of Windhelm about a shipment. Thruzar seeks help after leaving his stronghold due to distrust.",
			description: `After some time, Bjorn has an idea to inquire at the docks of Windhelm about the shipment arriving on a ship. At this point, Thruzar, the orc the player met earlier, seeks the help of the player and Bjorn. He left his stronghold due to distrust and is now looking for mercenary work. The player tells Thruzar what they found at the bandit camp, and the orc directs the player to the docks in Windhelm, where they find a contact named Stands-In-Shallows, an Argonian addicted to Skooma. He mentions a suspicious shipment but will only provide more details if the player brings him 10 bottles of Skooma. Thruzar knows where to find them, with Shagra, Thruzar's former lover, who is in trouble at Redwater Den. The player helps Thruzar rescue Shagra, who has been associating with bandits after leaving her stronghold. After some suspicion from Bjorn, they kill the bandits in Rift Watchtower and obtain the skooma from the bandit leader after killing him. With the reunion complete, Thruzar decides to stay with Shagra for a while but offers his help to the player whenever needed.`,
		},
		{
			title: "Darkened Fate",
			slug: "darkened-fate",
			order: 4,
			isMainQuest: true,
			summary:
				"Stands-In-Shallows points to a name, Ulain. The player finds him and a ship loaded with ebony, but 'Little Shadow' attacks.",
			description: `Stands-In-Shallows points to a name, Ulain, a suspicious Dark Elf who waits near the docks around midnight on certain days. The player finds him there, along with a ship loaded with ebony. At that moment, a shadowy figure (Little Shadow) attacks, targeting the shipments. Unaware of the connection, Ulain asks for help and hires the player and Bjorn as mercenaries to protect him until the next shipment arrives. The player and Bjorn decide to keep Ulain close to uncover his connection with the bandits and Groshak.
While protecting Ulain, he lets slip some details about the operations in Solstheim and expresses a desire to visit one of the ebony mines with slave labor. In the first mine, Ebondrawn Mine, they find Lorzub, the old orc, and Barni, a little boy who is the son of one of the guards. Upon seeing the boy in the mine, Bjorn becomes enraged and decides to kill all the bandits there. The player must assist him.
After killing everyone, Bjorn apologizes to the player for being so impulsive and asks them to search for the keys. The quest concludes when the cells are opened and the two main prisoners are freed.`,
		},
		{
			title: "Innocence Protected",
			slug: "innocence-protected",
			order: 5,
			isMainQuest: true,
			summary:
				"The player must escort the old man and the boy out of the mine. Lorzub invites them to Bjorn's old house where he shares the story of his sons.",
			description: `The player must escort the old man and the boy out of the mine, where a scene unfolds revealing Barni's backstory. Lorzub invites them to his current home, the basement of Bjorn's old house in Nordholm, which still remains intact. There, he shares the story of his sons, Groshak and Thurak, as he knows it, though he is mistaken about many things. Lorzub then asks the player to find Thurak in the nearby necromancer cave, Cragwallow Slope.

This quest focuses on Barni and Thruzar's childhood and will be further developed in the future.`,
		},
		{
			title: "Bloodline's Secrets",
			slug: "bloodlines-secrets",
			order: 6,
			isMainQuest: true,
			summary:
				"Bjorn and the player find Groshak's journal leading to a hidden forge and Thurak, who has become a monster.",
			description: `Bjorn and the player find Groshak's journal in a room with two beds in Cragwallow Slope. The journal leads them to a hidden forge and Thurak, Lorzub's son, who has now become a monster.

**The journal contains the following information:**

One day, while excavating in the Narzulbur mine, Groshak discovered a tunnel being dug from the other side. This tunnel led to a secret chamber in Cragwallow Slope, where a forge was located. Necromancers were studying a way to use the ebony from the mine to create an altar for Molag Bal. Groshak learned from them about the Lord of Domination and found a book stating that they would need hundreds of ingots to create the altar in the forge. Additionally, they would require the heart of someone killed there and a ritual.

The necromancers planned to enslave the orcs from the mine, as the book specified that the ebony had to be extracted by people in servitude and despair. The book contained details on how to construct the altar. Groshak made a deal with the necromancers: he would forge ebony weapons and distribute them to bandit groups to force common people to mine. In return, he wanted to use the altar to dominate whoever he wished and become a powerful necromancer.

One day, in love with Uglarz, Groshak revealed his plan to her, showing her the forge and weapons. She was horrified and refused to participate. In a fit of rage, Groshak locked her in a cage, intending to use her as a test subject for necromancy experiments. He told everyone she had disappeared while hunting.

Thurak, sensing something was wrong, sought to discover what had happened to Uglarz. He found the passage and rescued her. The two disappeared, or so everyone thought, but Groshak knew that Thurak had rescued her and taken her far away. Some time later, Mauhulakh, without his two cousins to challenge him and in fear of Groshak, agreed to turn the nearby village of Nordholm (Bjorn's village) into a bandit haven and the villagers into slave miners. The bandits also had a bounty letter for Thurak and Uglarz. They found them with a baby, Thruzar, and brought only Thurak back. Groshak made him the first victim of the altar, tearing out his heart and turning him into a monster.

**Continuing the quest:**

Upon finding Thurak, Bjorn and the player engage in a battle. Thurak, now a strong and violent monster, is defeated, but they hear the sinister laugh and voice of Molag Bal. Thurak grows stronger, and sinister black skeletons appear to aid him. The player, when attacked, faints and wakes up dressed as a miner in an ice mine.

A mine slave speaks to the player as the sounds of battle are heard—it's Little Shadow, who has killed all the bandits and come to rescue the player.

After a conversation, Little Shadow takes the player to a place she calls the Hidden Cabin, where Ulain and Roggvar, Barni's father, are tied up. Little Shadow taunts them, saying she got the information she wanted about the main mine in Solstheim. She tells the player that she is indeed Bjorn's sister and leaves.

The player must now rescue Bjorn, so they free Ulain and Roggvar and head to a new mine, Darkstone Mine, indicated by Ulain. There, they overhear a bandit say that when the slaves arrive in Solstheim, they are killed. Ulain leaves, and the mine overseer asks Roggvar to help with the slaves. Upon seeing this, Bjorn kills Roggvar with a pickaxe. Bjorn and the player then discuss the events and the revelation that Little Shadow is indeed his sister. Bjorn is worried but must wait for a letter from her to find out where she is.`,
		},
		{
			title: "Cold Dread",
			slug: "cold-dread",
			order: 7,
			isMainQuest: true,
			summary:
				"After talking to Bjorn, the player decides to tell Thruzar the truth. Upon arriving in Nordholm, they find Barni alone and Lorzub gone to fight.",
			description: `Now, after the player talks to Bjorn about Thurak, the monster, they decide to go to Thruzar and tell him the whole truth. They return to the Riften Watchtower but only find Shagra. She explains that Thruzar left because of her Skooma addiction. One day, she went out to buy some, and when she came back, he was gone. She hands the player a letter from Thruzar, addressed to the player, saying he has returned to the Stronghold. Shagra asks the player to take her to Lorzub because she needs his wise counsel, and the stage changes to "Take Shagra to Lorzub."

Upon arriving in Nordholm, the player finds Barni alone. He explains that Lorzub heard screams and went to the Stronghold to help. The old orc is now fighting alongside Thruzar. Barni, visibly worried, tells the player what happened. Shagra offers to stay with Barni while the player and Bjorn go to the Stronghold, as the orcs might be in danger. What the player and Bjorn find is Thurak, loose in the courtyard, fighting Thruzar, Lorzub is already dead, having fallen in the battle. The two of them need to help Thruzar. This time, Thurak can be killed.

After the fight, the player reveals to Thruzar in an emotional conversation that Thurak was his father. Thruzar tells them that the tunnel leading to the necromancers' lair in the mine has been reopened. They follow the tunnel to kill the necromancers.

After all of this, the player receives the first letter from Little Shadow, saying that she has arrived in Solstheim but that Ulain had misled her about the location.`,
		},
		{
			title: "Soul Chains",
			slug: "soul-chains",
			order: 8,
			isMainQuest: true,
			summary:
				"Little Shadow reveals she was deceived by Ulain. Mercenaries are sent after the player. Bjorn and the player must rescue Adielle from Groshak and Molag Bal.",
			description: `Little Shadow sends the first message, explaining that she couldn’t locate the mine. She was deceived by Ulain, but during her investigation she uncovered something more troubling: mercenaries are being hired to kill the player and Bjorn. If the player has already completed her side quests, she reveals her true identity as “The Watcher.”

Soon after, three mercenaries are sent after the player. They wield enchanted ebony swords and carry bounty letters signed by Groshak, promising further rewards if they succeed.

That night, the player goes to sleep and, upon waking, finds a note from Bjorn asking them to meet him at the New Gnisis Cornerclub in Windhelm. When the player arrives, they overhear a conversation between Bjorn and Ulain. Bjorn has received a letter from Groshak claiming that his sister, Adielle, is being held captive. Groshak demands the player’s soul in exchange for her life. Bjorn pretends to accept the deal to learn Adielle’s location, then kills Ulain once the truth is revealed. The player confronts Bjorn, and together they set out for the mine.

At the mine, they discover enslaved zombie workers and Solstheim warriors guarding the area with enchanted weapons. After clearing the mine, they uncover a hidden forge. Inside, Adielle is found imprisoned in a cage, reduced to an undead state. Groshak awaits them, accompanied by Uglarz, Thruzar’s mother, also raised as a zombie.

Groshak is surprised to see the player alive. He is a towering orc clad in ebony armor, arrogant and cruel. During the battle, Groshak becomes possessed by Molag Bal, who intervenes directly. Molag Bal declares that Groshak has proven insufficient on his own and that he requires a greater design. He offers to restore Adielle — not as she was, but as a vampire, binding her fate beyond the mortal world. Adielle’s soul, though damaged, is not yet lost.

Molag Bal makes it clear that this is not a bargain meant for the player. Instead, Adielle herself is of value. Interfering will leave her soul trapped in Oblivion, but allowing the ritual will return her to unlife. The player is forced to decide on her behalf, as Adielle is unable to choose in her current state. Bjorn struggles with the decision but ultimately allows the player to decide, admitting that standing still will not save her.

If the player allows the ritual to proceed, Molag Bal withdraws, Groshak is freed from possession, and the battle resumes. Adielle is restored as a vampire and joins the fight against Groshak. After Groshak is defeated, Bjorn secretly binds his soul into a Black Soul Gem, refusing to destroy it outright.

In the aftermath, Adielle survives but remembers little of what happened inside the forge. She is aware only that something fundamental has changed within her. Molag Bal’s presence lingers as a shadow rather than an open threat, and the consequences of Adielle’s transformation are left unresolved — setting the stage for future choices involving trust, redemption, and the lingering influence of the Daedric Prince.`,
		},
	];

	for (const quest of quests) {
		const existingQuest = await prisma.quest.findUnique({
			where: { slug: quest.slug },
		});

		if (!existingQuest) {
			await prisma.quest.create({
				data: quest,
			});
			console.log(`Created quest: ${quest.title}`);
		} else {
			console.log(`Quest already exists: ${quest.title}`);
		}
	}

	const songs = [
		{
			title: "The Dragonborn Comes",
			description: "Bjorn's raw rendition of the classic prophecy.",
			fileName: "00-TheDragonbornComes.wav",
		},
		{
			title: "Steel And Mead",
			description: "A drinking song for those who live by the sword.",
			fileName: "01-SteelAndMead.wav",
		},
		{
			title: "The Winter Kept Her Voice",
			description: "A melancholic ballad about loss and silence.",
			fileName: "02-TheWinterKeptHerVoice.wav",
		},
		{
			title: "The Mead is Gone but the Fire Remains",
			description: "Reflecting on what stays when the party ends.",
			fileName: "03-TheMeadisGonebuttheFireRemains.wav",
		},
		{
			title: "No Road Leads Back",
			description: "A song about moving forward when there is no return.",
			fileName: "04-NoRoadLeadsBack.wav",
		},
		{
			title: "Where the Storm Ends",
			description: "Searching for peace in a land of turmoil.",
			fileName: "05-WheretheStormEnds.wav",
		},
		{
			title: "By the Nine",
			description: "A hymn to the divines, sung with rough reverence.",
			fileName: "06-By the Nine.wav",
		},
		{
			title: "The One With The Voice",
			description: "Honoring the power of the Thu'um.",
			fileName: "07-TheOneWithTheVoice.wav",
		},
	];

	for (const s of songs) {
		const existing = await prisma.song.findFirst({
			where: { title: s.title },
		});
		if (!existing) {
			await prisma.song.create({ data: s });
			console.log(`Created song: ${s.title}`);
		} else {
			console.log(`Song already exists: ${s.title}`);
		}
	}

	console.log("Seeding FAQs...");
	const faqs = [
		{
			question: "How do I start Bjorn's quest line?",
			answer: "You can find Bjorn at the Whitewatch Tower. The quest can be started by visiting the tower directly or by hearing rumors in Riverwood or Whiterun.",
			category: "Quests",
			order: 1,
		},
		{
			question: "Can I romance Bjorn?",
			answer: "Bjorn has a full romance arc that develops as you complete his personal quests and increase your affinity with him.",
			category: "Romance",
			order: 2,
		},
		{
			question: "Is Bjorn compatible with other follower mods?",
			answer: "Yes, Bjorn uses his own follower system and should be compatible with AFT, NFF, and other follower managers. However, it is recommended to NOT manage him through these mods to avoid breaking his custom AI.",
			category: "Compatibility",
			order: 3,
		},
	];

	for (const faq of faqs) {
		const existing = await prisma.fAQ.findFirst({
			where: { question: faq.question },
		});
		if (!existing) {
			await prisma.fAQ.create({ data: faq });
			console.log(`Created FAQ: ${faq.question}`);
		} else {
			await prisma.fAQ.update({
				where: { id: existing.id },
				data: {
					answer: faq.answer,
					category: faq.category,
					order: faq.order,
				},
			});
			console.log(`Updated FAQ: ${faq.question}`);
		}
	}

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
