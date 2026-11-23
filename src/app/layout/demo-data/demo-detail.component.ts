import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderItem } from './demo-data';

export interface DemoDetailData {
  title: string;
  status: string;
  tone: 'success' | 'warning' | 'error' | 'neutral';
  fields: { label: string; value: string | number }[];
  items?: OrderItem[];
}

@Component({
  selector: 'app-demo-detail',
  template: `
    <section class="detail" [class.order-detail]="detail.items">
      <div class="detail-summary">
        <h3>{{ detail.title }}</h3>
        <span class="status" [attr.data-tone]="detail.tone">{{
          detail.status
        }}</span>
      </div>
      <dl>
        @for (field of detail.fields; track field.label) {
          <div class="detail-field">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </div>
        }
      </dl>
      @if (detail.items; as items) {
        <section class="order-items" aria-label="Sipariş ürünleri">
          <h4>
            Ürünler <span>{{ items.length }} kalem</span>
          </h4>
          <div
            class="items-scroll"
            tabindex="0"
            role="region"
            aria-label="Ürün kodu, ürün ismi, adet, birim fiyat ve tutar listesi"
          >
            <div class="item-columns" aria-hidden="true">
              <span>Ürün Kodu</span><span>Ürün İsmi</span><span>Adet</span
              ><span>Birim Fiyat</span><span>Tutar</span>
            </div>
            <ul>
              @for (item of items; track item.code) {
                <li>
                  <span class="item-code">{{ item.code }}</span>
                  <div class="item-description">
                    <strong>{{ item.name }}</strong>
                  </div>
                  <span
                    class="item-quantity"
                    [attr.aria-label]="item.quantity + ' adet'"
                    >{{ item.quantity }}</span
                  >
                  <span
                    class="item-price"
                    [attr.aria-label]="'Birim fiyat: ' + money(item.unitPrice)"
                    >{{ money(item.unitPrice) }}</span
                  >
                  <strong class="item-total">{{ money(item.total) }}</strong>
                </li>
              }
            </ul>
          </div>
          <div class="order-total">
            <span
              >Genel toplam <small>{{ totalQuantity }} adet ürün</small></span
            ><strong>{{ money(totalAmount) }}</strong>
          </div>
        </section>
      }
      <p class="demo-hint">Test amacıyla oluşturulmuş örnek kayıt.</p>
    </section>
  `,
  styles: `
    .detail {
      padding: 24px;
    }
    .detail-summary {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 24px;
    }
    h3 {
      margin: 0;
      font-size: 20px;
      line-height: 1.4;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .status {
      flex-shrink: 0;
      padding: 6px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: var(--app-accent);
      background: color-mix(in srgb, var(--app-accent) 12%, transparent);
    }
    .status[data-tone='success'] {
      color: var(--color-success);
      background: color-mix(in srgb, var(--color-success) 12%, transparent);
    }
    .status[data-tone='warning'] {
      color: var(--app-text-primary);
      background: color-mix(in srgb, var(--color-warning) 22%, transparent);
    }
    .status[data-tone='error'] {
      color: var(--color-error);
      background: color-mix(in srgb, var(--color-error) 12%, transparent);
    }
    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
      margin: 0;
    }
    dt {
      color: var(--app-text-secondary);
      font-size: 12px;
      margin-bottom: 6px;
    }
    .order-detail .detail-summary {
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 16px;
    }
    .order-detail dl {
      display: flex;
      flex-wrap: wrap;
      gap: 16px 40px;
    }
    .order-detail .detail-field {
      min-width: 140px;
    }
    .order-detail .order-items {
      margin-top: 20px;
    }
    dd {
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    .demo-hint {
      margin: 24px 0 0;
      padding-top: 16px;
      border-top: 1px solid var(--app-border);
      color: var(--app-text-secondary);
      font-size: 12px;
    }
    .order-items {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--app-border);
    }
    h4 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 12px;
      font-size: 15px;
    }
    h4 span {
      color: var(--app-text-secondary);
      font-size: 12px;
      font-weight: 400;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .items-scroll {
      overflow-x: auto;
    }
    .items-scroll:focus-visible {
      outline: 2px solid var(--app-accent);
      outline-offset: 2px;
    }
    .item-columns,
    li {
      display: grid;
      grid-template-columns: 90px minmax(200px, 1fr) 48px 110px 120px;
      align-items: baseline;
      gap: 12px;
      min-width: 616px;
    }
    .item-columns {
      padding: 8px 0;
      color: var(--app-text-secondary);
      font-size: 12px;
      border-bottom: 1px solid var(--app-border);
    }
    .item-columns span:nth-child(n + 3),
    .item-quantity,
    .item-price,
    .item-total {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .item-quantity,
    .item-price,
    .item-code {
      font-size: 13px;
      white-space: nowrap;
    }
    li {
      padding: 14px 0;
      border-bottom: 1px solid var(--app-border);
    }
    .item-description {
      min-width: 0;
    }
    .item-description strong {
      font-size: 14px;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    small {
      display: block;
      margin-top: 6px;
      color: var(--app-text-secondary);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }
    .item-total {
      white-space: nowrap;
      font-size: 14px;
      font-weight: 600;
    }
    .order-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px;
      margin-top: 16px;
      border-radius: 12px;
      background: var(--app-surface);
    }
    .order-total > strong {
      color: var(--app-accent);
      font-size: 20px;
      white-space: nowrap;
    }
    @media (max-width: 480px) {
      .detail {
        padding: 20px 16px;
      }
      .detail-summary {
        flex-direction: column;
      }
      dl {
        grid-template-columns: 1fr;
        gap: 18px;
      }
    }
  `,
})
export class DemoDetailComponent {
  readonly detail = inject<{ componentData: DemoDetailData }>(MAT_DIALOG_DATA)
    .componentData;
  readonly totalQuantity =
    this.detail.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  readonly totalAmount =
    this.detail.items?.reduce((sum, item) => sum + item.total, 0) ?? 0;
  private readonly currency = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  });
  money(value: number): string {
    return this.currency.format(value);
  }
}
