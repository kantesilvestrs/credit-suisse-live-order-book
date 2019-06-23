import OrderBookStore from "../store";
import validate from "../utils/validate-property";
import IOrder from "../models/order.interface";
import OrderBookAggregate from "../models/order-book-aggregate";

/**
 * Order Book Client
 *
 * Here are few other solutions
 *  - Implement websocket to push order addition and removal messages
 *  - Implement Redux/NgRx for event sourced store
 *  - Implement middleware layer to add ability to use different store solutions
 *
 * @export
 * @class OrderBookClient
 */
export default class OrderBookClient {
  store: OrderBookStore;

  constructor() {
    this.store = new OrderBookStore();
  }

  addOrder(order: IOrder): Promise<IOrder> {
    if (arguments.length !== 1) {
      throw new Error(
        `Method expects 1 argument but it received ${arguments.length}.`
      );
    }
    validate(nameof(order), order, "object");
    validate(nameof(order.clientId), order.clientId, "string");
    validate(nameof(order.quantity), order.quantity, "number");
    validate(nameof(order.price), order.price, "number");
    validate(nameof(order.orderType), order.orderType, "string", [
      "BUY",
      "SELL"
    ]);
    validate(nameof(order), order, "object", [
      nameof(order.clientId),
      nameof(order.quantity),
      nameof(order.price),
      nameof(order.orderType)
    ]);
    return this.store.addOrder(order);
  }

  removeOrder(orderId: number): Promise<void> {
    if (arguments.length !== 1) {
      throw new Error(
        `Method expects 1 argument but it received ${arguments.length}.`
      );
    }
    validate(nameof(orderId), orderId, "number");
    return this.store.removeOrder(orderId);
  }

  /**
   * Query Order Book for a new Order Book Aggregate
   *
   * @returns {Promise<OrderBookAggregate>}
   * @memberof OrderBookClient
   */
  getOrderBookAggregate(): Promise<OrderBookAggregate> {
    if (arguments.length !== 0) {
      throw new Error(
        `Method expects no arguments but it received ${arguments.length}.`
      );
    }

    return this.store.getOrderBookAggregate();
  }
}
