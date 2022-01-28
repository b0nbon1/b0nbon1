/** @jsx jsx */
import { Link, useStaticQuery, graphql } from 'gatsby';
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

const BlogSection = () => {
  const data = useStaticQuery(graphql`
  query blogHomeQuery {
    allMdx(sort: {fields: frontmatter___date, order: DESC}, limit: 4) {
      nodes {
        id
        slug
        frontmatter {
          date(fromNow: true)
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
        <Heading>Latest Posts</Heading>
        <Link to="writings" sx={Astyle}>Read all posts</Link>
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
          <Text sx={{ color: 'var(--theme-ui-colors-textMuted)'}}>{post.frontmatter?.date} &#8212; {post.frontmatter?.tags?.join(", ")}</Text>
        </li>
        ))}
      </ul>
    </section>
  );
}

export default BlogSection;
