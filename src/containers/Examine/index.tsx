import React from 'react';
import { withSnackbar } from 'react-simple-snackbar';
import base64js from 'base64-js';

import { Verifier } from 'common/verifier';
import { routes, fitScaleOption, scaleOptions } from 'common/constants';
import CommonFooter from 'components/CommonFooter';

import PdfView from './components/PdfView';
import SidebarView from './components/SidebarView';
import StatusBarView from './components/StatusBarView';
import ToolbarView from './components/ToolbarView';
import styles from './index.scss';

const snackbarOptions = {
  position: 'top-center',
  style: {
    background: '#ffeee9',
    border: '1px solid rgba(209,50,57,.27)',
    borderLeft: '4px solid #b22b31',
    color: '#b22b31',
    fontSize: '13px',
    textAlign: 'center'
  },
  closeStyle: {
    color: '#d13239',
    fontSize: '11px'
  }
};

class Examine extends React.Component<any, any> {
  static readFileFromBlobUrlAsync = async (fileUrl: string) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = () => {
        const fileObj = xhr.response;
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(fileObj);
        fileReader.onload = (evt) => {
          resolve(evt.target ? evt.target.result : null);
        };
        fileReader.onerror = () => {
          reject(fileReader.error);
        };
      };
      xhr.open('GET', fileUrl);
      xhr.send();
    });

  static verifyPdfApi = async (pdfBufferB64: any, spfDataB64: any) => {
    const apiEndpoint = process.env.NODE_ENV === 'development' ? 'http://localhost/verify-pdf/' : '/verify-pdf/';
    try {
      const fetchResult = await fetch(apiEndpoint, {
        method: 'post',
        body: JSON.stringify({ pdfBufferB64, spfDataB64 }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!fetchResult.ok) {
        return {
          error: `HTTP Error: ${fetchResult.status}`
        };
      }
      const apiResp = await fetchResult.json();
      return apiResp;
    } catch (error: any) {
      return {
        error: `Error: ${error.message}`
      };
    }
  };

  static verifyPdfProc = async (spfFileUrl: string, pdfFileUrl: string) => {
    let result: any = null;
    const spfDataB64 = base64js.fromByteArray(
      new Uint8Array((await Examine.readFileFromBlobUrlAsync(spfFileUrl)) as any)
    );
    const pdfBufferB64 = base64js.fromByteArray(
      new Uint8Array((await Examine.readFileFromBlobUrlAsync(pdfFileUrl)) as any)
    );
    // const verifier = new Verifier();
    result = await Verifier.semiVerify(pdfBufferB64, spfDataB64);
    if (result.error !== null && result.error !== undefined) {
      throw Error(result.error);
    }
    return result;
  };

  pdfViewRef: any;

  constructor(props: any) {
    super(props);
    const procPdf = JSON.parse(window.sessionStorage.getItem('procPdf') as string);

    let hasValidData = true;
    if (procPdf === null || procPdf === undefined) {
      hasValidData = false;
    }
    this.pdfViewRef = React.createRef();
    this.state = {
      // pdfName: procPdf ? procPdf.name : '',
      pdfData: procPdf ? procPdf.fileUrl : '',
      selectedScale: fitScaleOption.value,
      hasValidData,
      isCertifiedLeDoc: false,
      certifiedPdfInfo: null,
      errorMsg: '',
      isProcessing: true
    };
  }

  componentDidMount() {
    const spf = JSON.parse(window.sessionStorage.getItem('spf') as string);
    const pdfProc = JSON.parse(window.sessionStorage.getItem('procPdf') as string);
    this.verifyPdfFunc(spf.fileUrl, pdfProc.fileUrl);
  }

  verifyPdfFunc = async (spfFileUrl: string, pdfFileUrl: string) => {
    try {
      const result = await Examine.verifyPdfProc(spfFileUrl, pdfFileUrl);
      this.setState({
        certifiedPdfInfo: result,
        isCertifiedLeDoc: true,
        isProcessing: false
      });
    } catch (error: any) {
      this.setState({
        errorMsg: error.message,
        isCertifiedLeDoc: false,
        isProcessing: false
      });
    }
  };

  /* The following method is kept for review only */
  // eslint-disable-next-line class-methods-use-this
  handlePdfLoadSuccess = (pdfDoc: any) => {
    if (!pdfDoc) {
      // eslint-disable-next-line no-console
      console.log('Invalid pdfDoc');
    }
  };

  handlePdfLoadError = () => {
    const { history } = this.props;
    history.push(routes.verify);
  };

  handleUpdateScale = (isMinus: boolean) => {
    const { selectedScale } = this.state;
    let scale = selectedScale;
    if (selectedScale === 0 && this.pdfViewRef && this.pdfViewRef.current) {
      scale = this.pdfViewRef.current.getCurrentScale();
    }
    if (scale > 0) {
      let range = 0.1;
      if (scale > 1.1) {
        range += Math.floor(scale) / 10;
      }
      if (isMinus) {
        if (scale >= 0.2) {
          scale = parseFloat((Math.floor(scale * 10) / 10 - range).toFixed(2));
        }
      } else {
        scale = parseFloat((Math.floor(scale * 10) / 10 + range).toFixed(2));
      }
    }
    if (scale <= 0.5) {
      scale = 0.5;
    }
    if (scale >= 5) {
      scale = 5;
    }
    this.setState({
      selectedScale: scale
    });
  };

  handleScaleMenuItemSelected = (idx: number) => {
    this.setState({
      selectedScale: idx > scaleOptions.length - 1 ? fitScaleOption.value : scaleOptions[idx].value
    });
  };

  hasValidData = () => {
    const { hasValidData } = this.state;
    const { history } = this.props;
    if (!hasValidData) {
      history.push(routes.verify);
      return false;
    }

    return true;
  };

  render() {
    const { selectedScale, isProcessing, isCertifiedLeDoc, errorMsg, certifiedPdfInfo, pdfData } = this.state;
    const { history, appVersion } = this.props;
    if (!this.hasValidData()) {
      return '';
    }
    let pdfWidth = 0;
    if (this.pdfViewRef.current !== null && selectedScale === 0) {
      pdfWidth = this.pdfViewRef.current.rootRef.current.clientWidth - 46;
    }
    return (
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <ToolbarView
            currentScale={selectedScale}
            onUpdateScale={this.handleUpdateScale}
            onSelectScale={this.handleScaleMenuItemSelected}
            history={history}
          />
        </div>
        {isProcessing ? (
          ''
        ) : (
          <div className={styles.toolbar}>
            <StatusBarView isCertifiedPdf={isCertifiedLeDoc} isErrorMsg={errorMsg} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.content_sidebar}>
            {isProcessing ? (
              ''
            ) : (
              <SidebarView
                enclaveMagicNumber={
                  isCertifiedLeDoc && certifiedPdfInfo && certifiedPdfInfo.summary
                    ? certifiedPdfInfo.summary.magicNumber
                    : 'UNKNOWN'
                }
                enclaveCodeURL={isCertifiedLeDoc && certifiedPdfInfo ? certifiedPdfInfo.enclaveCodeURL : 'UNKNOWN'}
                enclaveVersion={isCertifiedLeDoc && certifiedPdfInfo ? certifiedPdfInfo.enclaveVersion : 'UNKNOWN'}
                signerList={
                  isCertifiedLeDoc && certifiedPdfInfo && certifiedPdfInfo.summary
                    ? certifiedPdfInfo.summary.signerList
                    : []
                }
              />
            )}
          </div>
          <div className={styles.content_pdf}>
            <PdfView
              ref={this.pdfViewRef}
              pdfData={pdfData}
              scale={selectedScale}
              width={pdfWidth !== 0 ? pdfWidth : undefined}
              onPdfLoadSuccess={this.handlePdfLoadSuccess}
              onPdfLoadError={this.handlePdfLoadError}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <CommonFooter {...this.props} appVersion={appVersion} />
        </div>
      </div>
    );
  }
}

export default withSnackbar(Examine, snackbarOptions);
