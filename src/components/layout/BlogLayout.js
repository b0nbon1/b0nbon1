/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Global } from '@emotion/react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Footer from "./Footer";
import Seo from "./seo";
import BlogHeader from './BlogHeader';


const BlogLayout = ({ title, children, description, date, readTime }) => (
<div>
  <Global
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
        fontFamily: 'Menlo, monospace'
      },
    })}
  />
  <div
  sx={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    width: ['90%', '80%', '70%'],
  }}
  >
    <BlogHeader title={title} date={formatDistanceToNow(new Date(date))} readTime={readTime} />
      <Seo title={title} description={description} />
      <main
        sx={{
          flexGrow: 1,
          position: 'relative',
        }}
      >
        {children}
      </main>
    <Footer />
  </div>
</div>
);

export default BlogLayout;