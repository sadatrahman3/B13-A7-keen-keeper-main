import logoWordmark from '../assets/logo-xl.png'
import facebookIcon from '../assets/facebook.png'
import instagramIcon from '../assets/instagram.png'
import twitterIcon from '../assets/twitter.png'

function Footer() {
  const socialLinks = [
    { href: 'https://facebook.com', icon: facebookIcon, label: 'Facebook' },
    { href: 'https://instagram.com', icon: instagramIcon, label: 'Instagram' },
    { href: 'https://twitter.com', icon: twitterIcon, label: 'Twitter' },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img src={logoWordmark} alt="KeenKeeper" className="site-footer__brand" />
        <p>Be intentional about the people who matter to you.</p>
        <div className="site-footer__socials">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
            >
              <img src={link.icon} alt="" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer