import { createMuiTheme } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
  type: "dark",
  primary: {
    main: "#FFCD00",
    contrastText: "#242626",
  },
  background: {
    default: "#242626",
  },
};

const theme = createMuiTheme({ palette });

export default theme;
