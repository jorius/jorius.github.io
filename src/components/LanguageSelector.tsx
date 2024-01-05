import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const McLanguageSelector = () => {
  const [language, setLanguage] = React.useState('en_US');

  const handleOnChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          disableUnderline
          disabled
          id="language-selector"
          label="Language"
          onChange={handleOnChangeLanguage}
          value={language}
          variant="standard"
        >
          <MenuItem value="en_US">🇺🇸 | English</MenuItem>
          <MenuItem value="es_LA">🇨🇴 | Spanish</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default McLanguageSelector;
