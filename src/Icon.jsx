import React from 'react';
import classNames from 'classnames';

const Icon = ({type}) => {

    let styles = {
      iconStyle: {
        fontSize: '32px',
        marginLeft: '14px',
        display: 'inline-block',
        marginTop: '14px'
      }
    }

    return (<span className={type}
                  style={styles.iconStyle}></span>);

}

export default Icon;
