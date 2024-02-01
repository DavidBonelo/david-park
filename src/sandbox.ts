import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { closeDatabase, runDatabase } from "./db";
import { CustomerModel } from "./models/customer";
import {
  AdminModel,
  LogisticModel,
  MaintenanceModel,
  MarketingModel,
  OperatorModel,
} from "./models/staff";
import { AttractionModel } from "./models/attraction";
import { amusementParkAttractions, customersData } from "./sample-data";

void databasePlayground();

export async function databasePlayground(): Promise<void> {
  await runDatabase().catch(console.dir);
  // await populateCustomers();
  // await populateAdmins();
  // await populateLogistics();
  await freeLogistics();
  // await populateOperators();
  // await populateMaintenanceStaff();
  // await populateMarketingStaff();
  // await populateAttractions();
  closeDatabase();
}

export async function populateTestDb(): Promise<void> {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const oneCustomer = await CustomerModel.findOne();
  if (oneCustomer === null) {
    await mongoose.connection.db.dropDatabase();
    await freeLogistics();
    await populateCustomers();
    await populateAdmins();
    await populateLogistics();
    await populateOperators();
    await populateMaintenanceStaff();
    await populateMarketingStaff();
    await populateAttractions();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
}

async function populateCustomers(): Promise<void> {
  await CustomerModel.insertMany(customersData);
}

async function populateAdmins(): Promise<void> {
  await AdminModel.insertMany([
    { name: "Alice", workSchedule: "fulltime" },
    { name: "Bob", workSchedule: "partial" },
    { name: "Charlie", workSchedule: "partial" },
    { name: "Dave", workSchedule: "fulltime" },
    { name: "Eve", workSchedule: "fulltime" },
  ]);
}

async function populateLogistics(): Promise<void> {
  await LogisticModel.insertMany([
    { name: "Alexia", workSchedule: "fulltime" },
    { name: "Donovan", workSchedule: "partial" },
    { name: "Isabella", workSchedule: "partial" },
    { name: "Malik", workSchedule: "fulltime" },
    { name: "Chloe", workSchedule: "fulltime" },
    { name: "Xavier", workSchedule: "partial" },
    { name: "Gabriella", workSchedule: "fulltime" },
    { name: "Ethan", workSchedule: "partial" },
    { name: "Lila", workSchedule: "fulltime" },
    { name: "Sebastian", workSchedule: "partial" },
  ]);
}

async function populateOperators(): Promise<void> {
  await OperatorModel.insertMany([
    { name: "Zoey", workSchedule: "fulltime" },
    { name: "Noah", workSchedule: "partial" },
    { name: "Mia", workSchedule: "fulltime" },
    { name: "Caleb", workSchedule: "partial" },
    { name: "Ava", workSchedule: "fulltime" },
    { name: "Jaxon", workSchedule: "partial" },
    { name: "Olivia", workSchedule: "fulltime" },
    { name: "Mason", workSchedule: "partial" },
    { name: "Sophia", workSchedule: "fulltime" },
    { name: "Aiden", workSchedule: "partial" },
  ]);
}

async function populateMaintenanceStaff(): Promise<void> {
  await MaintenanceModel.insertMany([
    { name: "Nathaniel", workSchedule: "fulltime" },
    { name: "Penelope", workSchedule: "partial" },
    { name: "Leo", workSchedule: "fulltime" },
    { name: "Hazel", workSchedule: "partial" },
    { name: "Desmond", workSchedule: "fulltime" },
    { name: "Fiona", workSchedule: "partial" },
    { name: "Caleb", workSchedule: "fulltime" },
    { name: "Elara", workSchedule: "partial" },
    { name: "Oscar", workSchedule: "fulltime" },
  ]);
}

async function populateMarketingStaff(): Promise<void> {
  await MarketingModel.insertMany([
    { name: "Serena", workSchedule: "fulltime" },
    { name: "Jasper", workSchedule: "partial" },
    { name: "Vivian", workSchedule: "fulltime" },
    { name: "Kieran", workSchedule: "partial" },
    { name: "Nora", workSchedule: "fulltime" },
    { name: "Silas", workSchedule: "partial" },
    { name: "Elena", workSchedule: "fulltime" },
    { name: "Quincy", workSchedule: "partial" },
    { name: "Freya", workSchedule: "fulltime" },
    { name: "Felix", workSchedule: "partial" },
  ]);
}

async function populateAttractions(): Promise<void> {
  const operators = await OperatorModel.find({ available: true });
  const smallestArrayLength = Math.min(
    operators.length,
    amusementParkAttractions.length
  );
  for (let i = 0; i < smallestArrayLength - 1; i++) {
    const operator = operators[i];
    amusementParkAttractions[i].operator = operator._id;
  }
  await AttractionModel.insertMany(amusementParkAttractions).catch(console.dir);
}

async function freeLogistics(): Promise<void> {
  const logistics = await LogisticModel.find({});
  for (const logistic of logistics) {
    logistic.available = true;
    await logistic.save();
  }
}
