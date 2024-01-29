import { type Customer, CustomerModel } from "../models/customer";

export const getAllCustomers = async (): Promise<Customer[]> =>
  await CustomerModel.find();
// export const getCustomerById = (id: string) => CustomerModel.findById(id);
export const getCustomerByIdentification = async (
  identification: any
): Promise<Customer | null> => await CustomerModel.findOne({ identification });

export const createCustomer = async (
  values: Record<string, any>
): Promise<Customer> => await CustomerModel.create(values);

export const deleteCustomerById = async (
  id: string
): Promise<Customer | null> =>
  await CustomerModel.findOneAndDelete({ _id: id });

export const updateCustomerById = async (
  id: string,
  values: Record<string, any>
): Promise<Customer | null> =>
  await CustomerModel.findByIdAndUpdate(id, values, { new: true });

export const incrementCustomerVisits = async (
  existingCustomer: Customer
): Promise<Customer | null> => {
  const updatedCustomer = await updateCustomerById(
    existingCustomer._id.toString(),
    {
      visits: existingCustomer.visits + 1,
    }
  );
  console.log("Customer updated, welcome back :)", updatedCustomer);
  return updatedCustomer;
};
