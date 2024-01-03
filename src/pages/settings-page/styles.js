// @packages
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  settingsPage: {
    backgroundColor: theme.palette.custom.black.main,
    color: theme.palette.custom.white.light,
    height: '100vh',
    paddingTop: 25,
  },
  textField: {
    marginTop: 50,
    width: '100%',
  },
}));
