/* eslint-disable jsx-a11y/alt-text */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import oCertifiedPng from 'resources/o-certified.png';
import xCertifiedPng from 'resources/x-certified.png';
import styles from './StatusBarView.scss';

export default class StatusBarView extends React.Component {
  static renderCertifiedView = () => {
    return (
      <div className={styles.certified_view}>
        <div className={styles.icon}>
          <img src={oCertifiedPng} />
        </div>
        <div className={styles.text}>
          <FormattedMessage id="examine.text.successHint" />
        </div>
      </div>
    );
  };

  renderNotCertifiedView = () => {
    const { isErrorMsg } = this.props;
    return (
      <div className={styles.certified_view}>
        <div className={styles.icon}>
          <img src={xCertifiedPng} />
        </div>
        <div className={styles.text}>
          <p>{isErrorMsg}</p>
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
        {isCertifiedPdf ? StatusBarView.renderCertifiedView() : this.renderNotCertifiedView()}
      </div>
    );
  }
}
