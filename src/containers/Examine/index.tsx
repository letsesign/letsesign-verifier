import React from 'react';
import { withSnackbar } from 'react-simple-snackbar';
import base64js from 'base64-js';

import { semiVerify } from 'common/verifier';
import { routes } from 'common/constants';

import SidebarView from './components/SidebarView';
import StatusBarView from './components/StatusBarView';
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
      xhr.onerror = () => {
        reject();
      };
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

  static verifyPdfProc = async (spfFileUrl: string, pdfFileUrl: string) => {
    let result: any = null;
    try {
      const spfDataB64 = base64js.fromByteArray(
        new Uint8Array((await Examine.readFileFromBlobUrlAsync(spfFileUrl)) as any)
      );
      const pdfBufferB64 = base64js.fromByteArray(
        new Uint8Array((await Examine.readFileFromBlobUrlAsync(pdfFileUrl)) as any)
      );
      result = await semiVerify(pdfBufferB64, spfDataB64);
    } catch {
      result = {
        error: 'Failed to read/verify'
      };
    }
    if (result.error !== null && result.error !== undefined) {
      throw Error(result.error);
    }
    return result;
  };

  constructor(props: any) {
    super(props);
    const procPdf = JSON.parse(window.sessionStorage.getItem('procPdf') as string);

    let hasValidData = true;
    if (procPdf === null || procPdf === undefined) {
      hasValidData = false;
    }
    this.state = {
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
      if (error.message === 'Failed to read/verify') {
        const { history } = this.props;
        history.push(routes.verify);
      } else {
        this.setState({
          errorMsg: error.message,
          isCertifiedLeDoc: false,
          isProcessing: false
        });
      }
    }
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
    const { isProcessing, isCertifiedLeDoc, errorMsg, certifiedPdfInfo } = this.state;
    const { history } = this.props;
    if (!this.hasValidData()) {
      return '';
    }
    return (
      <div className={styles.container}>
        {isProcessing ? (
          ''
        ) : (
          <div className={styles.toolbar}>
            <StatusBarView isCertifiedPdf={isCertifiedLeDoc} isErrorMsg={errorMsg} history={history} />
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
            {isProcessing ? (
              ''
            ) : (
              <iframe id="viewer" title="pdfjsView" width="100%" src="./pdfjs/web/viewer.html#page=1" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withSnackbar(Examine, snackbarOptions);
