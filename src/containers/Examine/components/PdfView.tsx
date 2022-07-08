import React from 'react';
import { Document, pdfjs } from 'react-pdf';

import PdfPage from './PdfPage';
import styles from './PdfView.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default class PdfView extends React.Component<any, any> {
  pdfPageViewRefList: Record<string, PdfPage> = {};

  pdfViewerRef: any;

  rootRef: any;

  constructor(props: any) {
    super(props);
    this.pdfViewerRef = React.createRef();
    this.rootRef = React.createRef();

    this.state = {
      pdfDoc: null,
      oWidth: 0,
      oHeight: 0
    };
  }

  /*
  setCurrentPage = (pageNo: number) => {
    const index = `page-${pageNo}`;
    this.pdfPageViewRefList[index].scrollIntoView();
  };
  */
  // eslint-disable-next-line react/no-unused-class-component-methods
  getCurrentScale = () => {
    return this.pdfPageViewRefList['page-1'] ? this.pdfPageViewRefList['page-1'].getScale() : 0;
  };

  // eslint-disable-next-line class-methods-use-this
  pdfJsGetPage = async (doc: any, pageNo: number) =>
    new Promise((resolve, reject) => {
      doc
        .getPage(pageNo)
        .then((page: any) => {
          resolve(page);
        })
        .catch((error: any) => {
          reject(error);
        });
    });

  getDimension = async (pdfDoc: any) => {
    const scale = 1;
    const page = await this.pdfJsGetPage(pdfDoc, 1);
    // @ts-ignore
    const vp = page.getViewport({ scale });
    this.setState({
      oWidth: vp.width,
      oHeight: vp.height
    });
  };

  onDocumentLoadSuccess = (pdfDoc: any) => {
    const { onPdfLoadSuccess } = this.props;
    this.getDimension(pdfDoc);
    this.setState({
      pdfDoc
    });
    onPdfLoadSuccess(pdfDoc);
  };

  render() {
    const { pdfData, onPdfLoadError, scale, width } = this.props;
    const { pdfDoc, oWidth, oHeight } = this.state;
    if (pdfData === null) {
      return '';
    }
    return (
      <div role="button" className={styles.container} ref={this.rootRef}>
        <div className={styles.left}>&nbsp;</div>
        <Document
          ref={this.pdfViewerRef}
          file={pdfData}
          onLoadSuccess={this.onDocumentLoadSuccess}
          onLoadError={onPdfLoadError}
          className={styles.pdf_doc}
        >
          {pdfDoc
            ? Array.from(new Array(pdfDoc.numPages), (page, index) => (
                <div key={`page-${index + 1}`}>
                  <PdfPage
                    ref={(ref) => {
                      this.pdfPageViewRefList[`page-${index + 1}`] = ref ?? ({} as PdfPage);
                    }}
                    // id={`page-${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    width={width}
                    oWidth={oWidth}
                    oHeight={oHeight}
                  />
                  <p>
                    {index + 1} / {pdfDoc ? pdfDoc.numPages : ''}
                  </p>
                </div>
              ))
            : ''}
        </Document>
        <div className={styles.right}>&nbsp;</div>
      </div>
    );
  }
}
