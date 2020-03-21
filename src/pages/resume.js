import React, { useState } from "react";
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import doc from '../images/resume.pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import Layout from "../components/layouts/layout";

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

const ResumePage = () => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  return (
      <Layout>
        <div className="w-full">
          <div className="container-inner mx-auto flex items-center justify-around py-12 overflow-x-auto min-h-screen">
            <Document
              file={doc}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
                <Page
                  pageNumber={1}
                />
            </Document>
          </div>
        </div>
         </Layout>
        )
}

export default ResumePage;
