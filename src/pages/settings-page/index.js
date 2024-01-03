// @packages
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

// @actions
import { setLanguageCode } from '../../store';

// @configuration
import { configuration } from '../../configuration';

// @styles
import { useStyles } from './styles';

const SettingsPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentLanguageCode = useSelector((state) => state.settings.languageCode);

  const handleOnChangeField = ({ target: { value: languageCode } }) => {
    dispatch(setLanguageCode(languageCode));
  };

  return (
    <Grid
      className={classes.settingsPage}
      container
      justify="center"
    >
      <Grid item>
        <Typography variant="h4">
          {configuration.language.settingsPage.title}
        </Typography>
        <TextField
          className={classes.textField}
          label={configuration.language.common.changeLanguage}
          onChange={handleOnChangeField}
          placeholder={configuration.language.common.changeLanguage}
          select
          value={currentLanguageCode}
        >
          {configuration.languageList.map((language) => (
            <MenuItem
              key={language.languageCode}
              value={language.languageCode}
            >
              {language.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default SettingsPage;
