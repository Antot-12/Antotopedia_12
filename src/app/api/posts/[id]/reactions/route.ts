import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { id: string };

const TYPES = ["likes", "love", "wow", "fire"] as const;
type TypeKey = (typeof TYPES)[number];

async function readCounts(postId: number) {
    const row = await prisma.postReaction.findUnique({ where: { postId } });
    return (
        row ?? {
            id: 0,
            postId,
            likes: 0,
            love: 0,
            wow: 0,
            fire: 0,
            createdAt: null,
            updatedAt: null,
        }
    );
}

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
    const { id } = await ctx.params;
    const postId = Number(id);
    if (!Number.isFinite(postId))
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const row = await readCounts(postId);
    return NextResponse.json(row);
}

export async function POST(req: NextRequest, ctx: { params: Promise<Params> }) {
    const { id } = await ctx.params;
    const postId = Number(id);
    if (!Number.isFinite(postId))
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const type = body?.type as TypeKey;
    const deltaRaw = Number(body?.delta ?? 1);
    const delta = Number.isFinite(deltaRaw) ? deltaRaw : 1;
    if (!TYPES.includes(type))
        return NextResponse.json({ error: "Bad type" }, { status: 400 });

    const updated = await prisma.$transaction(async (tx) => {
        const current = await tx.postReaction.findUnique({ where: { postId } });
        if (!current) {
            const base = { likes: 0, love: 0, wow: 0, fire: 0 } as Record<TypeKey, number>;
            const val = Math.max(0, (base[type] ?? 0) + delta);
            return tx.postReaction.create({
                data: { postId, ...base, [type]: val },
            });
        } else {
            const val = Math.max(0, (current as any)[type] + delta);
            return tx.postReaction.update({
                where: { postId },
                data: { [type]: val },
            });
        }
    });

    return NextResponse.json(updated);
}
