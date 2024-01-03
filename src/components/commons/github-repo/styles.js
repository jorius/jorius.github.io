// @packages
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  description: {
    color: theme.palette.custom.white.dark,
  },
  githubRepo: {
    backgroundColor: theme.palette.custom.black.dark,
    borderBottom: `1px solid ${theme.palette.custom.white.light}`,
    boxShadow: `2px 5px 10px 4px ${theme.palette.custom.black.dark}`,
    marginBottom: 15,
  },
  title: {
    color: theme.palette.custom.blue.main,
    fontWeight: 'bold',
  },
}));
