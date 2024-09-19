import { db } from './mocks/db';

describe('main', () => {
  expect(1).toBeTruthy()
  it('should', () => {
    const product = db.product.getAll();
    console.log(db.product.count());
  })
})