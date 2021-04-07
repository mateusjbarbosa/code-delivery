import { useEffect, useState } from "react";

import { Button, Grid, MenuItem, Select } from "@material-ui/core";

import { Route } from "../util/models";

const API_URL = process.env.API_URL;

type Props = {};

export const Mapping = (props: Props) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((routes) => setRoutes(routes));
  }, []);

  return (
    <Grid container>
      <Grid item sm={4} xs={12}>
        <form>
          <Select fullWidth>
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route, key) => (
              <MenuItem key={key} value={route.id}>
                {route.title}
              </MenuItem>
            ))}
          </Select>
          <Button fullWidth type="submit" color="primary" variant="contained">
            Iniciar corrida
          </Button>
        </form>
      </Grid>

      <Grid item sm={8} xs={12}>
        Map
      </Grid>
    </Grid>
  );
};
