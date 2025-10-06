const footerLinkGroups = [
  {
    title: 'Product & services',
    links: [
      { label: 'Telcoin Wallet', href: 'https://telco.in/wallet' },
      { label: 'Digital Cash', href: 'https://telco.in/digital-cash' },
      { label: 'Remittances', href: 'https://telco.in/remittances' },
      { label: 'Status page', href: 'https://status.telco.in' },
    ],
  },
  {
    title: 'Governance & documentation',
    links: [
      { label: 'Telcoin Association', href: 'https://www.telcoinassociation.org' },
      { label: 'Telcoin Network', href: 'https://www.telcoinassociation.org/network' },
      { label: 'TEL token', href: 'https://www.telcoinassociation.org/tel' },
      { label: 'TELx liquidity engine', href: 'https://www.telcoinassociation.org/telx' },
    ],
  },
  {
    title: 'Compliance & communications',
    links: [
      { label: 'Legal resources', href: 'https://telco.in/legal' },
      { label: 'Security newsroom', href: 'https://telco.in/newsroom/security' },
      { label: 'Telcoin newsroom', href: 'https://telco.in/newsroom' },
      { label: 'Telcoin on X', href: 'https://x.com/telcoin' },
    ],
  },
] as const

type FooterLinkGroup = (typeof footerLinkGroups)[number]

function FooterLinkGroupColumn({ title, links }: FooterLinkGroup) {
  return (
    <div>
      <h2 className="footer__title">{title}</h2>
      <ul className="footer__list">
        {links.map(({ label, href }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__cols">
          {footerLinkGroups.map((group) => (
            <FooterLinkGroupColumn key={group.title} {...group} />
          ))}
        </div>
        <p className="footer__note">
          Telcoin Wiki is an unofficial community resource. Confirm details with official Telcoin
          channels before making financial decisions.
        </p>
      </div>
    </footer>
  )
}
