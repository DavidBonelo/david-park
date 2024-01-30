import { type DocumentType } from "@typegoose/typegoose";
import {
  AdminModel,
  type LogisticStaff,
  type AdminStaff,
  LogisticModel,
} from "../models/staff";

export const getFreeAdminStaff =
  async (): Promise<DocumentType<AdminStaff> | null> =>
    await AdminModel.findOne({ available: true });
export const getFreeLogisticStaff =
  async (): Promise<DocumentType<LogisticStaff> | null> =>
    await LogisticModel.findOne({ available: true });
