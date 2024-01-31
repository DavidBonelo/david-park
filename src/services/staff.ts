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

export const getFreeAdminStaff =
  async (): Promise<DocumentType<AdminStaff> | null> =>
    await AdminModel.findOne({ available: true });

export const getFreeLogisticStaff =
  async (): Promise<DocumentType<LogisticStaff> | null> =>
    await LogisticModel.findOne({ available: true });

export async function getMaintenanceStaffById(
  id: string
): Promise<DocumentType<MaintenanceStaff> | null> {
  return await MaintenanceModel.findById(id);
}

export async function getOperatorById(
  id: string
): Promise<DocumentType<OperatorStaff> | null> {
  return await OperatorModel.findById(id);
}
