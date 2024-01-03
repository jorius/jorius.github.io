// @packages
import { makeStyles } from '@material-ui/core/styles';

// @constants
const responsiveTitleStyles = (theme) => ({
  [theme.breakpoints.up('lg')]: {
    fontSize: '2.125rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '1.25rem',
  },
});

export const useStyles = makeStyles((theme) => ({
  aboutMe: {
    marginBottom: 25,
    marginTop: 25,
  },
  footer: {
    '&>p>a': {
      color: theme.palette.custom.yellow.dark,
    },
    color: theme.palette.custom.yellow.main,
    marginTop: 100,
    textAlign: 'center',
  },
  githubTitle: {
    ...responsiveTitleStyles(theme),
    marginBottom: 25,
    marginTop: 25,
  },
  homePage: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '25%',
      paddingRight: '25%',
    },
    backgroundColor: theme.palette.custom.black.dark,
    color: theme.palette.custom.white.light,
    height: (props) => `${!props.repos ? '100vh' : 'auto'}`,
    padding: 25,
    width: '100%',
  },
  homePageLanguages: {
  },
  homePageTitle: {
    ...responsiveTitleStyles(theme),
  },
  languageButton: {
    textTransform: 'none',
  },
}));
