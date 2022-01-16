import * as React from "react"
import BlogList from "../components/BlogList"
import Layout from "../components/layout/Layout"

const BlogsPage = () => {
  return (
    <Layout title="Blogs">
      <BlogList />
    </Layout>
  )
}

// query blogListQuery ($skip: Int!, $limit: Int!) {
//   allMdx (
//     sort: { fields: [frontmatter___date], order: DESC }
//     limit: $limit
//     skip: $skip
//   ) {
//     nodes {
//       id
//       excerpt
//       timeToRead
//       frontmatter {
//         title
//         tags
//         date
//         featured
//         description
//       }
//       slug
//     }
//   }

export default BlogsPage
