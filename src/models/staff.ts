import { getModelForClass, prop } from "@typegoose/typegoose";
import { type Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface Staff extends Base {}
export abstract class Staff {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  workSchedule!: string;

  @prop({ default: true })
  available!: boolean;
}

