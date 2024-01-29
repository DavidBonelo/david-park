/* eslint-disable @typescript-eslint/no-floating-promises */
import "dotenv/config";
import { closeDatabase, runDatabase } from "./db";
import { CustomerModel } from "./models/customer";
import * as customerService from "./services/customers";

run();
async function run(): Promise<void> {
  await runDatabase().catch(console.dir);
  //   customerService.getCustomerByIdentification("test").then(console.log);
  closeDatabase();
  // populateCustomers();
}

type CustomerData = Record<
  "name" | "identification" | "email" | "height" | "age" | "contact",
  any
>;

const customerData: CustomerData[] = [
  {
    name: "test",
    identification: "test",
    email: "test",
    height: 1,
    age: 1,
    contact: "test",
  },
];

function populateCustomers(): void {
  CustomerModel.insertMany(customerData);
}
