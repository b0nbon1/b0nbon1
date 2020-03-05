import React from 'react';
import { useStaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image';

export default () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "property.png" }) {
        childImageSharp {
          fluid(maxHeight: 850, maxWidth: 1700) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return <Img fluid={data.placeholderImage.childImageSharp.fluid} />
}