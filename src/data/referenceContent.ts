export type PhaseState = 'complete' | 'active' | 'upcoming';

export interface ReferenceContent {
  hero: {
    title: string;
    description: string;
    lastUpdatedLabel: string;
  };
  currentPhase: {
    title: string;
    description: string;
    progress: {
      value: number;
      label: string;
      assistive: string;
    };
    cards: Array<{
      id: string;
      title: string;
      statusLabel: string;
      body: string;
      state: PhaseState;
      meta: string;
    }>;
  };
  security: {
    title: string;
    bullets: string[];
    statsTitle: string;
    statCards: Array<{
      id: string;
      label: string;
      value: string;
      caption: string;
    }>;
    tableTitle: string;
    tableRows: Array<{
      label: string;
      value: string;
    }>;
  };
  roadmap: {
    title: string;
    description: string;
    milestones: Array<{
      id: string;
      title: string;
      details: string;
      state: PhaseState;
    }>;
  };
  learnMore: {
    title: string;
    accordion: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
    actions: Array<{
      label: string;
      href: string;
    }>;
  };
}

export const referenceContent: ReferenceContent = {
  hero: {
    title: 'Telcoin Network Status Overview',
    description:
      'Placeholder copy describing the current release cadence, milestone focus, and where to monitor change-log updates for the network.',
    lastUpdatedLabel: 'Last refreshed from internal tracker: Pending sync'
  },
  currentPhase: {
    title: 'Current Phase Overview',
    description:
      'Draft notes outlining what each environment is tracking right now. Replace with imported HTML copy when available.',
    progress: {
      value: 48,
      label: 'Program increment completion',
      assistive: 'Overall roadmap completion is estimated at 48 percent.'
    },
    cards: [
      {
        id: 'devnet',
        title: 'Devnet Rollout',
        statusLabel: 'Experimentation Active',
        body: 'Placeholder tasks and features landing in the devnet environment. Swap once official content is imported.',
        state: 'active',
        meta: 'Tracking 7 open items'
      },
      {
        id: 'testnet',
        title: 'Testnet Hardening',
        statusLabel: 'Validation Underway',
        body: 'Temporary description for testnet QA, load testing, and community feedback loops.',
        state: 'upcoming',
        meta: 'Next checkpoint: Community sync call'
      },
      {
        id: 'mainnet',
        title: 'Mainnet Launch Prep',
        statusLabel: 'Sequencing',
        body: 'Holding text covering mainnet readiness, compliance sign-offs, and rollout playbooks.',
        state: 'upcoming',
        meta: 'Awaiting security sign-off'
      }
    ]
  },
  security: {
    title: 'Security & Audits',
    bullets: [
      'Placeholder bullet for current audit scope and lead firms.',
      'Add highlights about penetration testing and incident response drills.',
      'Include language for bug bounty cadence once imported.'
    ],
    statsTitle: 'Coverage overview',
    statCards: [
      {
        id: 'audit-count',
        label: 'Audits completed',
        value: '3',
        caption: 'Independent reviews across protocol, wallet, and infrastructure layers.'
      },
      {
        id: 'coverage',
        label: 'Security coverage',
        value: '82%',
        caption: 'Portion of smart contracts with published verification artifacts.'
      }
    ],
    tableTitle: 'Upcoming reviews',
    tableRows: [
      { label: 'Core protocol', value: 'Firm selection in progress' },
      { label: 'Wallet release', value: 'QA handoff scheduled' },
      { label: 'Infrastructure', value: 'Continuous monitoring expanding' }
    ]
  },
  roadmap: {
    title: 'Road to Mainnet',
    description:
      'High-level sequence of milestones leading up to the mainnet launch. Update once the official roadmap HTML is available.',
    milestones: [
      {
        id: 'milestone-1',
        title: 'Protocol feature freeze',
        details: 'Placeholder language for when devnet features stop landing for the release train.',
        state: 'complete'
      },
      {
        id: 'milestone-2',
        title: 'Testnet public participation',
        details: 'Temporary copy summarizing community validators joining the public testing window.',
        state: 'active'
      },
      {
        id: 'milestone-3',
        title: 'Security sign-off & compliance',
        details: 'Insert the final approval checklist from the imported content once available.',
        state: 'upcoming'
      },
      {
        id: 'milestone-4',
        title: 'Mainnet go-live',
        details: 'Holding text for launch communications, monitoring, and contingency planning.',
        state: 'upcoming'
      }
    ]
  },
  learnMore: {
    title: 'Learn More',
    accordion: [
      {
        id: 'learn-1',
        question: 'How frequently is this page updated?',
        answer: 'Use the importer script once the canonical HTML is available to sync the latest messaging from the program team.'
      },
      {
        id: 'learn-2',
        question: 'Where can developers engage?',
        answer:
          'Placeholder details on communication channels, contribution guidelines, and how to request deeper integration support.'
      },
      {
        id: 'learn-3',
        question: 'What happens after mainnet launch?',
        answer: 'Swap with post-launch roadmap copy when the original document is imported.'
      }
    ],
    actions: [
      { label: 'Read the governance brief', href: '#governance-brief' },
      { label: 'Join the builders community', href: '#builders-community' },
      { label: 'View status history', href: '#status-history' }
    ]
  }
};

export default referenceContent;
