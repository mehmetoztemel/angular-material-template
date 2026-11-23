import { computed, Injectable, signal } from '@angular/core';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
}
const STORAGE_KEY = 'workspace.profile';
const emptyProfile = (): UserProfile => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  title: '',
});

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly profile = signal<UserProfile>(this.read());
  readonly displayName = computed(
    () =>
      `${this.profile().firstName} ${this.profile().lastName}`.trim() ||
      'Hesabım',
  );
  readonly initials = computed(() =>
    (
      this.profile().firstName.charAt(0) + this.profile().lastName.charAt(0)
    ).toLocaleUpperCase('tr'),
  );
  save(profile: UserProfile): void {
    const normalized = Object.fromEntries(
      Object.entries(profile).map(([key, value]) => [key, value.trim()]),
    ) as unknown as UserProfile;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    this.profile.set(normalized);
  }
  startSession(username: string): void {
    this.clear();
    this.profile.set({
      ...emptyProfile(),
      email: username.includes('@') ? username.trim() : '',
    });
  }
  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.profile.set(emptyProfile());
  }
  private read(): UserProfile {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
      const profile = emptyProfile();
      for (const key of Object.keys(profile) as (keyof UserProfile)[]) {
        if (typeof stored?.[key] === 'string') profile[key] = stored[key];
      }
      return profile;
    } catch {
      return emptyProfile();
    }
  }
}
