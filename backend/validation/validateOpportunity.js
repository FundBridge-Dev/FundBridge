import {
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  STARTUP_STAGES,
} from "../constants/opportunityOptions.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_AMOUNT = 100_000_000;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseDateInput(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function validateOpportunity(body = {}) {
  const errors = [];

  const title = text(body.title);
  const organization = text(body.organization);
  const type = text(body.type);
  const industry = text(body.industry);
  const stage = text(body.stage);
  const amount = Number(body.amount);
  const equityRequired = body.equityRequired;
  const eligibility = text(body.eligibility);
  const deadline = parseDateInput(body.deadline);
  const applicationLink = text(body.applicationLink);
  const description = text(body.description);

  if (title.length < 3 || title.length > 120) {
    errors.push("Title must be 3 to 120 characters.");
  }
  if (organization.length < 2 || organization.length > 100) {
    errors.push("Organization must be 2 to 100 characters.");
  }
  if (!OPPORTUNITY_TYPES.includes(type)) {
    errors.push("Choose a valid opportunity type.");
  }
  if (!INDUSTRIES.includes(industry)) {
    errors.push("Choose a valid industry.");
  }
  if (!STARTUP_STAGES.includes(stage)) {
    errors.push("Choose a valid startup stage.");
  }
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) {
    errors.push("Amount must be a number between 0 and 100,000,000.");
  }
  if (typeof equityRequired !== "boolean") {
    errors.push("Equity requirement must be true or false.");
  }
  if (eligibility.length < 10 || eligibility.length > 1000) {
    errors.push("Eligibility must be 10 to 1,000 characters.");
  }
  if (!deadline) {
    errors.push("Deadline must be a valid date.");
  }
  if (!isHttpUrl(applicationLink)) {
    errors.push("Application link must start with http:// or https://.");
  }
  if (description.length < 20 || description.length > 3000) {
    errors.push("Description must be 20 to 3,000 characters.");
  }

  return {
    errors,
    value: {
      title,
      organization,
      type,
      industry,
      stage,
      amount: Math.round(amount),
      equityRequired,
      eligibility,
      deadline,
      applicationLink,
      description,
    },
  };
}
