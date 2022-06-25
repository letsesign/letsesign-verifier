import React from 'react';
import { Page } from 'react-pdf';
import VisibilitySensor from 'react-visibility-sensor';

import styles from './PdfPage.scss';

export default class PdfPage extends React.Component {
  pageRef;

  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.state = {
      visibility: false
    };
  }

  static handlePageRendered = () => {};

  // eslint-disable-next-line react/no-unused-class-component-methods
  getScale = () => {
    const { scale, width } = this.props;
    let retScale = scale;
    if (this.pageRef.current && width && width !== 0 && scale === 0) {
      retScale = width / this.pageRef.current.state.page.originalWidth;
    }
    return retScale;
  };

  // eslint-disable-next-line react/no-unused-class-component-methods
  scrollIntoView = () => {
    const behavior = 'smooth';
    const options = { behavior };
    const element = document.querySelector(`[data-page-number="${this.pageRef.current.pageNumber}"]`);
    if (element) {
      element.scrollIntoView(options);
    }
  };

  render() {
    const { pageNumber, scale, width, oWidth, oHeight } = this.props;
    const { visibility } = this.state;
    return (
      <VisibilitySensor
        partialVisibility
        onChange={(isVisible) => {
          this.setState({ visibility: isVisible });
        }}
      >
        {visibility ? (
          <div>
            <Page
              renderMode="svg"
              ref={this.pageRef}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className={styles.pdf_page}
              onRenderSuccess={PdfPage.handlePageRendered}
              scale={scale && scale !== 0 ? scale : undefined}
              width={width && width !== 0 && scale === 0 ? width : undefined}
            />
          </div>
        ) : (
          <div
            style={{
              height: `${
                // eslint-disable-next-line no-nested-ternary
                oHeight !== 0 && scale !== 0
                  ? oHeight * scale
                  : oHeight !== 0 && oWidth !== 0 && width
                  ? (oHeight * width) / oWidth
                  : 800
              }px`
            }}
          />
        )}
      </VisibilitySensor>
    );
  }
}
