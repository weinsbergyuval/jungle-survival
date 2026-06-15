import { PrismaClient } from '@prisma/client';

// Data layer with a graceful fallback: if PostgreSQL is reachable we use
// Prisma; otherwise we keep everything in memory so the app is fully playable
// locally without any database install. In production (Railway) the real DB is
// always present, so the in-memory path never runs there.
let mode = 'memory';
let prisma = null;

const mem = { users: new Map(), scores: [], userSeq: 1, scoreSeq: 1 };

export async function initStore() {
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.user.count(); // confirms the schema is actually migrated
    mode = 'prisma';
    console.log('🗄️  Connected to PostgreSQL');
  } catch {
    mode = 'memory';
    if (prisma) await prisma.$disconnect().catch(() => {});
    prisma = null;
    console.warn('⚠️  No database reachable — using in-memory store (resets on restart).');
  }
  return mode;
}

export async function upsertUser(name) {
  if (mode === 'prisma') {
    return prisma.user.upsert({ where: { name }, update: {}, create: { name } });
  }
  let user = mem.users.get(name);
  if (!user) {
    user = { id: mem.userSeq++, name, createdAt: new Date() };
    mem.users.set(name, user);
  }
  return user;
}

export async function createScore({ userId, character, score, wave }) {
  if (mode === 'prisma') {
    return prisma.score.create({ data: { userId, character, score, wave } });
  }
  const row = { id: mem.scoreSeq++, userId, character, score, wave, createdAt: new Date() };
  mem.scores.push(row);
  return row;
}

export async function topScores() {
  if (mode === 'prisma') {
    const scores = await prisma.score.findMany({
      take: 10,
      orderBy: { score: 'desc' },
      include: { user: { select: { name: true } } },
    });
    return scores.map((s, i) => ({
      rank: i + 1,
      name: s.user.name,
      character: s.character,
      score: s.score,
      wave: s.wave,
      date: s.createdAt,
    }));
  }
  const nameOf = (id) => [...mem.users.values()].find((u) => u.id === id)?.name ?? 'Unknown';
  return [...mem.scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s, i) => ({
      rank: i + 1,
      name: nameOf(s.userId),
      character: s.character,
      score: s.score,
      wave: s.wave,
      date: s.createdAt,
    }));
}
