import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button, Grid, makeStyles, MenuItem, Select } from "@material-ui/core";

import { Loader } from "google-maps";

import { sample, shuffle } from "lodash";

import { useSnackbar } from "notistack";

import io from "socket.io-client";

import { Navbar } from "./Navbar";

import { RouteExistsError } from "../errors/route-exists.error";

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

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  form: {
    margin: "16px",
  },
  btnSubmitWrapper: {
    textAlign: "center",
    marginTop: "8px",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export const Mapping: FunctionComponent = () => {
  const classes = useStyles();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");

  const googleMapsRef = useRef<Map>();
  const socketIORef = useRef<SocketIOClient.Socket>();

  const { enqueueSnackbar } = useSnackbar();

  const startRoute = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const route = routes.find((route) => route._id === routeIdSelected);

      const color = sample(shuffle(colors)) as string;

      try {
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

        socketIORef.current?.emit("new-direction", {
          routeId: routeIdSelected,
        });
      } catch (error) {
        if (error instanceof RouteExistsError) {
          enqueueSnackbar(
            `${route?.title} já adicionado, espere sua finalização`,
            { variant: "error" }
          );
          return;
        }
        throw error;
      }
    },
    [routeIdSelected, routes, enqueueSnackbar]
  );

  const finishRoute = useCallback(
    (route: Route) => {
      enqueueSnackbar(`Corrida ${route.title} finalizada com sucesso!`, {
        variant: "success",
      });

      googleMapsRef.current?.removeRoute(route._id);
    },
    [enqueueSnackbar]
  );

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

  useEffect(() => {
    const handlerNewPosition = (data: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      googleMapsRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1],
      });

      const route = routes.find((route) => route._id === data.routeId) as Route;

      if (data.finished) {
        finishRoute(route);
      }
    };

    if (!socketIORef.current?.connected) {
      socketIORef.current = io.connect(API_URL);

      socketIORef.current.on("connect", () =>
        console.log("socket successfully connected")
      );
    }

    socketIORef.current.on("new-position", handlerNewPosition);

    return () => {
      socketIORef.current?.off("new-position", handlerNewPosition);
    };
  }, [finishRoute, routes, routeIdSelected]);

  return (
    <Grid container className={classes.root}>
      <Grid item sm={4} xs={12}>
        <Navbar />
        <form onSubmit={startRoute} className={classes.form}>
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
          <div className={classes.btnSubmitWrapper}>
            <Button fullWidth type="submit" color="primary" variant="contained">
              Iniciar corrida
            </Button>
          </div>
        </form>
      </Grid>

      <Grid item sm={8} xs={12}>
        <div id="map" className={classes.map} />
      </Grid>
    </Grid>
  );
};
