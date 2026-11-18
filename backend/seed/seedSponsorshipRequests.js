import { connectDB, closeDB } from "../db/myMongoDB.js";

const EVENT_TYPES = [
  "Hackathon",
  "Workshop",
  "Demo Day",
  "Conference",
  "Career Fair",
  "Product Launch",
];

const LOCATIONS = [
  "Boston, MA",
  "New York, NY",
  "Cambridge, MA",
  "Seattle, WA",
  "Austin, TX",
  "Chicago, IL",
  "Remote",
];

const BENEFITS = [
  "Logo placement, recruiting access, and social media promotion",
  "Speaking opportunity, booth space, and newsletter promotion",
  "Product demonstration, student access, and event branding",
  "Workshop sponsorship, resume access, and networking opportunities",
  "Website placement, event tickets, and recruiting visibility",
];

const DEMO_AUTHOR_ID = "demo-sponsorship-seed";
const TOTAL_RECORDS = 800;

function buildRequest(index) {
  const eventType = EVENT_TYPES[index % EVENT_TYPES.length];
  const location = LOCATIONS[index % LOCATIONS.length];
  const budget = 2500 + (index % 12) * 750;
  const amountRaised = Math.min(
    budget,
    Math.round(budget * ((index % 10) / 10))
  );
  const audienceSize = 50 + (index % 20) * 25;
  const eventDate = new Date("2027-01-01T00:00:00.000Z");

  eventDate.setUTCDate(eventDate.getUTCDate() + index);

  return {
    seedKey: `demo-sponsorship-${index + 1}`,
    authorId: DEMO_AUTHOR_ID,
    eventType,
    eventDate,
    budget,
    amountRaised,
    audienceSize,
    location,
    sponsorBenefits: BENEFITS[index % BENEFITS.length],
    description: `[DEMO DATA] Fictional ${eventType.toLowerCase()} sponsorship request for testing FundBridge search, filtering, sorting, pagination, and funding progress.`,
    isDemo: true,
    createdAt: new Date("2026-11-01T00:00:00.000Z"),
    updatedAt: new Date("2026-11-01T00:00:00.000Z"),
  };
}

async function seed() {
  const db = await connectDB();
  const collection = db.collection("sponsorshipRequests");
  // REVIEW: this recreates `seedKey_1` without the partialFilterExpression that
  // createSponsorshipRequestIndexes() in db/sponsorshipRequestsDB.js sets, and that
  // function already drops the plain version on startup. Seeding while the server is
  // running throws IndexOptionsConflict, and if the plain unique index survives, the
  // second user-created request fails with E11000 because they all have seedKey: null.
  // Suggest deleting this line and calling createSponsorshipRequestIndexes() instead.
  await collection.createIndex({ seedKey: 1 }, { unique: true });

  const records = Array.from({ length: TOTAL_RECORDS }, (_, index) =>
    buildRequest(index)
  );

  const result = await collection.bulkWrite(
    records.map((record) => ({
      updateOne: {
        filter: { seedKey: record.seedKey },
        update: { $set: record },
        upsert: true,
      },
    }))
  );

  console.log(
    `Sponsorship requests seeded: ${TOTAL_RECORDS} total, ${result.upsertedCount} new, ${result.modifiedCount} updated`
  );
}

try {
  await seed();
} catch (error) {
  console.error("Sponsorship request seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDB();
}
