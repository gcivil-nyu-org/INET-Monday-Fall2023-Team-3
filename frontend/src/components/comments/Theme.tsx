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
                track: 'rgb(100, 116, 139)',
                thumb: 'rgb(148, 163, 184)',
                active: 'rgb(51, 65, 85)',
            }
            
        ),
      },
    },
  },
  // ...other theme customizations
};

const Theme = createTheme(themeOptions);

export default Theme;
