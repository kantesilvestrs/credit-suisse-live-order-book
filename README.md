# Silver Bar - Liver Order Book for Credit Suisse Interview Task

## Project

### How to use library

- run `npm run build` to create the library inside `/build/` folder
- use `liver-order-book.js` library in any `es2015` compatible environment

### Functionality

---

#### OrderBookClient

Class that instantiates new Order Book client and exposes following functionality:

- `addOrder(): Promise<Order>`
- `removeOrder(): Promise<void>`
- `getOrderBookAggregate(): Promise<OrderBookAggregate>`

**Params:** none

**Returns:** a new `OrderBookClient` instance

**Example usage:**

```javascript
() => {
  const orderBookClient = new OrderBookClient();
};
```

---

#### OrderBookClient.addOrder()

Method to add new Order to the Order Book which returns a new Order type Promise.

**Params:** `Order` - new `Order` object

**Returns:** `new Promise<Order>` - newly create Order with assigned Id

**Example usage:**

```javascript
async () => {
  const newOrder = await orderBookClient.addOrder(Order);
};
```

**Example return:**

```javascript
{
    orderId: 1,
    clientId: "sad8s82aJJas",
    price: 304,
    quantity: 4.5
    orderType: 'BUY'
}
```

---

#### OrderBookClient.removeOrder()

Method to remove an existing Order from the Order Book which returns a new void type Promise.

**Params:** `orderId` - Existing Order Id

**Example usage:**

```javascript
async () => {
  await orderBookClient.removeOrder(1).then(data => data, error => error);
};
```

---

#### OrderBookClient.getOrderBookAggregate()

Method that returns Live Order Book (Order Aggregate) as `OrderBookAggregate` type Promise.

**Params:** none

**Returns:** `new Promise<OrderBookAggregate>`

**Example usage:**

```javascript
async () => {
  const liveOrderBook = await orderBookClient.getOrderBookAggregate();
  console.log(liveOrderBook);
};
```

**Example return:**

```javascript
{
    BUY: [
        {
            priceGroup: 304,
            aggQty: 4.56,
            orders: [
                {orderId: 1, quantity: 1.2},
                {orderId: 2, quantity: 3.36}
            ]
        }
    ],
    SELL: [
        {
            priceGroup: 109,
            aggQty: 5.5,
            orders: [
                {orderId: 3, quantity: 2},
                {orderId: 4, quantity: 3.5}
            ]
        },
        {
            priceGroup: 500,
            aggQty: 1,
            orders: [
                {orderId: 5, quantity: 1}
            ]
        }
    ]
}
```

---

#### Order

Order object.

**Structure:**

```typescript
enum OrderType {
  BUY = "BUY",
  SELL = "SELL"
}

interface IOrder {
  orderId?: number;
  clientId: string;
  orderType: OrderType;
  price: number;
  quantity: number;
}
```

---

#### OrderBookAggregate

Live Order Book - Order Book Aggregate.

**Structure:**

```typescript
interface IOrderAggregate {
  priceGroup: number;
  aggQty: number;
  orders: IOrderAggregateOrder[];
}

interface IOrderBookAggregate {
  BUY: IOrderAggregate[];
  SELL: IOrderAggregate[];
  [key: string]: IOrderAggregate[];
}
```

---

### How to use the package

- To run unit/integration tests use `npm run test`
- To run a fresh build use `npm run build`, destination folder is `/build/`
- To clean out `/build/` folder use `npm run clean`

### Package Dependencies

- None

### Package Test Coverage

- 8 integration tests
- **addOrder** `19 unit tests`
- **getOrderBookAggregate** `2 unit tests`
- **removeOrder** `4 unit tests`

## Interview Task

### Assumptions

- This is a standalone UI library
- This library should be as lightweight as possible with few to none dependencies
- Developers won't use this internally as a npm package
- Requests against data store are not asynchronous
- In memory database does not need to be persisted
- Environment using library will have basic es2015 support
  - Otherwise if this would be `es5` compatible library I would need to import `es6-promise` polyfill
- Internal data store will not be access directly therefore external library unit/integration tests are enough
- Internal data store is required for future plug-and-plays
  - Otherwise, I would have flattened and coupled the data store with the client and reduced library size by 30-50%

### Notes

- Any different solutions that I would have implemented (and how) are commented against respective classes, functions in the source
- I started using `clientId` instead of `userId` from the beginning and didn't have time to start refactoring, which should be pretty straight forward with TypeScript
- Initially I started out creating a nodejs microservice with `micro` library, but after reading through requirements I settled on just creating a library that is going to be used by UI directly
- The microservice implementation would have included following:
  - Two builds:
    - One for internal use in other applications
    - The other as standalone TCP endpoint with HTTP method support
  - Persisted immutable red black tree Order Book for fast Order Matching

### Interview exercise

Imagine you're working as a programmer for a company called Silver Bars Marketplace and you have just received a new requirement. In it we would like to display to our users how much demand for silver bars there is on the market.

To do this we would like to have a 'Live Order Board' that can provide us with the following functionality:

1. Register an order. Order must contain these fields:

   - user id
   - order quantity (e.g.: 3.5 kg)
   - price per kg (e.g.: £303)
   - order type: BUY or SELL

2. Cancel a registered order - this will remove the order from 'Live Order Board'
3. Get summary information of live orders (see explanation below)
   Imagine we have received the following orders: - a) SELL: 3.5 kg for £306 [user1] - b) SELL: 1.2 kg for £310 [user2] - c) SELL: 1.5 kg for £307 [user3] - d) SELL: 2.0 kg for £306 [user4]

Our ‘Live Order Board’ should provide us the following summary information:

- 5.5 kg for £306 // order a + order d
- 1.5 kg for £307 // order c
- 1.2 kg for £310 // order b

The first thing to note here is that orders for the same price should be merged together (even when they are from different users). In this case it can be seen that order a) and d) were for the same amount (£306) and this is why only their sum (5.5 kg) is displayed (for £306) and not the individual orders (3.5 kg and 2.0 kg).The last thing to note is that for SELL orders the orders with lowest prices are displayed first. Opposite is true for the BUY orders.

Please provide the implementation of the live order board which will be packaged and shipped as a library to be used by the UI team. No database or UI/WEB is needed for this assignment (we're absolutely fine with in memory solution). The only important thing is that you just write it according to your normal standards.

NOTE: if during your implementation you'll find that something could be designed in multiple different ways, just implement the one which seems most reasonable to you and if you could provide a short (once sentence) reasoning why you choose this way and not another one, it would be great.
