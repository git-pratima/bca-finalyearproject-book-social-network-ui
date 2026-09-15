import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ThemeService } from '../../../../services/theme/theme.service';
import {ApiConfiguration} from '../../../../services/api-configuration';

interface Address {
  id: number | null;
  addressLine1: string | null;
  addressLine2: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pin: string | null;
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  memberSince?: string;
  numberOfBooksShared?: number;
  numberOfBooksBorrowed?: number;
  address: Address;
}

interface ProfileResponse { data: UserProfile; }

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    @ViewChild('userDropdown') userDropdown?: ElementRef<HTMLElement>;
    userName = '';
    userEmail = '';
    isMenuOpen = false;
    isUserMenuOpen = false;
    activeDialog: 'overview' | 'edit' | 'password' | null = null;
    isLoadingProfile = false;
    isSaving = false;
    profileError = '';
    profileSuccess = '';
    profile: UserProfile | null = null;
    editProfile: UserProfile = this.emptyProfile();
    selectedImage: File | null = null;
    imagePreview = '';
    password = {oldPassword: '', newPassword: '', confirmPassword: ''};
    passwordError = '';
    passwordSuccess = '';
    private closeTimer?: ReturnType<typeof setTimeout>;

    constructor(private http: HttpClient, private apiConfig: ApiConfiguration, public themeService: ThemeService) {}

    ngOnInit(): void {
      this.userName = localStorage.getItem('userName') || '';
      this.userEmail = localStorage.getItem('userEmail') || '';
    }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeDialog(); this.isUserMenuOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (this.isUserMenuOpen && target instanceof Node && !this.userDropdown?.nativeElement.contains(target)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleUserMenu(): void { this.isUserMenuOpen = !this.isUserMenuOpen; }

  openProfileOverview(): void {
    this.activeDialog = 'overview';
    this.isUserMenuOpen = false;
    this.loadProfile();
  }

  openUpdateProfile(): void {
    this.activeDialog = 'edit';
    this.isUserMenuOpen = false;
    this.profileError = '';
    this.profileSuccess = '';
    this.loadProfile();
  }

  openPasswordChange(): void {
    this.activeDialog = 'password';
    this.isUserMenuOpen = false;
    this.password = {oldPassword: '', newPassword: '', confirmPassword: ''};
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  closeDialog(): void {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = undefined; }
    this.activeDialog = null;
    this.profileError = '';
    this.profileSuccess = '';
    this.passwordError = '';
  }

  onImageSelected(event: Event): void {
    const image = (event.target as HTMLInputElement).files?.[0] || null;
    this.selectedImage = image;
    if (image) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = String(reader.result || '');
      reader.readAsDataURL(image);
    }
  }

  saveProfile(): void {
    if (this.isSaving) { return; }
    this.isSaving = true;
    this.profileError = '';
    this.profileSuccess = '';
    const form = new FormData();
    form.append('userProfile', new Blob([JSON.stringify(this.editProfile)], {type: 'application/json'}));
    if (this.selectedImage) { form.append('imageFile', this.selectedImage); }
    this.http.post<unknown>(`${this.apiConfig.rootUrl}/profile/create-update`, form).subscribe({
      next: () => {
        this.isSaving = false;
        this.profile = this.copyProfile(this.editProfile);
        this.userName = `${this.profile.firstName} ${this.profile.lastName}`.trim();
        this.userEmail = this.profile.email;
        localStorage.setItem('userName', this.userName);
        localStorage.setItem('userEmail', this.userEmail);
        this.profileSuccess = 'Profile updated successfully.';
        this.closeTimer = setTimeout(() => this.closeDialog(), 2000);
      },
      error: () => { this.isSaving = false; this.profileError = 'Unable to update your profile. Please try again.'; }
    });
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';
    if (this.password.newPassword !== this.password.confirmPassword) {
      this.passwordError = 'New password and confirmation must match.';
      return;
    }
    this.isSaving = true;
    this.http.post<unknown>(`${this.apiConfig.rootUrl}/profile/change-password`, {
      oldPassword: this.password.oldPassword,
      newPassword: this.password.newPassword
    }).subscribe({
      next: () => { this.isSaving = false; this.passwordSuccess = 'Your password has been changed successfully.'; this.password = {oldPassword: '', newPassword: '', confirmPassword: ''}; },
      error: () => { this.isSaving = false; this.passwordError = 'Unable to change the password. Check your current password and try again.'; }
    });
  }

  get initials(): string {
    const name = `${this.profile?.firstName || this.userName} ${this.profile?.lastName || ''}`.trim();
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
  }

  private loadProfile(): void {
    const id = localStorage.getItem('userId');
    if (!id) { this.profileError = 'Your user ID is unavailable. Please sign in again.'; return; }
    this.isLoadingProfile = true;
    this.profileError = '';
    this.http.get<ProfileResponse>(`${this.apiConfig.rootUrl}/profile/${id}`).subscribe({
      next: response => { this.isLoadingProfile = false; this.profile = response.data; this.editProfile = this.copyProfile(response.data); },
      error: () => { this.isLoadingProfile = false; this.profileError = 'Unable to load your profile. Please try again.'; }
    });
  }

  private emptyProfile(): UserProfile { return {id: 0, firstName: '', lastName: '', email: '', address: {id: null, addressLine1: null, addressLine2: null, landmark: null, city: null, state: null, country: null, pin: null}}; }
  private copyProfile(profile: UserProfile): UserProfile { return {...profile, address: {...profile.address}}; }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.reload();
  }
}
