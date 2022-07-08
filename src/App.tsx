import React, { useState } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'react-intl';
import SnackbarProvider from 'react-simple-snackbar';
import { Helmet } from 'react-helmet';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';
import loadable from '@loadable/component';
// import _ from 'lodash';

import { routes } from 'common/constants';
import LoadingIndicator from 'components/LoadingIndicator';
import en from 'resources/i18n/en';
import zhTW from 'resources/i18n/zh-TW';

import styles from './App.scss';
import packageDef from '../package.json';

const serviceName = packageDef.description;
const appVersion = packageDef.version;

const isLoading = LoadingIndicator();
const Verify = loadable(() => import('containers/Verify/index'), {
  fallback: isLoading
});
const Examine = loadable(() => import('containers/Examine/index'), {
  fallback: isLoading
});

export default function App({ history }: { history: any }) {
  const [locale, setLocale] = useState(navigator.language);
  const localeDataMap = {
    'en-US': en,
    'zh-TW': zhTW
  };
  const lang = locale === 'zh-TW' ? 'zh-TW' : 'en-US';
  /*
  if (!_.includes(Object.keys(localeDataMap), locale)) {
    lang = 'en-US';
  }
  */
  const currentLocale = lang;
  return (
    <IntlProvider locale={lang} key={lang} defaultLocale="en-US" messages={localeDataMap[lang]}>
      <SnackbarProvider>
        <Router history={history}>
          <Helmet>
            <meta name="description" content={serviceName} />
            <title>{serviceName}</title>
          </Helmet>
          <Switch>
            <Route
              path={routes.verify}
              render={(props) => (
                <Verify
                  {...props}
                  setLocale={setLocale}
                  currentLocale={currentLocale}
                  appVersion={appVersion}
                  serviceName={serviceName}
                />
              )}
            />
            <Route
              path={routes.examine}
              render={(props) => (
                <Examine {...props} setLocale={setLocale} currentLocale={currentLocale} appVersion={appVersion} />
              )}
            />
            <Route
              path={routes.init}
              render={() => {
                if (isMobile || isAndroid || isIOS) {
                  return (
                    <div className={styles.container}>
                      <div className={styles.content} style={{ textAlign: 'center' }}>
                        <p>{serviceName}</p>
                        <div>
                          <FormattedMessage id="text.notSupportedBrowsers" />
                        </div>
                      </div>
                    </div>
                  );
                }
                return <Redirect to={routes.verify} />;
              }}
            />
          </Switch>
        </Router>
      </SnackbarProvider>
    </IntlProvider>
  );
}
