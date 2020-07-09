import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Footer from "../components/layouts/footer";
import SEO from '../components/seo';
import "../styles/vs-code-dark.css"

export default function PageTemplate({ data: { mdx } }) {
  console.log(mdx.frontmatter)
  return (
    <div className="flex flex-col">
      <SEO title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <div className="text-gray-700 dark:text-gray-100 mx-auto font-mont w-full">
        <div className={`min-h-72 w-full bg-${mdx.frontmatter.color}-300 flex flex-col md:flex-row justify-around items-center`}>

          <div className="text-left w-1/3">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">{mdx.frontmatter.title}</h1>
          </div>
          <div className="w-10/12 md:w-1/2 lg:w-1/3">
            <img src={mdx.frontmatter.img.publicURL} alt="featured article" />
          </div>
      </div>
        <div className='style-mdx container-inner mx-auto'>
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
        title,
        description,
        color,
        img {
          extension
          publicURL
        },
        tags,
      }
    }
  }
`
