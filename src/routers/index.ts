import express from "express";
import customers from "./customers";
import stations from "./stations";
import attractions from "./attractions";

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
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  // console.error(err.stack);
  console.error(err.message);
  res.status(400).send(err.message);
};
