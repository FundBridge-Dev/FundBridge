import "dotenv/config";
import bcrypt from "bcryptjs";
import { closeDB, connectDB } from "../myMongoDB.js";
import {
  createUser,
  createUserIndexes,
  findUserByUsername,
} from "../usersDB.js";
import {
  createOpportunityIndexes,
  deleteSyntheticOpportunities,
  insertManyOpportunities,
} from "../opportunitiesDB.js";
import {
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  STARTUP_STAGES,
} from "../../constants/opportunityOptions.js";

const RECORD_COUNT = 800;
const DEMO_USERNAME = "demo_daniel";
const DAY_MS = 24 * 60 * 60 * 1000;

const ORG_PREFIXES = [
  "Northstar",
  "Bright Path",
  "Harbor",
  "Summit",
  "Greenway",
  "Catalyst",
  "Lumen",
  "Riverbend",
  "Keystone",
  "Atlas",
  "Evergreen",
  "Bluebird",
];
const ORG_SUFFIXES = [
  "Foundation",
  "Ventures",
  "Fund",
  "Institute",
  "Labs",
  "Collective",
  "Partners",
  "Alliance",
];
const TITLE_ENDINGS = {
  Grant: ["Innovation Grant", "Impact Grant", "Research Grant", "Seed Grant"],
  Accelerator: ["Accelerator", "Launch Program", "Growth Accelerator"],
  Fellowship: ["Founder Fellowship", "Entrepreneur Fellowship"],
  "Pitch Competition": [
    "Pitch Competition",
    "Demo Day Challenge",
    "Pitch Night",
  ],
};
const AMOUNT_RANGES = {
  Grant: [5000, 250000],
  Accelerator: [25000, 500000],
  Fellowship: [10000, 100000],
  "Pitch Competition": [1000, 50000],
};
const EQUITY_CHANCE = {
  Grant: 0,
  Accelerator: 0.85,
  Fellowship: 0.1,
  "Pitch Competition": 0.05,
};
const ELIGIBILITY = [
  "Open to student founders enrolled at a U.S. university.",
  "Startups incorporated in the last 3 years with fewer than 10 employees.",
  "At least one founder must be from an underrepresented group.",
  "Teams must have a working prototype or pilot customers.",
  "Open to nonprofits and for-profit social enterprises.",
  "Founders based in North America who have raised under $1M.",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildOpportunity(index, owner, now) {
  const type = pick(OPPORTUNITY_TYPES);
  const industry = pick(INDUSTRIES);
  const stage = pick(STARTUP_STAGES);
  const organization = `${pick(ORG_PREFIXES)} ${pick(ORG_SUFFIXES)}`;
  const [minAmount, maxAmount] = AMOUNT_RANGES[type];

  const deadline = new Date(now.getTime() + randomInt(-60, 240) * DAY_MS);
  deadline.setUTCHours(23, 59, 59, 999);
  const createdAt = new Date(now.getTime() - randomInt(1, 90) * DAY_MS);

  return {
    title: `${industry} ${pick(TITLE_ENDINGS[type])}`,
    organization,
    type,
    industry,
    stage,
    amount: Math.round(randomInt(minAmount, maxAmount) / 500) * 500,
    equityRequired: Math.random() < EQUITY_CHANCE[type],
    eligibility: pick(ELIGIBILITY),
    deadline,
    applicationLink: `https://example.org/apply/opportunity-${index + 1}`,
    description: `${organization} offers ${type.toLowerCase()} support for ${stage} startups working in ${industry}. This is a synthetic record created for the FundBridge class demo.`,
    ownerId: owner._id,
    ownerName: owner.username,
    isSynthetic: true,
    createdAt,
    updatedAt: createdAt,
  };
}

async function ensureDemoUser() {
  const existing = await findUserByUsername(DEMO_USERNAME);
  if (existing) return existing;

  const password = process.env.DEMO_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("Set DEMO_PASSWORD (8+ characters) in backend/.env.");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  return createUser({ username: DEMO_USERNAME, passwordHash });
}

async function seed() {
  await connectDB();
  await createUserIndexes();
  await createOpportunityIndexes();

  const owner = await ensureDemoUser();
  const removed = await deleteSyntheticOpportunities();

  const now = new Date();
  const docs = Array.from({ length: RECORD_COUNT }, (_, index) =>
    buildOpportunity(index, owner, now)
  );
  const inserted = await insertManyOpportunities(docs);

  console.log(
    `Opportunities seeded: ${removed} old removed, ${inserted} inserted, owned by "${owner.username}".`
  );
}

try {
  await seed();
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDB();
}
