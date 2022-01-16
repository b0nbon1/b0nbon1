/** @jsx jsx */
import { Link } from 'gatsby';
import { Heading, jsx, Paragraph } from 'theme-ui'

const Astyle = {
  color: 'var(--theme-ui-colors-textMuted)',
  ':hover': {
    color: 'var(--theme-ui-colors-text)'
  }
};

const Home = () => {
  return (
    <section sx={{
      alignItems: 'center',
      borderBottom: `2px dotted var(--theme-ui-colors-muted)`,
      pb: 5,
      mb: 4
    }}>
      <Heading sx={{ my: 2 }}>Bonvic Bundi</Heading>
      <Heading sx={{ my: 4 }}>Hi.</Heading>
      <Paragraph sx={{ mb: 10 }}>
        I 'm a Software engineer, ML enthusiast  and a blogger.
        I enjoy turning complex problems into simple, beautiful and intuitive.
      </Paragraph>
      <div sx={{ display: 'flex' }}>
        <Link sx={Astyle} to="/about">Now</Link>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="https://github.com/b0nbon1">Github</a>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="https://www.linkedin.com/in/bonvic-bundi/">LinkedIn</a>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="mailto:bundi.bonvic@gmail.com">Email</a>
      </div>
    </section>
  );
}

export default Home;
