/** @jsx jsx */
import { jsx } from 'theme-ui'

const Footer = () => (
  <footer
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `2px dotted var(--theme-ui-colors-muted)`,
      marginX: 'auto',
      width: ['90%', '80%'],
      mb: 2,
      mt: 4,
    }}
  >
    <p>&copy; {new Date().getFullYear()} by Bonvic. All rights reserved.</p>
  </footer>
);

export default Footer;
