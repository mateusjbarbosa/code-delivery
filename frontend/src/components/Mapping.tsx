import * as React from "react";

import { Button, Grid, MenuItem, Select } from "@material-ui/core";

type Props = {};

export const Mapping = (props: Props) => {
  return (
    <Grid container>
      <Grid item sm={4} xs={12}>
        <form>
          <Select fullWidth>
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
          </Select>
          <Button fullWidth type="submit" color="primary" variant="contained">
            Iniciar corrida
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};
