import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button, Grid, MenuItem, Select } from "@material-ui/core";

import { Loader } from "google-maps";

import { sample, shuffle } from "lodash";

import { getCurrentPosition } from "../util/geolocation";

import { makeCarIcon, makeMarkerIcon, Map } from "../util/map";

import { Route } from "../util/models";

import { API_URL } from "../util/consts";

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

export const Mapping: FunctionComponent = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");

  const googleMapsRef = useRef<Map>();

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((json) => setRoutes(json));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);

      const divMap = document.getElementById("map") as HTMLElement;

      googleMapsRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const route = routes.find((route) => route._id === routeIdSelected);

      const color = sample(shuffle(colors)) as string;

      googleMapsRef.current?.addRoute(routeIdSelected, {
        currentMarkerOptions: {
          position: route?.startPosition,
          icon: makeCarIcon(color),
        },
        endMarkerOptions: {
          position: route?.endPosition,
          icon: makeMarkerIcon(color),
        },
      });
    },
    [routeIdSelected, routes]
  );

  return (
    <Grid container style={{ width: "100%", height: "100%" }}>
      <Grid item sm={4} xs={12}>
        <form onSubmit={startRoute}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(e) => setRouteIdSelected(String(e.target.value))}
          >
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route, key) => (
              <MenuItem key={key} value={route._id}>
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
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </Grid>
    </Grid>
  );
};
