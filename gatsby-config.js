module.exports = {
  siteMetadata: {
    title: `Bonvic Bundi`,
    siteUrl: `https://www.bonvich.me`,
    description: `Bonvic Bundi Nyabuya.
    I'm Bonvic Bundi Nyabuya, a software engineer based in Nairobi currently`,
    author: `@bonvic7`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-155362194-1",
      },
    },
  ],
}
