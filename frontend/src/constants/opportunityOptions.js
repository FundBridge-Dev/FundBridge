export const OPPORTUNITY_TYPES = [
  "Grant",
  "Accelerator",
  "Fellowship",
  "Pitch Competition",
];

export const INDUSTRIES = [
  "AI",
  "Climate",
  "Consumer",
  "Education",
  "Fintech",
  "Hardware",
  "Health",
  "Social Impact",
];

export const STARTUP_STAGES = ["Idea", "Pre-seed", "Seed", "Series A"];

export const DEADLINE_STATUS_LABELS = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
};

export const STATUS_FILTER_OPTIONS = [
  { value: "upcoming", label: "Open or closing soon" },
  { value: "open", label: "Open" },
  { value: "closing-soon", label: "Closing soon" },
  { value: "closed", label: "Closed" },
  { value: "", label: "Any status" },
];

export const SORT_OPTIONS = [
  { value: "deadline-asc", label: "Deadline: soonest first" },
  { value: "deadline-desc", label: "Deadline: latest first" },
  { value: "amount-desc", label: "Amount: highest first" },
  { value: "amount-asc", label: "Amount: lowest first" },
  { value: "newest", label: "Newest posts" },
];

export const APPLICATION_STATUS_OPTIONS = [
  { value: "planning", label: "Planning to apply" },
  { value: "applied", label: "Applied" },
  { value: "skipped", label: "Skipped" },
];
