const liveOrderBook = require("../../../build/live-order-book");

describe("Order Book Client - removeOrder", () => {
  describe("#methodcall", () => {
    describe("valid paramters", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should accept orderId", () => {
        expect.assertions(1);
        expect(() => {
          orderBookClient.removeOrder(1).then(data => data, error => error);
        }).not.toThrowError();
      });
    });
    describe("invalid parameter", () => {
      describe("wrong type used", () => {
        const orderBookClient = new liveOrderBook.OrderBookClient();

        it("should error when incorrect orderId type is specified", () => {
          expect.assertions(6);
          expect(() => {
            orderBookClient.removeOrder(true);
          }).toThrowError("orderId must be a number.");

          expect(() => {
            orderBookClient.removeOrder(false);
          }).toThrowError("orderId must be a number.");

          expect(() => {
            orderBookClient.removeOrder("asd");
          }).toThrowError("orderId must be a number.");

          expect(() => {
            orderBookClient.removeOrder(() => {});
          }).toThrowError("orderId must be a number.");

          expect(() => {
            orderBookClient.removeOrder({});
          }).toThrowError("orderId must be a number.");

          expect(() => {
            orderBookClient.removeOrder(new Promise(resolve => resolve));
          }).toThrowError("orderId must be a number.");
        });
      });
    });

    describe("invalid arguments", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should error when no arguments are provided", () => {
        expect.assertions(1);
        expect(() => {
          orderBookClient.removeOrder();
        }).toThrowError("Method expects 1 argument but it received 0.");
      });

      it("should error when too many arguments are provided", () => {
        expect(() => {
          expect.assertions(1);
          orderBookClient.removeOrder(1, 2, 3, 4);
        }).toThrowError("Method expects 1 argument but it received 4.");
      });
    });
  });
});
