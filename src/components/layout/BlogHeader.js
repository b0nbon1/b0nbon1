/** @jsx jsx */
import { Button, Heading, jsx, Text, useColorMode } from 'theme-ui'
import { StaticImage } from "gatsby-plugin-image"
import { Link, navigate } from "gatsby"
import SunIcon from '../../images/SunIcon';
import MoonIcon from '../../images/MoonIcon';

const BlogHeader = ({ title, readTime, date }) => {
  const [mode, setMode] = useColorMode()
  return (
  <header
    sx={{
      mt: 20,
      mb: 10,
      pb: 2,
      borderBottom: `2px dotted var(--theme-ui-colors-muted)`,
    }}
  >
    <div
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Button
        onClick={(e) => {
          const next = mode === 'dark' ? 'light' : 'dark'
          setMode(next)
        }}
        sx={{
          bg: 'transparent',
          cursor: 'pointer',
          float: 'right',
          height: 64,
          width: 64,
        }}
      >
        {mode === 'light' ? <MoonIcon /> : <SunIcon /> }
      </Button>
      <Button
     sx={{
       bg: 'transparent',
       color: 'var(--theme-ui-colors-text)',
       cursor: 'pointer',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       ':hover span': {
         textDecoration: 'underline'
       },
      }}
       onClick={() => navigate(-1)}>
     <svg sx={{ mr: 2, fill: 'var(--theme-ui-colors-primary)' }} baseProfile="tiny"  id="Layer_1" version="1.2" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
       <path d="M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z"/>
      </svg>
      {" "}
      <Text>Go back</Text>
     </Button>
    </div>
    <Heading>{title}</Heading>
    <Heading sx={{ mt: 3 }} as="h4">{date}</Heading>
    <Text sx={{ fontSize: 1, mt: 1 }}>read time: {readTime} min</Text>
  </header>
  )
};

export default BlogHeader;