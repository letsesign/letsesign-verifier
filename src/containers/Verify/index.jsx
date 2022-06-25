import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';

import { routes } from 'common/constants';
import CommonFooter from 'components/CommonFooter';

import Header from './components/Header';
import Main from './components/Main';
import styles from './index.scss';

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { history, appVersion, serviceName } = this.props;
    if (isMobile || isAndroid || isIOS) {
      history.push(routes.init);
      return <div />;
    }
    return (
      <div role="form" className={styles.container}>
        <Header {...this.props} serviceName={serviceName} />
        <div className={styles.content}>
          <Switch>
            <Route path={routes.verify} component={Main} />
          </Switch>
        </div>
        <CommonFooter {...this.props} appVersion={appVersion} />
      </div>
    );
  }
}

export default Verify;
