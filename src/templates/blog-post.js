import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
// import { useColorMode } from 'theme-ui'
// import "../styles/vs-code-dark.css"
import BlogLayout from "../components/layout/BlogLayout";

export default function PageTemplate({ data: { mdx } }) {
  // const [colorMode] = useColorMode()
  require(`../styles/vs-code-dark.css`)
  return (
      <BlogLayout
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.description}
        readTime={mdx.timeToRead}
        date={mdx.frontmatter.date}
      >
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </BlogLayout> 
  )
}
export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        description
        tags
        date
      }
      timeToRead
    }
  }
`