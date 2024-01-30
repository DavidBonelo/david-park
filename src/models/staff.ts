import {
  type DocumentType,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { type Base } from "@typegoose/typegoose/lib/defaultClasses";
import { type Station } from "./station";
import { type Customer } from "./customer";
import { type Attraction } from "./attraction";

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
    await station.openStation(employee);
  }

  closeStation(station: Station): void {
    void station.closeStation();
  }
}
const AdminModel = getModelForClass(AdminStaff);

export class LogisticStaff extends Staff {
  sellTicket(customer: Customer, amount: number): void {
    customer.credits += amount;
  }
}
const LogisticModel = getModelForClass(LogisticStaff);

export class MarketingStaff extends Staff {
  sendPromotion(customers: Customer[]): void {
    customers.forEach((customer) => {
      if (customer.visits > 3) {
        console.log("Sending email to " + customer.email + " with promotion");
      }
    });
  }
}
const MarketingModel = getModelForClass(MarketingStaff);

export class OperatorStaff extends Staff {
  customerCanRide(customer: Customer, attraction: Attraction): boolean {
    if (!attraction.available) return false;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (attraction.minHeight && customer.height >= attraction.minHeight) {
      return true;
    }
    if (attraction.price >= customer.credits) {
      return true;
    }
    return false;
  }
}
const OperatorModel = getModelForClass(OperatorStaff);

export class ManteinanceStaff extends Staff {
  inspectAttraction(attraction: Attraction): void {
    if (attraction.daysSinceLastMaintenance > 30) {
      attraction.available = false;
    }
  }

  fixAttraction(attraction: Attraction): void {
    attraction.available = true;
  }
}
const ManteinanceModel = getModelForClass(ManteinanceStaff);

export {
  AdminModel,
  LogisticModel,
  MarketingModel,
  OperatorModel,
  ManteinanceModel,
};
