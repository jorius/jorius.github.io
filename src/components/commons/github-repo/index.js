// @packages
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

// @styles
import { useStyles } from './styles';

const GithubRepo = ({
  description,
  name,
  url,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.githubRepo}>
      <CardContent>
        <Typography gutterBottom>
          <Link className={classes.title} href={url}>{name}</Link>
        </Typography>
        <Typography className={classes.description} variant="body1">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

GithubRepo.propTypes = {
  description: PropTypes.string,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

GithubRepo.defaultProps = {
  description: '',
};

export default GithubRepo;
