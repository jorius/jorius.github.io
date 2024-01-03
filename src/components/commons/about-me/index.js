/* eslint-disable max-len */

// @packages
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

// @styles
import { useStyles } from './styles';

const AboutMe = ({
  avatar,
  caption,
  description,
  name,
}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.aboutMe}>
      <Card className={classes.aboutMeCard}>
        <Grid
          alignContent="space-between"
          alignItems="center"
          container
          direction="row"
          justify="center"
        >
          <Grid item lg={10} sm={9} xs={12}>
            <CardContent>
              <Typography className={classes.title}>
                {name}
                <small>
                  {caption}
                </small>
              </Typography>
              <Typography color="textPrimary" variant="body1">
                {description}
              </Typography>
            </CardContent>

          </Grid>
          <Grid
            className={classes.avatarContainer}
            item
            lg={2}
            sm={3}
            xs={12}
          >
            <CardMedia
              className={classes.avatar}
              image={avatar}
              title="avatar"
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

AboutMe.propTypes = {
  avatar: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default AboutMe;
