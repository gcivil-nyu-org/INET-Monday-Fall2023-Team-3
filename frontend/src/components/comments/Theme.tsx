import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkScrollbar } from '@mui/material';

// Here we create a theme instance
const themeOptions: ThemeOptions = {
  components: {
    // Apply the darkScrollbar styles based on the mode
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(
          {
            track: 'rgba(97, 103, 122)',
            thumb: 'rgba(97, 103, 122)',
            active: 'rgba(97, 103, 122)',
          }

        ),
      },
    },
  },
  // ...other theme customizations
};

const Theme = createTheme(themeOptions);

export default Theme;
