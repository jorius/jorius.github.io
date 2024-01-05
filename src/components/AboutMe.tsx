// packages
import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import CardMedia from '@mui/material/CardMedia';

// components
import { McStyledGrid, McStyledPaper }from './AboutMe.styles'

export const McAboutMe = () => {
  return (
    <>
      <McStyledGrid
        container
        direction="row"
        width="100%"
      >
        <McStyledPaper elevation={12}>
          <Grid
            alignItems="center"
            container
            direction="row"
          >
            <Grid item sm={12}>
              <Typography sx={{ marginBottom: '25px' }} variant="h4">
                Hi, I'm <Typography component="span" color="primary" sx={{ fontSize: '2.125rem' }}>Jose</Typography> and these are my naugthy cats:
              </Typography>
              <Typography variant="body1">
                I am a software developer with a little more than 5 years of experience wanting to continue learning a little bit of everything every day and wanting to continue specializing in the expertise that I already have, in one way or another, like everyone else on the planet, wanting to change the world, I made this page as the beginning of a portfolio where to upload, show and share small projects and other useful content for any type of programmer.
              </Typography>
            </Grid>
          </Grid>
        </McStyledPaper>
      </McStyledGrid>
      {/* <McStyledGrid
        container
        direction="row"
        width="100%"
      >
        <McStyledPaper elevation={12}>
          <Grid
            alignItems="center"
            container
            direction="row"
            width="100%"
          >
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Gasolina.jpeg"
                sx={{ borderRadius: '5px', width: '200px' }}
              />
            </Grid>
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Gasolina2.jpg"
                sx={{ borderRadius: '5px', height: '300px', width: '200px' }}
              />
            </Grid>
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Gasolina3.jpg"
                sx={{ borderRadius: '5px', height: '300px', width: '200px' }}
              />
            </Grid>
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Cohete.jpeg"
                sx={{ borderRadius: '5px', width: '200px' }}
              />
            </Grid>
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Cohete2.jpg"
                sx={{ borderRadius: '5px', height: '300px', width: '200px' }}
              />
            </Grid>
            <Grid item sm={2}>
              <CardMedia
                component="img"
                image="/static/images/Cohete3.jpg"
                sx={{ borderRadius: '5px', height: '300px', width: '200px' }}
              />
            </Grid>
          </Grid>
        </McStyledPaper>
      </McStyledGrid> */}
    </>
  );
};

export default McAboutMe;
