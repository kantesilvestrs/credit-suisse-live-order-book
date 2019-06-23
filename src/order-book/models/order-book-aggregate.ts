import IOrderAggregate from "./order-aggregate.interface";

interface IOrderBookAggregate {
  BUY: IOrderAggregate[];
  SELL: IOrderAggregate[];
  [key: string]: IOrderAggregate[];
}

export default class OrderBookAggregate implements IOrderBookAggregate {
  [key: string]: IOrderAggregate[];
  /**
   * BUY Order Type price group aggregate list
   *
   * @type {IOrderAggregate[]}
   * @memberof OrderBookAggregate
   */
  BUY: IOrderAggregate[];
  /**
   * SELL Order Type price group aggregate list
   *
   * @type {IOrderAggregate[]}
   * @memberof OrderBookAggregate
   */
  SELL: IOrderAggregate[];

  constructor() {
    this.BUY = [] as IOrderAggregate[];
    this.SELL = [] as IOrderAggregate[];
  }
}
