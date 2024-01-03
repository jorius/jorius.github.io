// @packages
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

// @actions
import { getGithubUserRepos, setLanguageCode } from '../../store';

// @images
import avatar from '../../assets/img/avatar.jpg';

// @components
import AboutMe from '../../components/commons/about-me';
import GithubRepo from '../../components/commons/github-repo';

// @configuration
import { configuration } from '../../configuration';

// @styles
import { useStyles } from './styles';

const HomePage = () => {
  const dispatch = useDispatch();
  const { repos } = useSelector((state) => state.github);

  const classes = useStyles({ repos: Boolean(repos.length) });

  useEffect(() => {
    dispatch(getGithubUserRepos(process.env.REACT_APP_GITHUB_USERNAME));
  }, []);

  return (
    <Grid
      className={classes.homePage}
      container
      justify="center"
    >
      <Typography className={classes.homePageTitle}>
        {configuration.language.homePage.title}
      </Typography>
      <Grid className={classes.homePageLanguages}>
        <Button
          className={classes.languageButton}
          color="primary"
          onClick={() => { dispatch(setLanguageCode('es_LA')); }}
          size="small"
        >
          {configuration.language.languages.es_LA}
        </Button>
        |
        <Button
          className={classes.languageButton}
          color="secondary"
          onClick={() => { dispatch(setLanguageCode('en_US')); }}
          size="small"
        >
          {configuration.language.languages.en_US}
        </Button>
      </Grid>
      <Grid className={classes.aboutMe} container direction="column">
        <AboutMe
          avatar={avatar}
          caption={configuration.language.aboutMe.caption}
          description={configuration.language.aboutMe.description}
          name={configuration.language.aboutMe.name}
        />
      </Grid>
      <Typography className={classes.githubTitle}>
        {repos.length
          ? configuration.language.homePage.githubTitle
          : null}
      </Typography>
      <Grid>
        {repos.length
          ? repos.map((repo) => (
            <Grid key={repo.id} item>
              <GithubRepo {...repo} />
            </Grid>
          ))
          : null}
      </Grid>
      <Grid className={classes.footer}>
        <Typography variant="caption">
          {configuration.language.common.footer}
        </Typography>
        <Typography variant="body2">
          <Link target="_blank" href="https://icons8.com/icons/set/pixel-cat">Favicon Pixel Cat Icon by Icons8</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HomePage;
