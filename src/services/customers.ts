import { type DocumentType } from "@typegoose/typegoose";
import { type Customer, CustomerModel } from "../models/customer";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { isValidObjectId } from "mongoose";

export const getAllCustomers = async (): Promise<Customer[]> =>
  await CustomerModel.find();

export const getCustomerById = async (
  id: string
): Promise<DocumentType<Customer>> => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid or missing customer id");
  }
  const customer = await CustomerModel.findById(id);
  if (customer === null) {
    throw new NotFoundError(`Customer id: ${id} nor found`);
  }
  return customer;
};

export const getCustomerByIdentification = async (
  identification: any
): Promise<DocumentType<Customer>> => {
  if (identification === undefined) {
    throw new Error("Missing identification");
  }
  const customer = await CustomerModel.findOne({ identification });
  if (customer === null) {
    throw new NotFoundError(`Customer not found`);
  }
  return customer;
};

export const createCustomer = async (
  values: Record<string, any>
): Promise<Customer> => {
  if (values.age < 18 && values.contact === undefined) {
    throw new Error("Contact is required for minors");
  }
  try {
    return await CustomerModel.create(values);
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

export const deleteCustomerById = async (id: string): Promise<Customer> => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError(`Invalid customer id: ${id}`);
  }
  const deletedCustomer = await CustomerModel.findOneAndDelete({ _id: id });
  if (deletedCustomer === null) {
    throw new NotFoundError(`Customer ${id} not found`);
  }

  return deletedCustomer;
};

export const updateCustomerById = async (
  id: string,
  values: Record<string, any>
): Promise<DocumentType<Customer>> => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid or missing customer id");
  }
  const updatedCustomer = await CustomerModel.findByIdAndUpdate(id, values, {
    new: true,
  });
  if (updatedCustomer === null) {
    throw new NotFoundError(`Customer: ${id} not found`);
  }
  return updatedCustomer;
};

export const incrementCustomerVisits = async (
  customer: DocumentType<Customer>
): Promise<DocumentType<Customer>> => {
  const updatedCustomer = await updateCustomerById(customer._id.toString(), {
    $inc: { visits: 1 },
  });
  return updatedCustomer;
};

export async function getMarketableCustomers(
  visits: number
): Promise<Array<DocumentType<Customer>>> {
  return await CustomerModel.find({ visits: { $gte: visits } }).sort({
    visits: "descending",
  });
}

export async function sendEmail(id: string, message: string): Promise<void> {
  if (message === undefined) {
    throw new BadRequestError("Message is missing or invalid");
  }
  const customer = await getCustomerById(id);
  customer.promotionsSent++;
  await customer.save();
  console.log(`Email sent`, { to: customer.email, message });
}

export async function sendEmails(
  customersData: Array<Record<string, any>>,
  message: string
): Promise<Array<Record<string, any>>> {
  if (customersData === undefined || customersData.length === 0) {
    throw new BadRequestError("List of customers is required");
  }

  const notFound = [];

  for (const customerData of customersData) {
    const id = customerData.id as string;
    try {
      await sendEmail(id, message);
    } catch (err) {
      notFound.push({ reason: (err as Error).message, customerData });
    }
  }
  return notFound;
}
