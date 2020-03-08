import React from "react";
import Layout from "../components/layouts/layout";
import SEO from "../components/seo";
import Hero from "../components/home/hero";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Hero />
  </Layout>
)

export default IndexPage
