// @packages
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  aboutMe: {
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: 4,
    height: 200,
    width: 200,
  },
  aboutMeCard: {
    padding: 15,
    backgroundColor: theme.palette.custom.white.main,
    boxShadow: `2px 3px 4px 1px ${theme.palette.custom.blue.light}`,
    height: '100%',
    width: '100%',
  },
  title: {
    [theme.breakpoints.up('lg')]: {
      fontSize: '2.125rem',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.25rem',
    },
    '&>small': {
      color: theme.palette.text.secondary,
      fontSize: '1rem',
    },
    fontWeight: 'bold',
    marginBottom: 25,
  },
}));
