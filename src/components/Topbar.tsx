// packages
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// components
import McLanguageSelector from './LanguageSelector';
import McThemeSwitch from './ThemeSwitch';
import McGithubButton from './GithubButton';
import McLinkedinButton from './LinkedinButton';
import McStackOverflowButton from './StackOverflowButton';

export const McTopbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid
            alignItems="center"
            container
            direction="row"
            width="100%"
          >
            <Grid item sm={10}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                width="100%"
              >
                <Grid item sm={2}>
                  <Link>
                    <Typography component="div" variant="h6">
                      About me
                    </Typography>
                  </Link>
                </Grid>
                {/* <Grid item sm={2}>
                  <Link>
                    <Typography component="div" variant="h6">
                      Blog
                    </Typography>
                  </Link>
                </Grid> */}
                {/* <Grid item sm={2}>
                  <Link>
                    <Typography component="div" variant="h6">
                      Repositories
                    </Typography>
                  </Link>
                </Grid> */}
                {/* <Grid item sm={2}>
                  <Link>
                    <Typography component="div" variant="h6">
                      Gasolina & Cohete
                    </Typography>
                  </Link>
                </Grid> */}
                {/* <Grid item sm={2}>
                  <Link>
                    <Typography component="div" variant="h6">
                      Bike adventures
                    </Typography>
                  </Link>
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item sm={2}>
              <Grid
                alignItems="center"
                container
                direction="row"
                justifyContent="space-evenly"
                width="100%"
              >
                <McLanguageSelector />
                <McThemeSwitch disabled checked />
                <McGithubButton />
                <McLinkedinButton />
                <McStackOverflowButton />
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default McTopbar;
