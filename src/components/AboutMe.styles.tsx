// packages
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const McStyledGrid = styled(Grid)((props) => ({
  padding: '25px 250px 25px',
}));

export const McStyledPaper = styled(Paper)<{ margin?: string }>((props) => ({
  margin: `${props.margin}`,
  padding: '25px',
  width: '100%',
}));
