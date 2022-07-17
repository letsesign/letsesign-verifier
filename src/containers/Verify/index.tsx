import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';

import { routes } from 'common/constants';

import Header from './components/Header';
import Main from './components/Main';
import styles from './index.scss';

class Verify extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    // eslint-disable-next-line no-unused-vars
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
      </div>
    );
  }
}

export default Verify;
