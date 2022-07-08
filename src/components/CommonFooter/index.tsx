import React from 'react';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import { FormattedMessage } from 'react-intl';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.scss';

export default class CommonFooter extends React.Component<any, any> {
  handleLocaleChanged = (language: string) => {
    const { setLocale } = this.props;
    setLocale(language);
  };

  static getLanaugeDisp = (locale: string) => {
    if (locale === 'en-US') {
      return 'English (US)';
    }
    if (locale === 'zh-TW') {
      return '繁體 (中文)';
    }
    return '';
  };

  render() {
    const { currentLocale, appVersion } = this.props;
    return (
      <footer className={styles.container}>
        <div className={styles.main_row}>
          <div className={styles.logo}>
            <Dropdown dropup className={styles.lang_list}>
              <Dropdown.Toggle btnStyle="link" style={{ padding: '0px', border: 'none', lineHeight: '12px' }}>
                <FontAwesomeIcon icon={faGlobe} color="grey" size="1x" />
                <span
                  style={{
                    paddingLeft: '4px',
                    paddingRight: '0px',
                    fontSize: '12px',
                    paddingTop: '0px',
                    paddingBottom: '0px'
                  }}
                >
                  {CommonFooter.getLanaugeDisp(currentLocale)}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ overflow: 'overlay' }}>
                <MenuItem eventKey="en-US" onClick={() => this.handleLocaleChanged('en-US')}>
                  {CommonFooter.getLanaugeDisp('en-US')}
                </MenuItem>
                <MenuItem eventKey="zh-TW" onClick={() => this.handleLocaleChanged('zh-TW')}>
                  {CommonFooter.getLanaugeDisp('zh-TW')}
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className={styles.link_list}>
            <div>{`${appVersion}`}</div>
          </div>
          <div className={styles.right}>
            <span>
              <FormattedMessage id="text.poweredBy" />
            </span>
            <span className={styles.powered_by}>Let&#39;s eSign</span>
          </div>
        </div>
      </footer>
    );
  }
}
