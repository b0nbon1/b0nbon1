/** @jsx jsx */
import { Button, jsx, useColorMode } from 'theme-ui'
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import SunIcon from '../../images/SunIcon';
import MoonIcon from '../../images/MoonIcon';

const Header = () => {
  const [mode, setMode] = useColorMode()
  return (
  <header
    sx={{
      mt: 20,
      mb: 10,
    }}
  >
    <div
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
      >
      <StaticImage
        src="../../images/Bonbon.png"
        alt="logo"
        sx={{
          width: 50,
          height: 50,
          cursor: 'pointer',
          ':hover': {
            width: 60,
            height: 60,
          }
        }}
      />
      </Link>
      <Button
        onClick={(e) => {
          const next = mode === 'dark' ? 'light' : 'dark'
          setMode(next)
        }}
        sx={{
          bg: 'transparent',
          cursor: 'pointer',
          height: 64,
          width: 64,
        }}
      >
        {mode === 'light' ? <MoonIcon /> : <SunIcon /> }
      </Button>
    </div>
    <nav
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `2px dotted var(--theme-ui-colors-muted)`,
        paddingBottom: 2
      }}
    >
      <div>
        <Link
        sx={{
          color: 'var(--theme-ui-colors-textMuted)',
          textDecoration: 'none',
          marginRight: '15px',
          ':hover': {
            color: 'var(--theme-ui-colors-text)'
          }
        }} 
        activeStyle={{ color: 'var(--theme-ui-colors-text)'}}
        to="/blogs">Writing</Link>
        <Link
        sx={{
          color: 'var(--theme-ui-colors-textMuted)',
          textDecoration: 'none',
          ':hover': {
            color: 'var(--theme-ui-colors-text)'
          }
        }}
        activeStyle={{ color: 'var(--theme-ui-colors-text)'}}
        to="/about">Now</Link>
      </div>
      <div>
        <Link
        sx={{
          color: 'var(--theme-ui-colors-textMuted)',
          marginRight: '15px',
          textDecoration: 'none',
          ':hover': {
            color: 'var(--theme-ui-colors-text)'
          }
        }}
        activeStyle={{ color: 'var(--theme-ui-colors-text)'}}
        to="/">Homepage</Link>
        <a
        href="https://twitter.com/b0nvic"
        sx={{
          color: 'var(--theme-ui-colors-textMuted)',
          textDecoration: 'none',
          ':hover': {
            color: 'var(--theme-ui-colors-text)'
          }
        }}
        to="/about">Twitter</a>
      </div>
    </nav>
  </header>
  )
};

export default Header;