import {withIronSessionApiRoute, withIronSessionSsr} from "iron-session/next";
import config from "./ironsession-config";

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, config);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, config);
}