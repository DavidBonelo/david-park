import { type DocumentType } from "@typegoose/typegoose";
import {
  AdminModel,
  type LogisticStaff,
  type AdminStaff,
  type MaintenanceStaff,
  type OperatorStaff,
  LogisticModel,
  MaintenanceModel,
  OperatorModel,
} from "../models/staff";
import { isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../utils/errors";

export const getFreeAdminStaff =
  async (): Promise<DocumentType<AdminStaff> | null> =>
    await AdminModel.findOne({ available: true });

export const getFreeLogisticStaff =
  async (): Promise<DocumentType<LogisticStaff> | null> =>
    await LogisticModel.findOne({ available: true });

export async function getMaintenanceStaffById(
  id: string
): Promise<DocumentType<MaintenanceStaff>> {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Missing or invalid staff id");
  }

  const staff = await MaintenanceModel.findById(id);
  if (staff === null) {
    throw new NotFoundError(`Staff not found`);
  }
  return staff;
}

export async function getOperatorById(
  id: string
): Promise<DocumentType<OperatorStaff>> {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Missing or invalid operator id");
  }
  const operator = await OperatorModel.findById(id);
  if (operator === null) {
    throw new NotFoundError(`Operator not found`);
  }
  return operator;
}
