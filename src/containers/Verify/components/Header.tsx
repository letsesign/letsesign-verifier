import React from 'react';

import styles from './Header.scss';

export default class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.sessionStorage.clear();
  }

  render() {
    const { serviceName } = this.props;
    return (
      <header className={[styles.container, styles.container_verify].join(' ')}>
        <div className={styles.domain_name}>
          <p>{serviceName}</p>
        </div>
      </header>
    );
  }
}
