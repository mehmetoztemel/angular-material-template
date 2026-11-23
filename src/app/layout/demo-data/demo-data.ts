import { IColumns } from '../../shared/models/components/columns';

export type DemoRow = Record<string, string | number>;
export interface OrderItem {
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
export interface DemoPage {
  title: string;
  description: string;
  icon: string;
  columns: IColumns<DemoRow>[];
  rows: DemoRow[];
  orderItems?: Record<string, OrderItem[]>;
  metrics: { label: string; value: string | number; icon: string }[];
}

const products: DemoRow[] = Array.from({ length: 36 }, (_, index) => {
  const names = [
    'Kablosuz klavye',
    'USB-C bağlantı merkezi',
    'Ofis koltuğu',
    'Masa lambası',
    'Not defteri',
    'Termos',
  ];
  const stock = index % 9 === 0 ? 0 : (index * 13 + 7) % 120;
  return {
    code: `URN-${String(index + 1).padStart(3, '0')}`,
    name: `${names[index % names.length]} ${['Standart', 'Plus', 'Pro'][Math.floor(index / names.length) % 3]}`,
    category: [
      'Elektronik',
      'Elektronik',
      'Mobilya',
      'Aydınlatma',
      'Kırtasiye',
      'Aksesuar',
    ][index % 6],
    price:
      [1250, 890, 6400, 750, 95, 420][index % 6] + Math.floor(index / 6) * 25,
    stock,
    status: stock === 0 ? 'Tükendi' : stock < 20 ? 'Az stok' : 'Stokta',
  };
});

const orderItems: Record<string, OrderItem[]> = {};
const orders: DemoRow[] = Array.from({ length: 60 }, (_, index) => {
  const code = `SIP-${String(index + 1).padStart(4, '0')}`;
  const items = Array.from(
    { length: index % 3 === 0 ? 3 : index % 3 === 1 ? 1 : 2 },
    (_, itemIndex) => {
      const product = products[(index + itemIndex) % products.length];
      const quantity = ((index + itemIndex) % 5) + 1;
      const unitPrice = Number(product['price']);
      return {
        code: String(product['code']),
        name: String(product['name']),
        quantity,
        unitPrice,
        total: unitPrice * quantity,
      };
    },
  );
  orderItems[code] = items;
  return {
    code,
    customer: `Demo müşteri ${String((index % 18) + 1).padStart(2, '0')}`,
    product: items.map((item) => item.name).join(', '),
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.total, 0),
    date: new Date(
      Date.UTC(2026, 10, 1 + (index % 22), 9 + (index % 8)),
    ).toISOString(),
    status: ['Hazırlanıyor', 'Kargoda', 'Teslim edildi', 'İptal edildi'][
      index % 4
    ],
  };
});

const activity: DemoRow[] = Array.from({ length: 80 }, (_, index) => ({
  code: `LOG-${String(index + 1).padStart(4, '0')}`,
  date: new Date(
    Date.UTC(
      2026,
      10,
      22 - Math.floor(index / 12),
      18 - (index % 12),
      (index * 7) % 60,
    ),
  ).toISOString(),
  user: `Demo kullanıcı ${(index % 8) + 1}`,
  module: ['Ürünler', 'Siparişler', 'Kişiler', 'Hesap'][index % 4],
  action: [
    'Kayıt oluşturuldu',
    'Kayıt güncellendi',
    'Liste görüntülendi',
    'Profil güncellendi',
  ][index % 4],
  status:
    index % 11 === 0 ? 'Başarısız' : index % 7 === 0 ? 'Uyarı' : 'Başarılı',
  duration: 45 + ((index * 37) % 750),
}));

const money = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);

export const DEMO_PAGES: Record<string, DemoPage> = {
  products: {
    title: 'Ürünler',
    icon: 'inventory_2',
    description:
      'Kategorileri, birim fiyatlarını ve stok durumlarını inceleyin.',
    rows: products,
    columns: [
      { field: 'code', header: 'Ürün kodu', type: 'text', filter: 'text' },
      { field: 'name', header: 'Ürün', type: 'text', filter: 'text' },
      {
        field: 'category',
        header: 'Kategori',
        type: 'text',
        filter: 'multiSelect',
      },
      {
        field: 'price',
        header: 'Birim fiyat (₺)',
        type: 'num2',
        filter: 'numericText',
        align: 'right',
      },
      {
        field: 'stock',
        header: 'Stok',
        type: 'num0',
        filter: 'numericText',
        align: 'right',
      },
      { field: 'status', header: 'Durum', type: 'text', filter: 'dropDown' },
    ],
    metrics: [
      { label: 'Ürün çeşidi', value: products.length, icon: 'inventory_2' },
      {
        label: 'Az stok / tükenen',
        value: products.filter((row) => Number(row['stock']) < 20).length,
        icon: 'warning_amber',
      },
      {
        label: 'Stok değeri',
        value: money(
          products.reduce(
            (sum, row) => sum + Number(row['price']) * Number(row['stock']),
            0,
          ),
        ),
        icon: 'payments',
      },
    ],
  },
  orders: {
    orderItems,
    title: 'Siparişler',
    icon: 'shopping_bag',
    description:
      'Örnek siparişleri tarih, müşteri ve teslimat durumuna göre keşfedin.',
    rows: orders,
    columns: [
      { field: 'code', header: 'Sipariş no', type: 'text', filter: 'text' },
      { field: 'customer', header: 'Müşteri', type: 'text', filter: 'text' },
      { field: 'product', header: 'Ürün', type: 'text', filter: 'text' },
      { field: 'quantity', header: 'Adet', type: 'num0', align: 'right' },
      {
        field: 'total',
        header: 'Tutar (₺)',
        type: 'num2',
        filter: 'numericText',
        align: 'right',
      },
      { field: 'date', header: 'Tarih', type: 'date', filter: 'date' },
      { field: 'status', header: 'Durum', type: 'text', filter: 'multiSelect' },
    ],
    metrics: [
      { label: 'Toplam sipariş', value: orders.length, icon: 'shopping_bag' },
      {
        label: 'Teslim edilen',
        value: orders.filter((row) => row['status'] === 'Teslim edildi').length,
        icon: 'local_shipping',
      },
      {
        label: 'İptaller hariç tutar',
        value: money(
          orders
            .filter((row) => row['status'] !== 'İptal edildi')
            .reduce((sum, row) => sum + Number(row['total']), 0),
        ),
        icon: 'payments',
      },
    ],
  },
  activity: {
    title: 'İşlem kayıtları',
    icon: 'history',
    description:
      'Kullanıcı işlemlerini, sonuçlarını ve yanıt sürelerini inceleyin.',
    rows: activity,
    columns: [
      { field: 'code', header: 'Kayıt no', type: 'text', filter: 'text' },
      { field: 'date', header: 'Zaman', type: 'datetime', filter: 'date' },
      { field: 'user', header: 'Kullanıcı', type: 'text', filter: 'dropDown' },
      { field: 'module', header: 'Modül', type: 'text', filter: 'multiSelect' },
      { field: 'action', header: 'İşlem', type: 'text', filter: 'text' },
      { field: 'status', header: 'Sonuç', type: 'text', filter: 'dropDown' },
      { field: 'duration', header: 'Süre (ms)', type: 'num0', align: 'right' },
    ],
    metrics: [
      { label: 'Toplam işlem', value: activity.length, icon: 'history' },
      {
        label: 'Başarılı işlem',
        value: activity.filter((row) => row['status'] === 'Başarılı').length,
        icon: 'check_circle',
      },
      {
        label: 'İncelenecek kayıt',
        value: activity.filter((row) => row['status'] !== 'Başarılı').length,
        icon: 'report_problem',
      },
    ],
  },
};
