/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */

import React from 'react';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
// eslint-disable-next-line no-unused-vars
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

import { routes, fitScaleOption, scaleOptions } from 'common/constants';
import styles from './ToolbarView.scss';

export default class ToolbarView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedScaleIdx: fitScaleOption.key
    };
  }

  componentDidMount() {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, document.title, window.location.href);
    });
  }
  /*
  renderToggleRecipientItem = (name, color) => {
    return (
      <div className={styles.toggle_menu_item}>
        <span className={styles.dot} style={{ backgroundColor: color }}></span>
        <span>{name}</span>
      </div>
    );
  };
  
  renderRecipientItem = (name, color, active) => {
    return (
      <div className={styles.menu_item}>
        <span className={styles.check}>
          {active ? (
            <FontAwesomeIcon icon={faCheck} color="black" size="1x" />
          ) : (
            ''
          )}
        </span>
        <span className={styles.dot} style={{ backgroundColor: color }} />
        <span>{name}</span>
      </div>
    );
  };
  */

  handleSelectScaleMenu = (evtKey: any) => {
    const { onSelectScale } = this.props;
    this.setState({
      selectedScaleIdx: evtKey.toString()
    });
    onSelectScale(parseInt(evtKey, 10));
  };

  // eslint-disable-next-line react/no-unused-class-component-methods
  handleUpdateScale = (isMinus: any) => {
    const { onUpdateScale } = this.props;
    this.setState({
      selectedScaleIdx: '0'
    });
    onUpdateScale(isMinus);
  };

  isDropdownItemActive = (value: any, idx: any) => {
    const { currentScale } = this.props;
    const { selectedScaleIdx } = this.state;
    if (value.toFixed(2) === ((currentScale * 100) / 100).toFixed(2)) {
      return true;
    }
    return selectedScaleIdx === idx.toString() && value.toFixed(2) === ((currentScale * 100) / 100).toFixed(2);
  };

  renderToggleScaleItem = () => {
    // const { currentScale } = this.props;
    const { selectedScaleIdx } = this.state;
    if (selectedScaleIdx === fitScaleOption.key) {
      return (
        <div className={styles.toggle_menu_item}>
          <span>
            <FormattedMessage id={fitScaleOption.text} />
          </span>
        </div>
      );
    }
    return (
      <div className={styles.toggle_menu_item}>
        <span>{`${scaleOptions[parseInt(selectedScaleIdx, 10)].text}`}</span>
      </div>
    );
  };

  handleCloseBtnClicked = () => {
    const { history } = this.props;
    history.push(routes.init);
  };

  static renderScaleItem(name: any, active: any) {
    if (name === 'examine.dropdown.fitToWidth') {
      return (
        <div className={styles.menu_item}>
          <span className={styles.check}>
            {active ? <FontAwesomeIcon icon={faCheck} color="black" size="1x" /> : ''}
          </span>
          <span>
            <FormattedMessage id={name} />
          </span>
        </div>
      );
    }
    return (
      <div className={styles.menu_item}>
        <span className={styles.check}>{active ? <FontAwesomeIcon icon={faCheck} color="black" size="1x" /> : ''}</span>
        <span>{name}</span>
      </div>
    );
  }

  render() {
    const { selectedScaleIdx } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.tool_container}>
          <div className={styles.header_wrap}>
            <div className={styles.header_left}>
              <div className={styles.header_actions}>
                <button className={styles.header_action} type="button" onClick={this.handleCloseBtnClicked}>
                  <FormattedMessage id="examine.text.close" />
                </button>
              </div>
            </div>
            <div className={styles.scale_dd_container}>
              <Dropdown className={styles.dropdown} onSelect={this.handleSelectScaleMenu}>
                <Dropdown.Toggle btnStyle="link">{this.renderToggleScaleItem()}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {scaleOptions.map((item, idx) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem key={idx} eventKey={idx}>
                        {ToolbarView.renderScaleItem(item.text, this.isDropdownItemActive(item.value, idx))}
                      </MenuItem>
                    );
                  })}
                  <MenuItem divider />
                  <MenuItem eventKey={fitScaleOption.key}>
                    {ToolbarView.renderScaleItem(fitScaleOption.text, selectedScaleIdx === fitScaleOption.key)}
                  </MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
