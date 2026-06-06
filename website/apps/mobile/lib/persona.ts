/**
 * Placeholder user persona — used across all portal screens until tRPC + auth is wired.
 * Replace with real session data from trpc.portal.getSettings or auth context.
 */
export const USER = {
  firstName: 'Maya',
  fullName: 'Maya Lindqvist',
  initials: 'ML',
  role: 'Director of Operations',
} as const;

export const ORG = {
  name: 'Apex Regional Logistics',
  shortName: 'Apex Logistics',
} as const;
