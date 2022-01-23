/** @jsx jsx */
import { Box, jsx, Paragraph, Text } from 'theme-ui'

const Astyle = {
  color: 'var(--theme-ui-colors-text)'
};

const Now = () => {
  return (
    <Box sx={{ mt: 3 }}>
      <Text sx={{ color: 'var(--theme-ui-colors-textMuted)' }}>Last updated: Jan 23, 2022</Text>
      <Paragraph sx={{ mt: 3 }}>Here's an overview of what I'm doing now:</Paragraph>
      <ul>
        <li>Developing softwares at <a sx={Astyle} href="https://www.safaricom.co.ke/">Safaricom plc</a></li>
        <ul>
          <li>Mostly front-end web development</li>
          <ul>
            <li>Nextjs(reactjs, material.ui, graphql, etc)</li>
            <li>Nodejs with expressjs</li>
            <li>AWS (cloudwatch, S3, lambda)</li>
          </ul>
        </ul>
        <li>Taking a Machine learning and Data Science course at  <a sx={Astyle} href="https://zerotomastery.io/">Udemy ZTM</a></li>
        <li>Reading: </li>
        <ul>
          <li>Fluent Python - <i>Luciano Ramalho</i></li>
        </ul>
        <li sx={{ mb: 2 }}>Listen to my playlist on spotify:</li>
        <iframe title="my listens" src="https://open.spotify.com/embed/playlist/0RjxEOYd99Kcc1xas4FWt0" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </ul>
    </Box>
  );
};

export default Now;
