/** @jsx jsx */
import { jsx } from 'theme-ui'
import Footer from "./Footer";
import Header from "./Header";
import Seo from "./seo";


const Layout = ({ title, children }) => (
<div
sx={{
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  width: ['90%', '80%', '70%'],
}}
>
  <Header />
    <Seo title={title} />
    <main
      sx={{
        flexGrow: 1,
        position: 'relative',
      }}
    >
      {children}
    </main>
  <Footer />
</div>
);

export default Layout;