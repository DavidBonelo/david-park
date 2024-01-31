import express from "express";
import customers from "./customers";
import stations from "./stations";
import attractions from "./attractions";
import {
  BadRequestError,
  NotAllowedError,
  NotFoundError,
} from "../utils/errors";

const router = express.Router();

export default (): express.Router => {
  customers(router);
  stations(router);
  attractions(router);

  router.use(errorHandler);
  return router;
};

const errorHandler = (
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  if (err instanceof BadRequestError) res.status(400).send(err.message);
  else if (err instanceof NotAllowedError) res.status(403).send(err.message);
  else if (err instanceof NotFoundError) res.status(404).send(err.message);
  else {
    // console.error(err.stack);
    console.error("unhandled error", err.message);
    res.status(400).send(err.message);
  }
};
