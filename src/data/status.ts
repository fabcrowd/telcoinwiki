export type PhaseStatusKey = 'devnet' | 'publicTestnet' | 'mainnet';

export type ProgressState = 'in-progress' | 'upcoming' | 'complete';

export interface PhaseHighlight {
  label: string;
}

export interface PhaseEntry {
  id: PhaseStatusKey;
  name: string;
  headline: string;
  summary: string;
  status: ProgressState;
  badgeLabel: string;
  highlights: PhaseHighlight[];
}

export interface PhaseOverviewData {
  lastUpdated: string;
  overallTrajectory: number;
  phases: PhaseEntry[];
}

export interface AuditCallout {
  label: string;
  value: string;
  helperText?: string;
}

export interface AuditTableRow {
  severity: string;
  publicFacing: number;
  afterFixes: number;
}

export interface SecurityAuditsData {
  highlights: string[];
  summary: AuditCallout;
  findings: AuditTableRow[];
  afterFixesSummary: AuditCallout;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  status: ProgressState | 'planned';
  description?: string;
}

export interface RoadmapData {
  milestones: RoadmapMilestone[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LearnMoreLink {
  label: string;
  href: string;
}

export interface LearnMoreData {
  faqs: FaqItem[];
  links: LearnMoreLink[];
}

export interface StatusData {
  phaseOverview: PhaseOverviewData;
  securityAudits: SecurityAuditsData;
  roadmap: RoadmapData;
  learnMore: LearnMoreData;
}

export const statusData: StatusData = {
  phaseOverview: {
    lastUpdated: '23 Sept 2025, 19:00 UTC',
    overallTrajectory: 0.25,
    phases: [
      {
        id: 'devnet',
        name: 'Devnet',
        headline: 'Testing the final high-privacy shield systems before public release.',
        summary:
          'Devnet is delivering public-facing fixes in flight. Design work is wrapping up quickly to patch remaining combo bugs.',
        status: 'in-progress',
        badgeLabel: 'In progress',
        highlights: [
          { label: 'Addressing public-facing findings (3 high, 5 medium)' },
          { label: 'Rerunning audit patches on every deploy to patch medium combos' },
          { label: 'Design complete for coverage gap patch' },
          { label: 'Extend peer coverage per patch' },
        ],
      },
      {
        id: 'publicTestnet',
        name: 'Public Testnet',
        headline: 'Testnet will onboard stable Devnet releases before enabling public validators.',
        summary:
          'Public Testnet will involve MMO-run validator nodes. Once stable, Devnet wins clear the path to open testing.',
        status: 'upcoming',
        badgeLabel: 'Upcoming',
        highlights: [
          { label: 'Finalize Devnet relaunch' },
          { label: 'Rollout aligned with MMO nodes' },
          { label: 'Security testing + audit fixes' },
          { label: 'Open community soak testing' },
        ],
      },
      {
        id: 'mainnet',
        name: 'Mainnet',
        headline: 'Mainnet follows Testnet stability and final security hardening.',
        summary:
          'Alpha beta area to upgrade tracks like (finance improvements). Once security coverage is complete, production release begins.',
        status: 'upcoming',
        badgeLabel: 'Upcoming',
        highlights: [
          { label: 'Finalize production code' },
          { label: 'Go/No-Go readiness review' },
          { label: 'Compliance & regulatory reporting' },
          { label: 'Confirm rollout sequencing' },
        ],
      },
    ],
  },
  securityAudits: {
    highlights: [
      'Major architectural changes complete (one in progress).',
      'Every patch this sprint added tests (caught 3 bugs missed in audit).',
      'Another audit companion - enable insurance + 24/7 post-launch coverage.',
    ],
    summary: {
      label: 'Priority Findings (public-facing)',
      value: 'Devnet',
      helperText: 'Live view of open issues discovered in latest audits.',
    },
    findings: [
      { severity: 'High', publicFacing: 3, afterFixes: 0 },
      { severity: 'Medium', publicFacing: 5, afterFixes: 2 },
      { severity: 'Low', publicFacing: 4, afterFixes: 3 },
      { severity: 'Info', publicFacing: 5, afterFixes: 4 },
    ],
    afterFixesSummary: {
      label: 'After Priority Fixes (remaining)',
      value: 'Low: 36',
      helperText: 'Remaining backlog once all priority fixes ship to production.',
    },
  },
  roadmap: {
    milestones: [
      {
        id: 'fix-vulnerabilities',
        title: 'Fix remaining vulnerabilities',
        status: 'in-progress',
        description: 'Patch backlog items uncovered during the latest audit cycle.',
      },
      {
        id: 'relaunch-devnet',
        title: 'Relaunch Devnet',
        status: 'planned',
        description: 'Stabilize shielded transactions and redeploy public Devnet with fixes.',
      },
      {
        id: 'launch-testnet',
        title: 'Launch Public Testnet',
        status: 'planned',
        description: 'Invite validators and the community to run the MMO-aligned network.',
      },
      {
        id: 'final-audits',
        title: 'Final audits & completion',
        status: 'planned',
        description: 'Complete final pass with audit partners and confirm green light.',
      },
      {
        id: 'mainnet-launch',
        title: 'Mainnet launch',
        status: 'planned',
        description: 'Production go-live once readiness reviews are complete.',
      },
    ],
  },
  learnMore: {
    faqs: [
      {
        id: 'what-is-devnet',
        question: 'What is Devnet?',
        answer:
          'Devnet is our private integration environment where protocol upgrades and security fixes incubate before they reach public testing.',
      },
      {
        id: 'what-is-testnet',
        question: 'What is Public Testnet?',
        answer:
          'Public Testnet enables community validator participation and lets us soak-test new releases in a high-fidelity environment.',
      },
      {
        id: 'what-is-mainnet',
        question: 'What is Mainnet?',
        answer:
          'Mainnet is the production-ready network with finalized compliance sign-off, formal security validation, and monitored operations.',
      },
    ],
    links: [
      { label: 'Governance Forum', href: 'https://forum.telcoin.com' },
      { label: 'Technical Docs', href: 'https://docs.telcoin.com' },
      { label: 'Audit Reports (post-publication)', href: 'https://telcoin.com/audits' },
    ],
  },
};

