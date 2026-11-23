import { MatPaginatorIntl } from '@angular/material/paginator';

export function turkishPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Sayfa başına kayıt:';
  intl.nextPageLabel = 'Sonraki sayfa';
  intl.previousPageLabel = 'Önceki sayfa';
  intl.firstPageLabel = 'İlk sayfa';
  intl.lastPageLabel = 'Son sayfa';
  intl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0) return '0 kayıt';
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} – ${end} / ${length}`;
  };
  return intl;
}
