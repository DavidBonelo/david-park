import { getModelForClass, prop } from "@typegoose/typegoose";

export class Customer {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  identification!: string;

  @prop()
  email?: string;

  @prop()
  height?: number;

  @prop()
  age?: number;

  @prop()
  contact?: string;

  @prop({ default: 0 })
  visits: number = 0;

  @prop({ default: 0 })
  credits: number = 0;
}

export const CustomerModel = getModelForClass(Customer);
