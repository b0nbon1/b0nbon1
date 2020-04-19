import React from 'react';
import { useStaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image';

export default () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "Bonbon.png" }) {
        childImageSharp {
          fluid(maxHeight: 200, maxWidth: 200) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)

  return <Img fluid={data.placeholderImage.childImageSharp.fluid} />
}
