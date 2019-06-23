const liveOrderBook = require("../../../build/live-order-book");

/**
 * Safe number addition up to 12 decimal points
 *
 * Notes:
 *  - This utility should be separate from internal addNumbers, as we need to independently verify numerical additions
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
function addNumbers(a, b) {
  return Math.round((a + b) * 1e12) / 1e12;
}

/**
 * Return Order object
 *
 * @param {*} clientId
 * @param {*} orderType
 * @param {*} price
 * @param {*} quantity
 * @returns
 */
function rO(clientId, orderType, price, quantity) {
  return {
    clientId: clientId,
    orderType: orderType,
    price: price,
    quantity: quantity
  };
}

/**
 * Random number generator with precision option
 *
 * @param {*} min
 * @param {*} max
 * @param {*} precision (Optional)
 * @returns
 */
function rN(min, max, precision) {
  if (!precision) {
    precision = 100; // 2 decimal places
  }
  return (
    Math.floor(
      Math.random() * (max * precision - 1 * precision) + min * precision
    ) /
    (1 * precision)
  );
}

describe("Order Book Client", () => {
  describe("#integration", () => {
    describe("#addOrders", () => {
      describe("adding single order", () => {
        it("should add 1 BUY order and reflect in Order Book Aggregate under BUY section", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const CLIENT_ID = "Test - clientId";
          const ORDER_TYPE = "BUY";
          const PRICE = 666;
          const QUANTITY = 66.6;

          expect.assertions(2);

          const addedOrder = await orderBookClient.addOrder(
            rO(CLIENT_ID, ORDER_TYPE, PRICE, QUANTITY)
          );

          expect(addedOrder.orderId).toBeDefined();

          const orderBookAggregate = await orderBookClient
            .getOrderBookAggregate()
            .then(data => data, error => error);

          expect(orderBookAggregate).toMatchObject({
            BUY: [
              {
                priceGroup: PRICE,
                aggQty: QUANTITY,
                orders: [
                  {
                    orderId: addedOrder.orderId,
                    quantity: addedOrder.quantity
                  }
                ]
              }
            ],
            SELL: []
          });
        });
        it("should add 1 SELL order and reflect in Order Book Aggregate under SELL section", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const CLIENT_ID = "Test - clientId";
          const ORDER_TYPE = "SELL";
          const PRICE = 999;
          const QUANTITY = 99.9;

          expect.assertions(2);

          const addedOrder = await orderBookClient.addOrder(
            rO(CLIENT_ID, ORDER_TYPE, PRICE, QUANTITY)
          );

          expect(addedOrder.orderId).toBeDefined();

          const orderBookAggregate = await orderBookClient
            .getOrderBookAggregate()
            .then(data => data, error => error);

          expect(orderBookAggregate).toMatchObject({
            BUY: [],
            SELL: [
              {
                priceGroup: PRICE,
                aggQty: QUANTITY,
                orders: [
                  {
                    orderId: addedOrder.orderId,
                    quantity: addedOrder.quantity
                  }
                ]
              }
            ]
          });
        });
      });

      describe("adding multiple orders", () => {
        it("should add 2 BUY and 2 SELL orders and reflect aggregates in Order Book Aggregate under BUY and SELL sections", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const PRICE_GROUP_BUY = 999;
          const PRICE_GROUP_SELL = 888;
          const QTY_BUY_1 = 50;
          const QTY_BUY_2 = 175;
          const QTY_SELL_1 = 0.1;
          const QTY_SELL_2 = 0.2;

          expect.assertions(5);

          const addedOrder_BUY_1 = await orderBookClient
            .addOrder(
              rO("Client Id - BUY - 1", "BUY", PRICE_GROUP_BUY, QTY_BUY_1)
            )
            .then(data => data, error => error);
          expect(addedOrder_BUY_1.orderId).toBeDefined();

          const addedOrder_SELL_1 = await orderBookClient
            .addOrder(
              rO("Client Id - SELL - 1", "SELL", PRICE_GROUP_SELL, QTY_SELL_1)
            )
            .then(data => data, error => error);
          expect(addedOrder_SELL_1.orderId).toBeDefined();

          const addedOrder_BUY_2 = await orderBookClient
            .addOrder(
              rO("Client Id - BUY - 2", "BUY", PRICE_GROUP_BUY, QTY_BUY_2)
            )
            .then(data => data, error => error);
          expect(addedOrder_BUY_2.orderId).toBeDefined();

          const addedOrder_SELL_2 = await orderBookClient
            .addOrder(
              rO("Client Id - SELL - 2", "SELL", PRICE_GROUP_SELL, QTY_SELL_2)
            )
            .then(data => data, error => error);
          expect(addedOrder_SELL_2.orderId).toBeDefined();

          const orderBookAggregate = await orderBookClient
            .getOrderBookAggregate()
            .then(data => data, error => error);

          expect(orderBookAggregate).toMatchObject({
            BUY: [
              {
                priceGroup: PRICE_GROUP_BUY,
                aggQty: addNumbers(QTY_BUY_1, QTY_BUY_2),
                orders: [
                  {
                    orderId: addedOrder_BUY_1.orderId,
                    quantity: addedOrder_BUY_1.quantity
                  },
                  {
                    orderId: addedOrder_BUY_2.orderId,
                    quantity: addedOrder_BUY_2.quantity
                  }
                ]
              }
            ],
            SELL: [
              {
                priceGroup: PRICE_GROUP_SELL,
                aggQty: addNumbers(QTY_SELL_1, QTY_SELL_2),
                orders: [
                  {
                    orderId: addedOrder_SELL_1.orderId,
                    quantity: addedOrder_SELL_1.quantity
                  },
                  {
                    orderId: addedOrder_SELL_2.orderId,
                    quantity: addedOrder_SELL_2.quantity
                  }
                ]
              }
            ]
          });
        });
      });
    });

    describe("#removeOrders", () => {
      describe("adding and removing orders", () => {
        it("should add and remove same order from Order Book", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const CLIENT_ID = "Test - clientId";
          const ORDER_TYPE = "BUY";
          const PRICE = 500;
          const QUANTITY = 34.5;

          expect.assertions(2);
          const addedOrder = await orderBookClient
            .addOrder(rO(CLIENT_ID, ORDER_TYPE, PRICE, QUANTITY))
            .then(data => data, error => error);

          expect(addedOrder.orderId).toBeDefined();

          const data = await orderBookClient
            .removeOrder(addedOrder.orderId)
            .then(() => true, error => error)
            .catch(error => {
              expect(error).toBeTruthy();
            });
          expect(data).toBe(true);
        });

        it("should add 2 orders and remove 1 order from Order Book", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();

          expect.assertions(3);

          const addedOrder_1 = await orderBookClient
            .addOrder(rO("Client Id - 1", "BUY", 100, 101))
            .then(data => data, error => error);

          expect(addedOrder_1.orderId).toBeDefined();

          const addedOrder_2 = await orderBookClient
            .addOrder(rO("Client Id - 2", "SELL", 99, 98))
            .then(data => data, error => error);

          expect(addedOrder_2.orderId).toBeDefined();

          const data = await orderBookClient
            .removeOrder(addedOrder_1.orderId)
            .then(() => true, error => error)
            .catch(error => {
              expect(error).toBeTruthy();
            });
          expect(data).toBe(true);
        });
      });

      describe("removing non-existing orders", () => {
        it("should reject when removing 1 non-existing order from Order Book", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const ORDER_ID = 1;
          expect.assertions(2);

          await orderBookClient.removeOrder(ORDER_ID).then(
            data => data,
            error => {
              expect(error.message).toBeDefined();
              expect(error.message).toBe(
                `Order (${ORDER_ID}) does not exist in Order Book.`
              );
            }
          );
        });
        it("should reject when adding 2 orders and removing 1 non-existing order from Order Book", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const NON_EXISTING_ORDER_ID = 9999;
          expect.assertions(4);

          const addedOrder_1 = await orderBookClient
            .addOrder({
              clientId: "Client Id - 1",
              orderType: "BUY",
              price: 100,
              quantity: 101
            })
            .then(data => data, error => error);

          expect(addedOrder_1.orderId).toBeDefined();

          const addedOrder_2 = await orderBookClient
            .addOrder({
              clientId: "Client Id - 2",
              orderType: "SELL",
              price: 99,
              quantity: 98
            })
            .then(data => data, error => error);

          expect(addedOrder_2.orderId).toBeDefined();

          await orderBookClient.removeOrder(NON_EXISTING_ORDER_ID).then(
            data => data,
            error => {
              expect(error.message).toBeDefined();
              expect(error.message).toBe(
                `Order (${NON_EXISTING_ORDER_ID}) does not exist in Order Book.`
              );
            }
          );
        });
      });
    });

    describe("#getOrderBookAggregate", () => {
      describe("aggregate and sort Monkey Tests/Smoke Tests", () => {
        it("should show correct aggregate sort after adding 3 BUY orders and 5 SELL orders", async () => {
          const orderBookClient = new liveOrderBook.OrderBookClient();
          const BUY_ORDERS_COUNT = 3;
          const SELL_ORDERS_COUNT = 5;
          const BUY_ORDER_PRICE_GROUPS = [304, 304, 305];
          const SELL_ORDER_PRICE_GROUPS = [301, 302, 500, 500, 190];
          const BUY_ORDERS = {};
          const SELL_ORDERS = {};
          const BUY_ORDER_AGG_QTY = {};
          const SELL_ORDER_AGG_QTY = {};

          expect.assertions(26);

          // Set-up BUY Orders
          for (let i = 0; i < BUY_ORDERS_COUNT; i++) {
            // Get random quantity
            const quantity = rN(0, 10, 10000);
            // Add BUY order
            const addedOrder = await orderBookClient
              .addOrder(
                rO(
                  `Client Id - BUY - ${i}`,
                  "BUY",
                  BUY_ORDER_PRICE_GROUPS[i],
                  quantity
                )
              )
              .then(data => data, error => error);
            expect(addedOrder.orderId).toBeDefined();

            // Push created BUY order in our list
            if (Array.isArray(BUY_ORDERS[`${BUY_ORDER_PRICE_GROUPS[i]}`])) {
              BUY_ORDERS[`${BUY_ORDER_PRICE_GROUPS[i]}`].push(addedOrder);
            } else {
              BUY_ORDERS[`${BUY_ORDER_PRICE_GROUPS[i]}`] = [addedOrder];
            }

            // Aggregate total quantity for price group
            BUY_ORDER_AGG_QTY[`${BUY_ORDER_PRICE_GROUPS[i]}`] = addNumbers(
              BUY_ORDER_AGG_QTY[`${BUY_ORDER_PRICE_GROUPS[i]}`] || 0,
              quantity
            );
          }

          // Set-up SELL Orders
          for (let i = 0; i < SELL_ORDERS_COUNT; i++) {
            // Generate random quantity
            const quantity = rN(0, 10, 10000);

            // Add SELL order
            const addedOrder = await orderBookClient
              .addOrder(
                rO(
                  `Client Id - SELL - ${i}`,
                  "SELL",
                  SELL_ORDER_PRICE_GROUPS[i],
                  quantity
                )
              )
              .then(data => data, error => error);
            expect(addedOrder.orderId).toBeDefined();

            // Push SELL order in our list
            if (Array.isArray(SELL_ORDERS[`${SELL_ORDER_PRICE_GROUPS[i]}`])) {
              SELL_ORDERS[`${SELL_ORDER_PRICE_GROUPS[i]}`].push(addedOrder);
            } else {
              SELL_ORDERS[`${SELL_ORDER_PRICE_GROUPS[i]}`] = [addedOrder];
            }

            // Aggregate total quantity for price group
            SELL_ORDER_AGG_QTY[`${SELL_ORDER_PRICE_GROUPS[i]}`] = addNumbers(
              SELL_ORDER_AGG_QTY[`${SELL_ORDER_PRICE_GROUPS[i]}`] || 0,
              quantity
            );
          }

          // Get Live Order Book
          const orderBookAggregate = await orderBookClient
            .getOrderBookAggregate()
            .then(data => data, error => error);

          // Verify BUY orders
          expect(orderBookAggregate.BUY).toBeDefined();
          expect(orderBookAggregate.BUY.length).toBe(2);

          const BUY_ORDERS_SORTED = true;
          const OBA_BUY = orderBookAggregate.BUY;
          const BUY_ORDERS_LENGTH = OBA_BUY.length;

          for (let i = 0; i < BUY_ORDERS_LENGTH; i++) {
            // Check if array is correctly sorted
            if (BUY_ORDERS_SORTED && i < BUY_ORDERS_LENGTH - 1) {
              if (OBA_BUY[i].priceGroup < OBA_BUY[i + 1].priceGroup) {
                BUY_ORDERS_SORTED = false;
              }
            }

            // Verify aggregate quantity matches expected
            expect(OBA_BUY[i].aggQty).toBe(
              BUY_ORDER_AGG_QTY[`${OBA_BUY[i].priceGroup}`]
            );

            // Verify orders match
            const priceGroupOrders = BUY_ORDERS[`${OBA_BUY[i].priceGroup}`].map(
              order => ({
                orderId: order.orderId,
                quantity: order.quantity
              })
            );
            expect(OBA_BUY[i].orders).toMatchObject(priceGroupOrders);
          }

          expect(BUY_ORDERS_SORTED).toBe(true);

          // Verify SELL Orders
          expect(orderBookAggregate.SELL).toBeDefined();
          expect(orderBookAggregate.SELL.length).toBe(4);

          const SELL_ORDERS_SORTED = true;
          const OBA_SELL = orderBookAggregate.SELL;
          const SELL_ORDERS_LENGTH = OBA_SELL.length;

          for (let i = 0; i < SELL_ORDERS_LENGTH; i++) {
            // Check if array is correctly sorted
            if (SELL_ORDERS_SORTED && i < SELL_ORDERS_LENGTH - 1) {
              if (OBA_SELL[i].priceGroup > OBA_SELL[i + 1].priceGroup) {
                SELL_ORDERS_SORTED = false;
              }
            }

            // Verify aggregate quantity matches expected
            expect(OBA_SELL[i].aggQty).toBe(
              SELL_ORDER_AGG_QTY[`${OBA_SELL[i].priceGroup}`]
            );

            // Verify orders match
            const priceGroupOrders = SELL_ORDERS[
              `${OBA_SELL[i].priceGroup}`
            ].map(order => ({
              orderId: order.orderId,
              quantity: order.quantity
            }));
            expect(OBA_SELL[i].orders).toMatchObject(priceGroupOrders);
          }

          expect(SELL_ORDERS_SORTED).toBe(true);
        });
      });
    });
  });
});
