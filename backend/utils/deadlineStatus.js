import { CLOSING_SOON_DAYS } from "../constants/opportunityOptions.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getDeadlineStatus(deadline, now = new Date()) {
  const msLeft = new Date(deadline).getTime() - now.getTime();
  if (msLeft < 0) return "closed";
  if (msLeft <= CLOSING_SOON_DAYS * DAY_MS) return "closing-soon";
  return "open";
}

export function deadlineRangeForStatus(status, now = new Date()) {
  const soon = new Date(now.getTime() + CLOSING_SOON_DAYS * DAY_MS);
  switch (status) {
    case "upcoming":
      return { $gte: now };
    case "open":
      return { $gt: soon };
    case "closing-soon":
      return { $gte: now, $lte: soon };
    case "closed":
      return { $lt: now };
    default:
      return null;
  }
}
