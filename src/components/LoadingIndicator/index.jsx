import React from 'react';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.scss';

function LoadingIndicator() {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <FontAwesomeIcon icon={faCog} spin color="black" size="2x" />
      </div>
    </div>
  );
}

export default LoadingIndicator;
