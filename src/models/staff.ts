import {
  type DocumentType,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { type Base } from "@typegoose/typegoose/lib/defaultClasses";
import { type Station } from "./station";
import { type Customer } from "./customer";
import { type Attraction } from "./attraction";
import { BadRequestError, NotAllowedError } from "../utils/errors";

export interface Staff extends Base {}
export abstract class Staff {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  workSchedule!: string;

  @prop({ default: true })
  available!: boolean;
}

export class AdminStaff extends Staff {
  async openStation(
    station: Station,
    employee: DocumentType<LogisticStaff>
  ): Promise<void> {
    this.available = false;
    await station.openStation(employee);
    this.available = true;
  }

  async closeStation(station: Station): Promise<void> {
    this.available = false;
    await station.closeStation();
    this.available = true;
  }
}
const AdminModel = getModelForClass(AdminStaff);

export class LogisticStaff extends Staff {
  async sellCredits(
    customer: DocumentType<Customer>,
    amount: number
  ): Promise<void> {
    customer.credits += amount;
    await customer.save();
  }
}
const LogisticModel = getModelForClass(LogisticStaff);

export class MarketingStaff extends Staff {
  async sendPromotion(customers: Array<DocumentType<Customer>>): Promise<void> {
    for (const customer of customers) {
      console.log("Sending email to " + customer.email + " with promotion");
      customer.promotionsSent++;
      await customer.save();
    }
  }
}
const MarketingModel = getModelForClass(MarketingStaff);

export class OperatorStaff extends Staff {
  customerCanRide(customer: Customer, attraction: Attraction): boolean {
    if (!attraction.available) {
      throw new BadRequestError("Attraction is not available");
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (attraction.minHeight && customer.height >= attraction.minHeight) {
      throw new NotAllowedError("Customer is too short");
    }
    if (attraction.price > customer.credits) {
      throw new NotAllowedError("Customer doesn't have enough credits");
    }
    return true;
  }
}
const OperatorModel = getModelForClass(OperatorStaff);

export class MaintenanceStaff extends Staff {
  async inspectAttraction(
    attraction: DocumentType<Attraction>
  ): Promise<string> {
    const needsMaintenance =
      attraction.usagesSinceLastMaintenance > attraction.usagesForMaintenance;

    if (needsMaintenance) {
      await attraction.disableAndSave();
      return "Attraction disabled";
    }
    return "Attraction is working properly";
  }

  async fixAttraction(attraction: DocumentType<Attraction>): Promise<string> {
    await attraction.enableAndSave();
    return "Attraction fixed";
  }
}
const MaintenanceModel = getModelForClass(MaintenanceStaff);

export {
  AdminModel,
  LogisticModel,
  MarketingModel,
  OperatorModel,
  MaintenanceModel,
};
