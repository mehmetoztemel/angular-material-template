import { Component, OnDestroy, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { MoDialogComponent } from './mo-dialog.component';

let destroyed = 0;
@Component({
  selector: 'test-entry',
  template: '<p>{{ data.componentData.title }}</p>',
})
class TestEntryComponent implements OnDestroy {
  readonly data = inject(MAT_DIALOG_DATA);
  ngOnDestroy(): void {
    destroyed++;
  }
}

describe('MoDialogComponent', () => {
  let fixture: ComponentFixture<MoDialogComponent>;
  let close: jasmine.Spy;
  let data: Record<string, unknown>;
  beforeEach(async () => {
    destroyed = 0;
    close = jasmine.createSpy('close');
    data = {
      header: 'Haber ekle',
      description: 'İçeriği hazırlayın.',
      component: TestEntryComponent,
      componentData: { title: 'Dinamik form' },
    };
    await TestBed.configureTestingModule({
      imports: [MoDialogComponent, TestEntryComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MoDialogComponent);
  });
  afterEach(() => fixture.destroy());

  it('mounts the dynamic form once and keeps an accessible close control', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('test-entry').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Dinamik form');
    fixture.nativeElement
      .querySelector('[aria-label="Pencereyi kapat"]')
      .click();
    expect(close).toHaveBeenCalledOnceWith(false);
    fixture.destroy();
    expect(destroyed).toBe(1);
  });

  it('preserves confirmation results without loading a form', () => {
    delete data['component'];
    data['label'] = 'Devam edilsin mi?';
    data['button1'] = 'Evet';
    data['button2'] = 'Hayır';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('test-entry')).toBeNull();
    fixture.componentInstance.onSave();
    expect(close).toHaveBeenCalledOnceWith(true);
  });
});
