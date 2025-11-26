import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const tags = ["demo", "nextjs", "design"].map((t) => ({
        slug: t,
        name: t,
    }));

    for (const t of tags) {
        await prisma.tag.upsert({
            where: { slug: t.slug },
            update: {},
            create: t,
        });
    }

    await prisma.post.upsert({
        where: { slug: "demo-post" },
        update: {},
        create: {
            slug: "demo-post",
            title: "Demo Post",
            description: "This is a seeded demo post",
            contentMarkdown:
                "## Hello Neon\nThis post was created by **Prisma seed**.\n\n- Neon + Prisma\n- Next.js app\n\n<span style=\"color:#2ee7d8\">Colored text</span>",
            status: "published",
            tags: {
                connect: [{ slug: "demo" }, { slug: "nextjs" }],
            },
        },
    });

    console.log("✅ Seed complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
