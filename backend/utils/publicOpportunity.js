import { getDeadlineStatus } from "./deadlineStatus.js";

export function isOpportunityOwner(req, doc) {
  return Boolean(req.user && doc?.ownerId && doc.ownerId.equals(req.user._id));
}

export function toPublicOpportunity(req, doc) {
  return {
    _id: doc._id,
    title: doc.title,
    organization: doc.organization,
    type: doc.type,
    industry: doc.industry,
    stage: doc.stage,
    amount: doc.amount,
    equityRequired: doc.equityRequired,
    eligibility: doc.eligibility,
    deadline: doc.deadline,
    applicationLink: doc.applicationLink,
    description: doc.description,
    ownerName: doc.ownerName,
    isSynthetic: Boolean(doc.isSynthetic),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    status: getDeadlineStatus(doc.deadline),
    isMine: isOpportunityOwner(req, doc),
  };
}
