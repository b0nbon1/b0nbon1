/** @jsx jsx */
import { Link } from 'gatsby';
import { Box, jsx, Paragraph, Text } from 'theme-ui'

const Astyle = {
  color: 'var(--theme-ui-colors-textMuted)',
  ':hover': {
    color: 'var(--theme-ui-colors-text)'
  }
};

const Now = () => {
  return (
    <Box sx={{ mt: 3 }}>
      <Text sx={{ color: 'var(--theme-ui-colors-textMuted)' }}>Last updated: June 1, 2022</Text>
      <div sx={{ display: 'flex', mt: 2 }}>
        <Link sx={Astyle} to="/now">Now</Link>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="https://github.com/b0nbon1">Github</a>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="https://www.linkedin.com/in/bonvic-bundi/">LinkedIn</a>
        <span sx={{ mx: 2 }}>|</span>
        <a sx={Astyle} href="mailto:bundi.bonvic@gmail.com">Email</a>
      </div>
      <Paragraph sx={{ mt: 3 }}>Here's an overview of what I'm doing now:</Paragraph>
      <ul>
        <li>Developing softwares at <a sx={Astyle} href="https://business.safaricom.co.ke/">Safaricom plc</a></li>
        <ul>
          <li>Mostly front-end web development</li>
          <ul>
            <li>Nextjs(reactjs, material.ui, graphql, etc)</li>
            <li>Nodejs with expressjs</li>
            <li>AWS (cloudwatch, S3, lambda)</li>
          </ul>
        </ul>
        <li>Learning rustlings</li>
        <li>I'm looking for a different path in  tech</li>
        <li>Reading: </li>
        <ul>
          <li>The Rust Programming Language - <i>Steve Klabnik and Carol Nichols</i></li>
          <li>Designing Data-intensive applications - <i>Martin Kleppman</i></li>
        </ul>
        <li sx={{ mb: 2 }}>Listen to my playlist on spotify:</li>
        <iframe title="my listens" src="https://open.spotify.com/embed/playlist/37i9dQZF1EQqFPe2ux3rbj?utm_source=generator" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </ul>
    </Box>
  );
};

export default Now;
