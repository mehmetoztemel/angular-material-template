import { ProfileService, UserProfile } from './profile.service';

describe('ProfileService', () => {
  const data: UserProfile = {
    firstName: ' Deniz ',
    lastName: ' Kaya ',
    email: 'deniz@example.com',
    phone: '',
    department: '',
    title: '',
  };
  let previous: string | null;
  beforeEach(() => {
    previous = sessionStorage.getItem('workspace.profile');
    sessionStorage.removeItem('workspace.profile');
  });
  afterEach(() => {
    if (previous === null) sessionStorage.removeItem('workspace.profile');
    else sessionStorage.setItem('workspace.profile', previous);
  });
  it('restores saved data and normalizes the account name', () => {
    const service = new ProfileService();
    service.save(data);
    expect(service.displayName()).toBe('Deniz Kaya');
    expect(new ProfileService().profile().firstName).toBe('Deniz');
  });
  it('does not reuse another login’s profile', () => {
    const service = new ProfileService();
    service.save(data);
    service.startSession('other@example.com');
    expect(service.profile().firstName).toBe('');
    expect(service.profile().email).toBe('other@example.com');
    expect(sessionStorage.getItem('workspace.profile')).toBeNull();
  });
  it('recovers from invalid stored data', () => {
    sessionStorage.setItem('workspace.profile', '{invalid');
    expect(new ProfileService().displayName()).toBe('Hesabım');
  });
  it('does not report an unsaved change as saved when storage fails', () => {
    const service = new ProfileService();
    spyOn(sessionStorage, 'setItem').and.throwError('Storage unavailable');
    expect(() => service.save(data)).toThrow();
    expect(service.profile().firstName).toBe('');
  });
});
