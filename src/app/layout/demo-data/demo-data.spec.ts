import { DEMO_PAGES } from './demo-data';

describe('Demo order items', () => {
  const page = DEMO_PAGES['orders'];
  it('includes single and multiple product orders with unique product codes', () => {
    const orders = Object.values(page.orderItems!);
    expect(orders.some((items) => items.length === 1)).toBeTrue();
    expect(orders.some((items) => items.length > 1)).toBeTrue();
    for (const items of orders) {
      expect(new Set(items.map((item) => item.code)).size).toBe(items.length);
    }
  });
  it('keeps list totals and quantities consistent with the detail lines', () => {
    for (const row of page.rows) {
      const items = page.orderItems![String(row['code'])];
      expect(items.length).toBeGreaterThan(0);
      expect(row['quantity']).toBe(
        items.reduce((sum, item) => sum + item.quantity, 0),
      );
      expect(row['total']).toBe(
        items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      );
      for (const item of items)
        expect(item.total).toBe(item.unitPrice * item.quantity);
    }
  });
});
