import express from "express";
import customers from "./customers";
import stations from "./stations";

const router = express.Router();

export default (): express.Router => {
  customers(router);
  stations(router);

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
