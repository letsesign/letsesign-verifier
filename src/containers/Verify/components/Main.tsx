import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { withSnackbar } from 'react-simple-snackbar';

import { routes } from 'common/constants';
import dImg1 from 'resources/description_verify_signatures_1.png';
import dImg2 from 'resources/description_verify_signatures_2.png';

import styles from './Main.scss';

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

class Main extends React.Component<any, any> {
  pdfNameInputRef: any;

  spfNameInputRef: any;

  constructor(props: any) {
    super(props);
    this.pdfNameInputRef = React.createRef();
    this.spfNameInputRef = React.createRef();

    this.state = {
      pdf: null,
      spf: null
    };
  }

  componentDidMount() {}

  handleNextBtnClicked = () => {
    const { pdf, spf } = this.state;
    const { openSnackbar, history } = this.props;
    if (pdf === null) {
      const errMessage = <FormattedMessage id="verify.text.noPdfError" />;
      openSnackbar(errMessage);
      return;
    }
    if (spf === null) {
      const errMessage = <FormattedMessage id="verify.text.noSpfError" />;
      openSnackbar(errMessage);
      return;
    }
    window.sessionStorage.setItem(
      'procPdf',
      JSON.stringify({
        name: pdf.name,
        fileUrl: pdf.fileUrl
      })
    );
    window.sessionStorage.setItem(
      'spf',
      JSON.stringify({
        name: spf.name,
        fileUrl: spf.fileUrl
      })
    );
    history.push(routes.examine);
  };

  handlePdfSelected = (evt: any) => {
    this.setState({
      pdf: {
        name: evt.target.files[0].name,
        fileUrl: window.URL.createObjectURL(evt.target.files[0])
      }
    });
  };

  handleSpfSelected = (evt: any) => {
    this.setState({
      spf: {
        name: evt.target.files[0].name,
        fileUrl: window.URL.createObjectURL(evt.target.files[0])
      }
    });
  };

  renderPdfCard = () => {
    const { pdf } = this.state;
    return (
      <div className={styles.bulk_list_card_wrapper} role="form">
        <div className={styles.card_content} style={{ borderLeft: '5px solid #ffd65b' }}>
          <div className={styles.card_item_list}>
            <div className={styles.card_item}>
              <label className={styles.add_button} htmlFor="upload_pdf_file">
                <input
                  id="upload_pdf_file"
                  style={{ display: 'none' }}
                  type="file"
                  accept="application/pdf"
                  multiple={false}
                  onChange={this.handlePdfSelected}
                  ref={this.pdfNameInputRef}
                />
                <div style={{ textTransform: 'none' }}>
                  <FormattedMessage id="verify.button.chooseFile" />
                </div>
              </label>
              <div className={styles.file_name}>
                {pdf === null ? <FormattedMessage id="verify.text.noPDFFileChosen" /> : pdf.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSpfCard = () => {
    const { spf } = this.state;
    return (
      <div className={styles.bulk_list_card_wrapper} role="form">
        <div className={styles.card_content} style={{ borderLeft: '5px solid #ffd65b' }}>
          <div className={styles.card_item_list}>
            <div className={styles.card_item}>
              <label className={styles.add_button} htmlFor="upload_spf_file">
                <input
                  id="upload_spf_file"
                  style={{ display: 'none' }}
                  type="file"
                  accept=".spf"
                  multiple={false}
                  onChange={this.handleSpfSelected}
                  ref={this.spfNameInputRef}
                />
                <div style={{ textTransform: 'none' }}>
                  <FormattedMessage id="verify.button.chooseFile" />
                </div>
              </label>
              <div className={styles.file_name}>
                {spf === null ? <FormattedMessage id="verify.text.noSPFFileChosen" /> : spf.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderContentItems = () => {
    return (
      <div className={styles.content_wrapper}>
        <div className={styles.content}>
          <div className={styles.content_doc}>
            <div className={styles.content_item}>
              <div className={styles.timeline_title}>
                <FormattedMessage id="verify.text.pdfDocument" />
              </div>
              <div className={styles.card_container}>{this.renderPdfCard()}</div>
            </div>
            <div className={styles.plus}>
              <FontAwesomeIcon icon={faPlus} color="#999" size="1x" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className={styles.content_item}>
              <div className={styles.timeline_title}>
                <FormattedMessage id="verify.text.signingProof" />
              </div>
              <div className={styles.card_container}>{this.renderSpfCard()}</div>
            </div>
          </div>
          <div className={styles.content_actions}>
            <button type="button" className={styles.next_btn} onClick={this.handleNextBtnClicked}>
              <FormattedMessage id="verify.text.submit" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.container} role="form">
        <div className={styles.banner}>
          <div className={styles.banner_content} />
        </div>
        <div className={styles.site_content}>
          <div className={styles.content_wrap}>
            <div className={styles.content_main}>
              {this.renderContentItems()}
              <div className={styles.description}>
                <div className={styles.d_panel}>
                  <div className={styles.d_img}>
                    <img src={dImg1} alt="" />
                  </div>
                  <div className={styles.d_content}>
                    <div className={styles.d_content_main}>
                      <FormattedMessage id="verify.text.description1" />
                    </div>
                  </div>
                </div>
                <div className={styles.d_panel}>
                  <div className={styles.d_img}>
                    <img src={dImg2} alt="" />
                  </div>
                  <div className={styles.d_content}>
                    <div className={styles.d_content_main}>
                      <FormattedMessage id="verify.text.description2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withSnackbar(Main, snackbarOptions);
