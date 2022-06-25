/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import externalLinkImg from 'resources/external-link.png';

import styles from './SidebarView.scss';

export default class SidebarView extends React.Component {
  static getSigningTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleExternalLink = () => {
    const { enclaveCodeURL } = this.props;
    window.open(enclaveCodeURL, '_blank');
  };

  renderEnclaveMagicNumber = (isVerifiedSuccess) => {
    if (isVerifiedSuccess) {
      const { enclaveMagicNumber } = this.props;
      return (
        <div className={styles.value}>
          <div>{enclaveMagicNumber.substr(0, enclaveMagicNumber.length / 2)}</div>
        </div>
      );
    }
    return (
      <div className={styles.value}>
        <span className={styles.testonly_value}>UNKNOWN</span>
      </div>
    );
  };

  renderEnclaveVersion = (isVerifiedSuccess) => {
    const { enclaveVersion } = this.props;
    const isTestOnly = enclaveVersion === 'TESTONLY';
    const isUnknown = enclaveVersion === 'UNKNOWN';
    if (!isVerifiedSuccess) {
      return (
        <div className={styles.value}>
          <span className={styles.testonly_value}>UNKNOWN</span>
        </div>
      );
    }
    if (isTestOnly) {
      return (
        <div className={styles.value}>
          <span className={styles.testonly_value}>TESTONLY</span>
        </div>
      );
    }
    if (isUnknown) {
      return (
        <div className={styles.value}>
          <span className={styles.testonly_value}>UNKNOWN</span>
        </div>
      );
    }
    return (
      <div className={styles.value}>
        <span className={styles.item_name}>Let&#39;s eSign&nbsp;</span>
        <span className={styles.date_value}>{enclaveVersion}</span>
        <span className={styles.extenal_link} role="button" onClick={this.handleExternalLink}>
          <img src={externalLinkImg} alt="" />
        </span>
      </div>
    );
  };

  renderSignerList = (isVerifiedSuccess) => {
    if (isVerifiedSuccess) {
      const { signerList } = this.props;
      return (
        <div>
          {_.map(signerList, (signerInfo, idx) => (
            <div key={`signer-${idx + 1}`} className={styles.value} style={{ marginTop: '16px' }}>
              <div style={{ marginTop: '6px' }}>{signerInfo.name}</div>
              <div style={{ marginTop: '6px' }}>{signerInfo.emailAddr}</div>
              {signerInfo.phoneNumber ? <div style={{ marginTop: '6px' }}>{signerInfo.phoneNumber}</div> : ''}
              <div style={{ marginTop: '6px' }}>
                {`${SidebarView.getSigningTimestamp(signerInfo.signingTime)} (${
                  idx + 1 < 10 ? `0${idx + 1}` : idx + 1
                })`}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className={styles.value}>
        <span className={styles.testonly_value}>UNKNOWN</span>
      </div>
    );
  };

  render() {
    const { enclaveMagicNumber } = this.props;
    const isVerifiedSuccess = enclaveMagicNumber !== 'UNKNOWN';
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.title}>
            <FormattedMessage id="examine.text.enclaveMagicNumber" />
          </div>
          {this.renderEnclaveMagicNumber(isVerifiedSuccess)}
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <FormattedMessage id="examine.text.enclaveVersion" />
          </div>
          {this.renderEnclaveVersion(isVerifiedSuccess)}
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <FormattedMessage id="examine.text.signerList" />
          </div>
          {this.renderSignerList(isVerifiedSuccess)}
        </div>
      </div>
    );
  }
}
