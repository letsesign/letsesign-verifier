/* eslint-disable jsx-a11y/alt-text */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import oCertifiedPng from 'resources/o-certified.png';
import xCertifiedPng from 'resources/x-certified.png';
import { routes } from 'common/constants';

import styles from './StatusBarView.scss';

export default class StatusBarView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, document.title, window.location.href);
    });
  }

  handleCloseBtnClicked = () => {
    const { history } = this.props;
    history.push(routes.init);
  };

  renderCertifiedView = () => {
    return (
      <div className={styles.container}>
        <div className={styles.certified_view}>
          <div className={styles.icon}>
            <img src={oCertifiedPng} />
          </div>
          <div className={styles.text}>
            <FormattedMessage id="examine.text.successHint" />
          </div>
        </div>
        <div className={styles.close_button_wrapper}>
          <button className={styles.close_button} type="button" onClick={this.handleCloseBtnClicked}>
            <FormattedMessage id="examine.text.close" />
          </button>
        </div>
      </div>
    );
  };

  renderNotCertifiedView = () => {
    const { isErrorMsg } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.certified_view}>
          <div className={styles.icon}>
            <img src={xCertifiedPng} />
          </div>
          <div className={styles.text}>
            <p>
              {isErrorMsg === 'Error: Invalid eSignature or Invalid Attestation Document' ? (
                <FormattedMessage id="examine.text.semiError" />
              ) : (
                isErrorMsg
              )}
            </p>
          </div>
        </div>
        <div className={styles.close_button_wrapper}>
          <button className={styles.close_button} type="button" onClick={this.handleCloseBtnClicked}>
            <FormattedMessage id="examine.text.close" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { isCertifiedPdf } = this.props;
    return (
      <div
        className={
          isCertifiedPdf
            ? [styles.container, styles.certified].join(' ')
            : [styles.container, styles.not_certified].join(' ')
        }
      >
        {isCertifiedPdf ? this.renderCertifiedView() : this.renderNotCertifiedView()}
      </div>
    );
  }
}
