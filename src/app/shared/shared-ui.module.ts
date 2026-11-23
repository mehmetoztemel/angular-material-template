import { NgModule } from '@angular/core';
import { MoTableComponent } from './components/mo-table/mo-table.component';
import { MoDialogComponent } from './components/mo-dialog/mo-dialog.component';
import { EntryMediaComponent } from './components/entry-media.component';

@NgModule({
  imports: [MoTableComponent, MoDialogComponent, EntryMediaComponent],
  exports: [MoTableComponent, MoDialogComponent, EntryMediaComponent],
})
export class SharedUiModule {}
