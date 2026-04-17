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

  const footerStyle = {
    backgroundColor: '#244034',
    color: '#ffffff',
    padding: '4rem 2rem',
    textAlign: 'center',
    width: '100%',
    margin: '0',
    border: 'none'
  }

  const innerStyle = {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
    margin: '0 auto',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem'
  }

  return (
    <footer className="site-footer" style={footerStyle}>
      <div className="site-footer__inner" style={innerStyle}>
        <img 
          src={logoWordmark} 
          alt="KeenKeeper" 
          className="site-footer__brand" 
          style={{ filter: 'brightness(0) invert(1)', height: '40px' }} 
        />
        <p style={{ margin: '0', fontSize: '1.1rem', opacity: '0.9' }}>
          Be intentional about the people who matter to you.
        </p>
        <div className="site-footer__socials" style={{ display: 'flex', gap: '1rem' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
            >
              <img src={link.icon} alt="" style={{ width: '32px', height: '32px' }} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer