// @packages
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// @configuration
import { configuration } from '../../configuration';

const NotFoundPage = () => (
  <Grid
    alignContent="center"
    alignItems="center"
    container
    justify="center"
  >
    <Typography variant="h4">
      {configuration.language.notFoundPage.title}
    </Typography>
  </Grid>
);

export default NotFoundPage;
