import { OrderType } from "./";

/**
 * General Order interface
 *
 * @interface IOrder
 */
interface IOrder {
  /**
   * (Optional) Order Id
   *
   * @type {number}
   * @memberof IOrder
   */
  orderId?: number;
  /**
   * Linked Client Id
   *
   * @type {string}
   * @memberof IOrder
   */
  clientId: string;
  /**
   * Current Order Type
   *
   * @type {OrderType}
   * @memberof IOrder
   */
  orderType: OrderType;
  /**
   * Order matching price
   *
   * @type {number}
   * @memberof IOrder
   */
  price: number;
  /**
   * Ordered quantity
   *
   * @type {number}
   * @memberof IOrder
   */
  quantity: number;
}

export default IOrder;
