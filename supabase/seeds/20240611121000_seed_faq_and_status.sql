begin;

insert into public.faq (id, question, answer_html, display_order)
values
    ('what-is-telcoin', 'What is Telcoin in one paragraph?', '<p>Telcoin pairs a global mobile-first financial app with the Telcoin Network, a carrier-secured EVM chain governed by the Telcoin Association. The ecosystem is designed to let users send money, hold digital cash, and interact with compliant DeFi services using their own smartphones.</p>', 1),
    ('what-is-the-telcoin-wallet', 'What is the Telcoin Wallet and what can it do?', '<p>The Telcoin Wallet is the official mobile app that lets verified users buy, sell, and store TEL alongside multi-currency digital cash. It provides direct access to Telcoin remittances, in-app swaps, and a secure account recovery path tied to your device and credentials.</p>', 2),
    ('where-can-i-send-remittances', 'Where can I send remittances today?', '<p>Telcoin currently supports remittance corridors across <span data-status-key="remittanceCorridors" data-status-format="plus">20+</span> countries, focusing on fast and low-cost mobile money payouts. Live corridor availability and fees are listed inside the Telcoin Wallet and on the official remittance corridors page.</p>', 3),
    ('what-is-digital-cash', 'What is Digital Cash?', '<p>Digital Cash is Telcoin’s multi-currency stablecoin suite, offering fiat-backed assets such as eUSD, eCAD, and ePHP that settle instantly on the Telcoin Network. These currencies are spendable in the Telcoin Wallet and integrate with remittances, merchant payouts, and TELx liquidity.</p>', 4),
    ('what-is-the-telcoin-network', 'What is the Telcoin Network?', '<p>The Telcoin Network is an EVM-compatible, proof-of-stake blockchain secured by mobile network operators who meet GSMA standards. It underpins Telcoin services and hosts smart contracts for digital cash, TEL staking, and TELx liquidity while remaining governed by the Telcoin Association.</p>', 5),
    ('what-is-tel', 'What is TEL (the token) used for?', '<p>TEL is the native asset of the Telcoin Network. It functions as network gas, powers staking and governance incentives, and serves as the unit of account for TELx liquidity programs that reward users who deepen ecosystem liquidity.</p>', 6),
    ('what-is-telx', 'What is TELx?', '<p>TELx is Telcoin’s liquidity layer that connects the Telcoin Wallet, Network, and partner DeFi protocols. It lets users supply TEL and digital cash to earn rewards, driving the regulated liquidity that powers in-app swaps and remittance throughput.</p>', 7),
    ('who-is-the-telcoin-association', 'Who is the Telcoin Association and what do they do?', '<p>The Telcoin Association is a Swiss Verein responsible for Telcoin Network governance, validator onboarding, and the issuance policies for TEL and Digital Cash. The Association stewards proposals, security reviews, and compliance frameworks in collaboration with community councils.</p>', 8),
    ('is-telcoin-compliant', 'Is Telcoin compliant?', '<p>Telcoin Holdings reports SOC 2 Type II attestation progress and operates a regulated digital asset bank in Nebraska, while the Association maintains governance that aligns with telecom and financial regulations. Legal resources and security updates are published on the official site.</p>', 9),
    ('where-to-find-updates', 'Where can I find official updates?', '<p>Official announcements ship through the Telcoin Newsroom, the Telcoin Status page, and verified social channels such as X (Twitter). You can also follow product updates directly inside the Telcoin Wallet for release notes and maintenance alerts.</p>', 10)
on conflict (id) do update set
    question = excluded.question,
    answer_html = excluded.answer_html,
    display_order = excluded.display_order,
    updated_at = now();

insert into public.faq_tag_labels (slug, label)
values
    ('getting-started', 'Getting Started'),
    ('network', 'Network'),
    ('wallet', 'Wallet'),
    ('remittances', 'Remittances'),
    ('digital-cash', 'Digital Cash'),
    ('governance', 'Governance'),
    ('tel-token', 'TEL Token'),
    ('defi-telx', 'DeFi/TELx'),
    ('compliance-security', 'Compliance & Security')
on conflict (slug) do update set
    label = excluded.label;

insert into public.faq_tags (faq_id, tag_id)
values
    ('what-is-telcoin', (select id from public.faq_tag_labels where slug = 'getting-started')),
    ('what-is-telcoin', (select id from public.faq_tag_labels where slug = 'network')),
    ('what-is-the-telcoin-wallet', (select id from public.faq_tag_labels where slug = 'wallet')),
    ('what-is-the-telcoin-wallet', (select id from public.faq_tag_labels where slug = 'getting-started')),
    ('where-can-i-send-remittances', (select id from public.faq_tag_labels where slug = 'remittances')),
    ('where-can-i-send-remittances', (select id from public.faq_tag_labels where slug = 'wallet')),
    ('what-is-digital-cash', (select id from public.faq_tag_labels where slug = 'digital-cash')),
    ('what-is-digital-cash', (select id from public.faq_tag_labels where slug = 'wallet')),
    ('what-is-the-telcoin-network', (select id from public.faq_tag_labels where slug = 'network')),
    ('what-is-the-telcoin-network', (select id from public.faq_tag_labels where slug = 'governance')),
    ('what-is-tel', (select id from public.faq_tag_labels where slug = 'tel-token')),
    ('what-is-tel', (select id from public.faq_tag_labels where slug = 'network')),
    ('what-is-telx', (select id from public.faq_tag_labels where slug = 'defi-telx')),
    ('what-is-telx', (select id from public.faq_tag_labels where slug = 'tel-token')),
    ('who-is-the-telcoin-association', (select id from public.faq_tag_labels where slug = 'governance')),
    ('who-is-the-telcoin-association', (select id from public.faq_tag_labels where slug = 'compliance-security')),
    ('is-telcoin-compliant', (select id from public.faq_tag_labels where slug = 'compliance-security')),
    ('is-telcoin-compliant', (select id from public.faq_tag_labels where slug = 'getting-started')),
    ('where-to-find-updates', (select id from public.faq_tag_labels where slug = 'getting-started')),
    ('where-to-find-updates', (select id from public.faq_tag_labels where slug = 'governance'))
on conflict do nothing;

insert into public.faq_sources (faq_id, label, url)
values
    ('what-is-telcoin', 'Telcoin overview', 'https://telco.in/'),
    ('what-is-telcoin', 'Telcoin Association overview', 'https://www.telcoinassociation.org'),
    ('what-is-the-telcoin-wallet', 'Telcoin Wallet', 'https://telco.in/wallet'),
    ('where-can-i-send-remittances', 'Remittance corridors', 'https://telco.in/remittances'),
    ('what-is-digital-cash', 'Digital Cash overview', 'https://telco.in/digital-cash'),
    ('what-is-the-telcoin-network', 'Telcoin Network', 'https://www.telcoinassociation.org/network'),
    ('what-is-the-telcoin-network', 'Telcoin Network overview', 'https://www.telcoinnetwork.org'),
    ('what-is-tel', 'TEL token overview', 'https://www.telcoinassociation.org/tel'),
    ('what-is-telx', 'TELx overview', 'https://www.telcoinassociation.org/telx'),
    ('what-is-telx', 'TELx pools', 'https://www.telx.network/pools'),
    ('who-is-the-telcoin-association', 'Telcoin Association', 'https://www.telcoinassociation.org'),
    ('is-telcoin-compliant', 'Security & compliance updates', 'https://telco.in/newsroom/security'),
    ('is-telcoin-compliant', 'Legal resources', 'https://telco.in/legal'),
    ('where-to-find-updates', 'Telcoin Newsroom', 'https://telco.in/newsroom'),
    ('where-to-find-updates', 'Status page', 'https://status.telco.in'),
    ('where-to-find-updates', 'Telcoin on X', 'https://x.com/telcoin')
on conflict (faq_id, url) do update set
    label = excluded.label;

insert into public.status_metrics (key, label, value, unit, update_strategy, notes)
values
    ('remittanceCorridors', 'Remittance corridors', 20, 'countries', 'manual', 'Seeded from status.json on static site')
on conflict (key) do update set
    label = excluded.label,
    value = excluded.value,
    unit = excluded.unit,
    update_strategy = excluded.update_strategy,
    notes = excluded.notes,
    updated_at = now();

commit;
