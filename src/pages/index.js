import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout/Layout"
import Home from "../components/Home"

const IndexPage = () => {
  return (
      <Layout title="Home">
        <Home />
      </Layout>
  )
}

export default IndexPage
