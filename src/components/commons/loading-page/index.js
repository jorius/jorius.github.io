// @packages
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

// @styles
import { useStyles } from './styles';

const LoadingPage = ({ visible }) => {
  const classes = useStyles();

  if (!visible) {
    return null;
  }

  return (
    <div className={classes.loadingPage}>
      <div className={classes.background} />
      <div className={classes.centerPanel}>
        <CircularProgress
          color="secondary"
          size={50}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
