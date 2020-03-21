import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

// const MyH1 = props => <h1 style={{ color: "tomato" }} {...props} />
// const MyParagraph = props => <p style={{ fontSize: "18px", lineHeight: 1.6 }} />

// const components = {
//   h1: MyH1,
//   p: MyParagraph,
// }



export default function PageTemplate({ data: { mdx } }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      require("prismjs/themes/prism-okaidia.css");
    } else {
      require("prismjs/themes/prism.css");
    }
  })
  return (
    <MDXProvider >
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl">{mdx.frontmatter.title}</h1>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </div>
    </MDXProvider>
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