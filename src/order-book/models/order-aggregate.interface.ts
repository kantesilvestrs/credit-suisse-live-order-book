interface IOrderAggregateOrder {
  /**
   * Matching Order Id
   *
   * @type {number}
   * @memberof IOrderAggregateOrder
   */
  orderId: number;
  /**
   * Order specific quantity
   *
   * @type {number}
   * @memberof IOrderAggregateOrder
   */
  quantity: number;
}

interface IOrderAggregate {
  /**
   * Order price group
   *
   * @type {number}
   * @memberof IOrderAggregate
   */
  priceGroup: number;
  /**
   * Order aggregate quantity
   *
   * @type {number}
   * @memberof IOrderAggregate
   */
  aggQty: number;

  /**
   * Price group order list
   *
   * @type {IOrderAggregateOrder[]}
   * @memberof IOrderAggregate
   */
  orders: IOrderAggregateOrder[];
}

export default IOrderAggregate;
