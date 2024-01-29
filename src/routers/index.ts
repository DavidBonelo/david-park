import express from "express";
import customers from "./customers";

const router = express.Router();

export default (): express.Router => {
  customers(router);

  router.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // console.error(err.stack);
      console.error(err.message);
      res.status(400).send(err.message);
    }
  );
  return router;
};
