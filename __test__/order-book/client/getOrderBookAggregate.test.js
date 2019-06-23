const liveOrderBook = require("../../../build/live-order-book");

describe("Order Book Client - getOrderBookAggregate", () => {
  describe("#methodcall", () => {
    describe("valid paramter", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should call with no errors", () => {
        expect(() => {
          orderBookClient.getOrderBookAggregate();
        }).not.toThrowError();
      });
    });

    describe("invalid arguments", () => {
      const orderBookClient = new liveOrderBook.OrderBookClient();

      it("should error when too many arguments are provided", () => {
        expect(() => {
          orderBookClient.getOrderBookAggregate(1, 2, 3, 4);
        }).toThrowError("Method expects no arguments but it received 4.");
        expect(() => {
          orderBookClient.getOrderBookAggregate(1);
        }).toThrowError("Method expects no arguments but it received 1.");
      });
    });
  });
});
