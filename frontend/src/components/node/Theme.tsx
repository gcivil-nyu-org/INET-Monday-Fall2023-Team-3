import { createTheme, ThemeOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { darkScrollbar } from '@mui/material';

// Here we create a theme instance
const themeOptions: ThemeOptions = {
  components: {
    // Apply the darkScrollbar styles based on the mode
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(
            {
                track: 'rgb(229, 231, 235)',
                thumb: grey[300],
                active: grey[500],
            }
            
        ),
      },
    },
  },
  // ...other theme customizations
};

const Theme = createTheme(themeOptions);

export default Theme;
