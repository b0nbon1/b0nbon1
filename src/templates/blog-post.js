import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import "prismjs/themes/prism.css"
import Footer from "../components/layouts/footer";


export default function PageTemplate({ data: { mdx } }) {

  return (
    <div className="flex flex-col">
      <div className="text-gray-900 dark:text-gray-100 container-inner mx-auto font-sans">
        <h1 className="text-4xl font-bold">{mdx.frontmatter.title}</h1>
        <div className='style-mdx'>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </div>
      </div>
      <div className="my-20"/>
      <Footer />
    </div>
  )
}
export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`