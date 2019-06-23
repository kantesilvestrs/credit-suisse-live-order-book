import { addNumbers } from "../utils";
import IOrder from "../models/order.interface";
import OrderBookAggregate from "../models/order-book-aggregate";

/**
 * Order Book Store
 *
 * Here are other solutions
 *  - Implement event sourced store
 *  - Implement immutable store
 *
 * @export
 * @class OrderBookStore
 */
export default class OrderBookStore {
  private orderBook: IOrder[] = [] as IOrder[];

  /**
   * Last Order Id
   *
   * Here are few other solutions:
   *  - uuid as string id, would not require this implementation
   *  - save last order and increment id, this way it is easier to implement red black tree store
   *
   * @private
   * @type {number}
   * @memberof OrderBookStore
   */
  private lastOrderId: number = 0;

  /**
   * Add a new Order to the Order Book
   *
   * @param {IOrder} order
   * @returns {Promise<void>}
   * @memberof OrderBookStore
   */
  addOrder(order: IOrder): Promise<IOrder> {
    return new Promise((resolve, reject) => {
      try {
        order.orderId = this.getNextId();
        this.orderBook.push(order);
        resolve(order);
      } catch (e) {
        console.error(e);
        reject({
          message: "Internal store error.",
          error: e
        });
      }
    });
  }

  /**
   * Remove an order from the Order Book
   *
   * Note:
   *  - This can be improved with immutable store
   *
   * @param {number} orderId
   * @returns {Promise<void>}
   * @memberof OrderBookStore
   */
  removeOrder(orderId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const orderIndex = this.orderBook.findIndex(
          ({ orderId: oId }) => oId === orderId
        );

        if (orderIndex !== -1) {
          // Removing instead of cancelling the order
          this.orderBook = this.orderBook.filter(
            ({ orderId: oId }) => oId !== orderId
          );
          resolve();
        } else {
          reject({
            message: `Order (${orderId}) does not exist in Order Book.`
          });
        }
      } catch (e) {
        console.error(e);
        reject({
          message: "Internal store error.",
          error: e
        });
      }
    });
  }

  /**
   * Get current Order Book aggregate
   *
   * Here are few other solutions:
   *  - Per order type SortedMap or SortedSet lists to remove sorting requirement
   *  - Implement composite lists for allready aggregated values
   *
   * @returns {Promise<OrderBookAggregate>} A new OrderBookAggregate promise
   * @memberof OrderBookStore
   */
  getOrderBookAggregate(): Promise<OrderBookAggregate> {
    return new Promise((resolve, reject) => {
      try {
        const currentOrderBookAggregate = this.createOrderBookAggregate(
          this.orderBook
        );
        this.sortOrderBookAggregatePriceGroups(currentOrderBookAggregate);
        resolve(currentOrderBookAggregate);
      } catch (e) {
        console.error(e);
        reject({
          message: "Internal store error.",
          error: e
        });
      }
    });
  }

  /**
   * Get next Order Id
   *
   * @returns {number}
   * @memberof OrderBookStore
   */
  getNextId(): number {
    return ++this.lastOrderId;
  }

  /**
   * Sort BUY/SELL price groups
   *
   * Notes:
   *  - This method could be avoided with SortedSet or SortedMap array
   *
   * @private
   * @param {OrderBookAggregate} orderBookAggregate
   * @memberof OrderBookStore
   */
  private sortOrderBookAggregatePriceGroups(
    orderBookAggregate: OrderBookAggregate
  ): void {
    // Don't need to check equals as price groups will always be unique
    // Display SELL Order Type price groups in ASC order
    orderBookAggregate.SELL.sort((a, b) =>
      a.priceGroup > b.priceGroup ? 1 : -1
    );
    // Display SELL Order Type price groups in DESC order
    orderBookAggregate.BUY.sort((a, b) =>
      a.priceGroup > b.priceGroup ? -1 : 1
    );
  }

  /**
   * Create new Order Book BUY/SELL aggregate
   *
   * Notes:
   *  - This whole method can be avoided with composite type array
   *
   * @private
   * @param {IOrder[]} orderBook
   * @returns {OrderBookAggregate} A new OrderBookAggregate class
   * @memberof OrderBookStore
   */
  private createOrderBookAggregate(orderBook: IOrder[]): OrderBookAggregate {
    return orderBook.reduce(function(rv, cv) {
      // Find index of the current order price group
      const priceGroupIndex = rv[cv.orderType].findIndex(
        ({ priceGroup: price }) => price === cv.price
      );

      // Add initial value if the price group doesn't exist and return value
      if (priceGroupIndex === -1) {
        rv[cv.orderType].push({
          priceGroup: cv.price,
          aggQty: cv.quantity,
          orders: [
            {
              orderId: cv.orderId as number,
              quantity: cv.quantity
            }
          ]
        });

        return rv;
      }

      // Aggregate the summ and add the Order to orders list
      const currentPriceGroup = rv[cv.orderType][priceGroupIndex];
      currentPriceGroup.aggQty = addNumbers(
        currentPriceGroup.aggQty,
        cv.quantity
      );
      currentPriceGroup.orders.push({
        orderId: cv.orderId as number,
        quantity: cv.quantity
      });

      return rv;
    }, new OrderBookAggregate());
  }
}
