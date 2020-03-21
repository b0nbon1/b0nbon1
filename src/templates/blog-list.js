import React from "react"
import { Link, graphql } from "gatsby"
import Layout from '../components/layouts/blogList'; 
import Card from '../components/blog/blog-card';

const BlogIndex = ({ data }) => {
  const { nodes: posts } = data.allMdx

  const Featured = () => {
    const article = posts.find((post) => post.frontmatter.featured === true);
    console.log(article)
    if(article) {
      return (
      <div className={`min-h-72 w-full bg-${article.frontmatter.color}-300 flex flex-col md:flex-row justify-around items-center`}>
        <div className="text-left w-1/3">
          <h6 className="text-sm text-gray-600">Featured Article</h6>
          <Link to={article.fields.slug}>
            <h1 className="text-xl font-bold text-gray-900 hover:underline">{article.frontmatter.title}</h1>
          </Link>
        </div>
        <div className="w-1/4">
          <img src={article.frontmatter.img.publicURL} alt="featured article" />
        </div>
      </div>
      )
    }
    return <></>
  }

  return (
    <div>
      <Layout>
        <div className="mt-10">
          <Featured />
          <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-2 ml-4">
            {posts.map((post) => (
                <div key={post.id}>
                  <Link to={post.fields.slug}>
                    <Card post={post.frontmatter} excerpt={post.excerpt} read={post.timeToRead} />
                  </Link>
                </div>
              ))}
            </div>
        </div>
      </Layout>
    </div>
  )
}

export const pageQuery = graphql`
  query blogListQuery ($skip: Int!, $limit: Int!) {
    allMdx (
      sort: { fields: [frontmatter___title], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        excerpt
        timeToRead
        frontmatter {
          title
          tags
          color
          date
          featured
          description
          img {
            extension
            publicURL
          }
        }
        fields {
          slug
        }
      }
    }
  }
`

export default BlogIndex
