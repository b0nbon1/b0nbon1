module.exports = {
  siteMetadata: {
    title: `Bonvic Bundi`,
    siteUrl: `https://www.nyabuya.com`,
    description: `Bonvic Bundi. Software Engineer based in Kigali, Rwanda. Mostly working with Javascript. Currently breaking stuff at Andela & Irembo.`,
    author: `@bonvic7`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        sitemapSize: 5000
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
        icon: `src/images/window.png`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-155362194-1",
      },
    },
  ],
}
