/** @jsx jsx */
import { Link, useStaticQuery, graphql } from 'gatsby';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Heading, jsx, Text } from 'theme-ui'

const Astyle = {
  color: 'var(--theme-ui-colors-textMuted)',
  ':hover': {
    color: 'var(--theme-ui-colors-text)'
  }
};

const BlogStyle = {
  color: 'var(--theme-ui-colors-text)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '18px',
  ':hover': {
    textDecoration: 'underline'
  }
}

const BlogList = () => {
  const data = useStaticQuery(graphql`
  query blogListQuery {
    allMdx(sort: {fields: frontmatter___date, order: DESC}, limit: 2000) {
      nodes {
        id
        slug
        frontmatter {
          date
          title
          tags
        }
      }
    }
  }
  `)

  return (
    <section sx={{
      alignItems: 'center',
      py: 3
    }}>
      <div
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Heading>Blogs</Heading>
        <Link to="/tags" sx={Astyle}>View all tags</Link>
      </div>
      <ul>
        {data.allMdx?.nodes?.map((post) => (
        <li 
        sx={{
          flexDirection: 'column',
          my: 4,
          listStyle: 'disc outside none'
        }}
        key={post.id}
        >
          <Link sx={BlogStyle} to={`/writings/${post.slug}`}>{post.frontmatter?.title}</Link>
          <div sx={{ mt: 2 }} />
          <Text sx={{ color: 'var(--theme-ui-colors-textMuted)'}}>{formatDistanceToNow(new Date(post.frontmatter?.date))} &#8212; {post.frontmatter?.tags?.join(", ")}</Text>
        </li>
        ))}
      </ul>
    </section>
  );
}

export default BlogList;
