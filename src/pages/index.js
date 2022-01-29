import * as React from "react"
import Layout from "../components/layout/Layout"
import Home from "../components/Home"
import BlogSection from "../components/Home/blogSection"

const IndexPage = () => {
  return (
      <Layout title="Home">
        <Home />
        <BlogSection />
      </Layout>
  )
}


export default IndexPage
