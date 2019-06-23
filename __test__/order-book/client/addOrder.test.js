const liveOrderBook = require("../../../build/live-order-book");

describe("Order Book Client - addOrder", () => {
  describe("#methodcall", () => {
    describe("valid parameters", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should create BUY order", async done => {
        const CLIENT_ID = "Test - clientId";
        const ORDER_TYPE = "BUY";
        const PRICE = 304;
        const QUANTITY = 5.4;

        expect.assertions(4);
        const newOrder = await orderBookClient.addOrder({
          clientId: CLIENT_ID,
          orderType: ORDER_TYPE,
          price: PRICE,
          quantity: QUANTITY
        });
        expect(newOrder.clientId).toEqual(CLIENT_ID);
        expect(newOrder.orderType).toEqual(ORDER_TYPE);
        expect(newOrder.price).toEqual(PRICE);
        expect(newOrder.quantity).toEqual(QUANTITY);

        done();
      });

      it("should create SELL order", async done => {
        const CLIENT_ID = "Test - clientId";
        const ORDER_TYPE = "SELL";
        const PRICE = 288;
        const QUANTITY = 0.123;

        expect.assertions(4);
        const newOrder = await orderBookClient.addOrder({
          clientId: CLIENT_ID,
          orderType: ORDER_TYPE,
          price: PRICE,
          quantity: QUANTITY
        });
        expect(newOrder.clientId).toEqual(CLIENT_ID);
        expect(newOrder.orderType).toEqual(ORDER_TYPE);
        expect(newOrder.price).toEqual(PRICE);
        expect(newOrder.quantity).toEqual(QUANTITY);

        done();
      });
    });

    describe("invalid parameters", () => {
      describe("wrong type used", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when incorrect order parameter type is specified", () => {
          expect.assertions(4);
          expect(() => {
            orderBookClient.addOrder(-1);
          }).toThrowError("order must be a object.");

          expect(() => {
            orderBookClient.addOrder("123");
          }).toThrowError("order must be a object.");

          expect(() => {
            orderBookClient.addOrder(() => {});
          }).toThrowError("order must be a object.");

          expect(() => {
            orderBookClient.addOrder(true);
          }).toThrowError("order must be a object.");
        });

        it("should error when incorrect clientId type", () => {
          expect.assertions(5);
          expect(() => {
            orderBookClient.addOrder({
              clientId: 1
            });
          }).toThrowError("clientId must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: () => {}
            });
          }).toThrowError("clientId must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: new Promise(resolve => resolve)
            });
          }).toThrowError("clientId must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: true
            });
          }).toThrowError("clientId must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: {}
            });
          }).toThrowError("clientId must be a string.");
        });

        it("should error when incorrect quantity type", () => {
          expect.assertions(5);
          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: "5.2"
            });
          }).toThrowError("quantity must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: true
            });
          }).toThrowError("quantity must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: () => {}
            });
          }).toThrowError("quantity must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: false
            });
          }).toThrowError("quantity must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: new Promise(resolve => resolve)
            });
          }).toThrowError("quantity must be a number.");
        });

        it("should error when incorrect price type", () => {
          expect.assertions(7);
          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 1,
              price: {}
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 2,
              price: "1.3"
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 4.0,
              price: false
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 2.1,
              price: true
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 2.1,
              price: true,
              orderType: "ELSE"
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 2.1,
              price: () => {},
              orderType: "ELSE"
            });
          }).toThrowError("price must be a number.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 2.455,
              price: new Promise(resolve => resolve),
              orderType: "SELL"
            });
          }).toThrowError("price must be a number.");
        });

        it("should error when incorrect order type", () => {
          expect.assertions(6);
          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: []
            });
          }).toThrowError("orderType must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: {}
            });
          }).toThrowError("orderType must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: false
            });
          }).toThrowError("orderType must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: +""
            });
          }).toThrowError("orderType must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: +"2"
            });
          }).toThrowError("orderType must be a string.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "test-clientId",
              quantity: 5.2,
              price: 204,
              orderType: new Promise(resolve => resolve)
            });
          }).toThrowError("orderType must be a string.");
        });
      });

      describe("invalid properties", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when incorrect order properties are specified", () => {
          expect.assertions(2);
          expect(() => {
            orderBookClient.addOrder({
              test: "Test - test",
              orderId: 1,
              clientId: "Test - clientId",
              quantity: 5.2,
              price: 200,
              orderType: "SELL"
            });
          }).toThrowError("order contains invalid properties test, orderId.");

          expect(() => {
            orderBookClient.addOrder({
              clientId: "Test - clientId",
              quantity: 5.2,
              price: 200,
              orderType: "SELL",
              lastProp: 1
            });
          }).toThrowError("order contains invalid properties lastProp.");
        });
      });

      describe("missing parameters", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when clientId is missing", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: 5.4
            });
          }).toThrowError("The clientId parameter is missing.");
        });

        it("should error when quantity is missing", () => {
          expect(() => {
            orderBookClient.addOrder({
              clientId: "Test - clientId",
              orderType: "BUY",
              price: 100
            });
          }).toThrowError("The quantity parameter is missing.");
        });

        it("should error when price is missing", () => {
          expect(() => {
            orderBookClient.addOrder({
              clientId: "Test - clientId",
              orderType: "BUY",
              quantity: 2.3
            });
          }).toThrowError("The price parameter is missing.");
        });

        it("should error when orderType is missing", () => {
          expect(() => {
            orderBookClient.addOrder({
              clientId: "Test - clientId",
              price: 550,
              quantity: 2.3
            });
          }).toThrowError("The orderType parameter is missing.");
        });
      });

      describe("numbers must be positive or none zero", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when quantity is not positive or none zero value", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: -2,
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: 0,
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: +"-34.67",
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: +"0",
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: -"1",
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must be a positive and none zero number.");
        });

        it("should error when price is not positive or none zero value", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: -100,
              quantity: -"-2.0",
              clientId: "Test - clientId"
            });
          }).toThrowError("price must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: -"304",
              quantity: 2.6,
              clientId: "Test - clientId"
            });
          }).toThrowError("price must be a positive and none zero number.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 0,
              quantity: 2.6,
              clientId: "Test - clientId"
            });
          }).toThrowError("price must be a positive and none zero number.");
        });
      });

      describe("numbers should be supported", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when quantity exceeds 12 decimal places", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: 12.1234567890123,
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must have maximum of 12 decimal places.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 100,
              quantity: 1.1 + 2.2,
              clientId: "Test - clientId"
            });
          }).toThrowError("quantity must have maximum of 12 decimal places.");
        });

        it("should error when price exceeds 12 decimal places", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 12.1234567890123,
              quantity: 1,
              clientId: "Test - clientId"
            });
          }).toThrowError("price must have maximum of 12 decimal places.");

          expect(() => {
            orderBookClient.addOrder({
              orderType: "BUY",
              price: 0.1 + 0.2,
              quantity: 1,
              clientId: "Test - clientId"
            });
          }).toThrowError("price must have maximum of 12 decimal places.");
        });
      });

      describe("orderType should be 'BUY' or 'SELL' only", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when 'OTHER_VALUE' is specified as orderType", () => {
          expect(() => {
            orderBookClient.addOrder({
              orderType: "OTHER_VALUE",
              price: 100,
              quantity: 12.2,
              clientId: "Test - clientId"
            });
          }).toThrowError("orderType must be one of BUY, SELL.");
        });
      });
    });

    describe("invalid arguments", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should error when no arguments are provided", () => {
        expect.assertions(1);
        expect(() => {
          orderBookClient.addOrder();
        }).toThrowError("Method expects 1 argument but it received 0.");
      });

      it("should error when too many arguments are provided", () => {
        expect.assertions(1);
        expect(() => {
          orderBookClient.addOrder(1, 2, 3);
        }).toThrowError("Method expects 1 argument but it received 3.");
      });
    });
  });
});
