import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
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

  @prop({ default: 0 })
  daysSinceLastMaintenance!: number;
}

export const AttractionModel = getModelForClass(Attraction);
