module.exports = {
  siteMetadata: {
    title: `Bonvic Bundi`,
    siteUrl: `https://www.bonvic.dev`,
    description: `Bonvic Bundi.
    I'm Bonvic Bundi, a software engineer based in Nairobi.`,
    author: `@b0nvic`,
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-155362194-1",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: `Bonvic's Portfolio & blog`,
          short_name: `Bon Blog`,
          description: `You can get all Bonvic's blog and about him on this application`,
          start_url: `/`,
          background_color: `#663399`,
          theme_color: `#663399`,
          display: `minimal-ui`,
          icon: `src/images/Bonbon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 970,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: false,
            }
          },
          // `gatsby-remark-static-images`,
          // {
          //   resolve:"@weknow/gatsby-remark-codepen",
          //   options: {
          //     theme: "dark",
          //     height: 400
          //   }
          // }
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/blog/`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
