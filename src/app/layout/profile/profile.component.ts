import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProfileComponent {
  readonly account = inject(ProfileService);
  private readonly fb = inject(FormBuilder);
  readonly feedback = signal('');
  readonly failed = signal(false);
  readonly form = this.fb.nonNullable.group({
    firstName: [
      this.account.profile().firstName,
      [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)],
    ],
    lastName: [
      this.account.profile().lastName,
      [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)],
    ],
    email: [
      this.account.profile().email,
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
    phone: [
      this.account.profile().phone,
      [Validators.pattern(/^[+\d\s().-]{7,25}$/)],
    ],
    department: [this.account.profile().department, Validators.maxLength(100)],
    title: [this.account.profile().title, Validators.maxLength(100)],
  });
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    try {
      this.account.save(this.form.getRawValue());
      this.form.reset(this.account.profile());
      this.failed.set(false);
      this.feedback.set('Profil bilgileriniz bu oturum için kaydedildi.');
    } catch {
      this.failed.set(true);
      this.feedback.set(
        'Bilgiler kaydedilemedi. Tarayıcı depolama izinlerini kontrol edip tekrar deneyin.',
      );
    }
  }
  reset(): void {
    this.form.reset(this.account.profile());
    this.feedback.set('Değişiklikler geri alındı.');
    this.failed.set(false);
  }
}
