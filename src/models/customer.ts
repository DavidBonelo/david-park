import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { type Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface Customer extends Base {} // hack to tel TS the "Base" types (_id, ...)
@pre<Customer>("save", function () {
  this.isMarketable = this.age >= 18;
})
export class Customer {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  identification!: string;

  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  height!: number;

  @prop({ required: true })
  age!: number;

  @prop()
  contact?: string;

  @prop({ default: 1 })
  visits: number = 1;

  @prop({ default: 0 })
  credits: number = 0;

  @prop({ default: false })
  isMarketable: boolean = (this.age ?? 0) >= 18;

  @prop({ default: 0 })
  promotionsSent: number = 0;
}

export const CustomerModel = getModelForClass(Customer);
