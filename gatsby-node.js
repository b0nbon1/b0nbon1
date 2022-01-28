const path = require("path")
const _ = require("lodash")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve("src/templates/blog-post.js")
  const tagTemplate = path.resolve("src/templates/tags.js")

  const result = await graphql(`
    {
      postsRemark: allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2000
      ) {
          nodes {
            slug
            id
            frontmatter {
              tags
              date(fromNow: true)
              title
            }
          }
      }
      tagsGroup: allMdx(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `)

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`🚨  Error while running GraphQL query.`)
    return
  }

  const posts = result.data.postsRemark?.nodes

  // Create post detail pages
  posts.forEach((node) => {
    createPage({
      path: `/writings/${node.slug}`,
      component: blogPostTemplate,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    })
  })

  // Extract tag data from query
  const tags = result.data.tagsGroup.group

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}