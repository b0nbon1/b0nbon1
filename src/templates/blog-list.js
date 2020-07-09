import React, { useRef } from "react"
import { graphql } from "gatsby"
import TransitionLink, { TransitionPortal } from 'gatsby-plugin-transition-link'
import Layout from '../components/layouts/blogList'; 
import Card from '../components/blog/blog-card';
import SEO from '../components/seo';
import AniLink from "gatsby-plugin-transition-link/AniLink"
import { verticalAnimation, test } from '../utils/anims';

const BlogIndex = ({ data }) => {
  const { nodes: posts } = data.allMdx
  const layoutContents = useRef();
  const transitionCover = useRef();

  const Featured = () => {
    const article = posts.find((post) => post.frontmatter.featured === true);
    if(article) {
      console.log(article.frontmatter.bg)
      return (
      <div className={`min-h-72 w-full bg-${article.frontmatter.color}-300 flex flex-col md:flex-row justify-around items-center`}>
        <div className="text-left w-1/3">
          <h6 className="text-sm text-gray-600">Featured Article</h6>
          <AniLink paintDrip to={article.fields.slug} hex={article.frontmatter.bg}>
            <h1 className="text-xl font-bold text-gray-900 hover:underline">{article.frontmatter.title}</h1>
          </AniLink>
        </div>
        <div className="w-1/3">
          <img src={article.frontmatter.img.publicURL} alt="featured article" />
        </div>
      </div>
      )
    }
    return <></>
  }

  return (
    <div ref={layoutContents}>
      <Layout>
        <SEO title='Blog posts' />
        <div>
          <Featured />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-rows gap-2 ml-4">
            {posts.map((post) => (
                <div key={post.id}>
                  <TransitionLink
                    to={post.fields.slug}
                    exit={{
                      length: 1,
                      trigger: ({ exit }) => verticalAnimation(exit, 'down', transitionCover.current, layoutContents.current),
                      state: { test: 'exit state' },
                    }}
                    entry={{
                      delay: 1,
                      trigger: ({ entry, node }) => test(entry, node),
                    }}
                  >
                    <Card post={post.frontmatter} excerpt={post.excerpt} read={post.timeToRead} />
                  </TransitionLink>
                  <TransitionPortal>
                      <div
                        ref={transitionCover}
                        style={{
                          position: 'fixed',
                          background: post.frontmatter.bg,
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          transform: 'translateY(100%)',
                        }}
                      />
                    </TransitionPortal>
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
      sort: { fields: [frontmatter___date], order: DESC }
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
          bg
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
