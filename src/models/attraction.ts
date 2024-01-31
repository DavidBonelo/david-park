import {
  type DocumentType,
  Ref,
  getModelForClass,
  prop,
} from "@typegoose/typegoose";
import { OperatorStaff } from "./staff";

enum Classification {
  Extreme = "Extreme",
  Family = "Family",
  Kids = "Kids",
}

export class Attraction {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, enum: Classification })
  classification!: Classification;

  @prop()
  minHeight?: number;

  @prop({ required: true })
  price!: number;

  @prop({ default: true })
  available!: boolean;

  @prop({ ref: () => OperatorStaff })
  operator?: Ref<OperatorStaff>;

  @prop({ default: 0 })
  visitors!: number;

  @prop({ required: true })
  usagesForMaintenance!: number;

  @prop({ default: 0 })
  usagesSinceLastMaintenance!: number;

  public async disableAndSave(this: DocumentType<Attraction>): Promise<void> {
    this.available = false;
    await this.save();
  }

  public async enableAndSave(this: DocumentType<Attraction>): Promise<void> {
    this.usagesSinceLastMaintenance = 0;
    this.available = true;
    await this.save();
  }

  public async increaseVisitorsAndSave(
    this: DocumentType<Attraction>
  ): Promise<void> {
    this.visitors++;
    await this.save();
  }
}

export const AttractionModel = getModelForClass(Attraction);
