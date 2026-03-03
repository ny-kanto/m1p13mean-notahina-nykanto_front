import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { EvenementService } from '../../services/evenement';
import { Evenement } from '../../interface/evenement';
import { HeaderCenterComponent } from '../header-center/header-center';
import { Footer } from '../footer/footer';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderCenterComponent,
    Footer,
    PaginationComponent,
  ],
  templateUrl: './event-management.html',
  styleUrls: ['./event-management.css'],
})
export class EventManagementComponent implements OnInit, OnDestroy {
  // ============================================
  // VARIABLES
  // ============================================
  evenements: Evenement[] = [];

  // Pagination
  page = 1;
  limit = 10;
  totalItems = 0;
  totalPages = 0;

  // Filtres
  filters = {
    search: '',
    actif: '',
    sortBy: 'dateDebut',
    order: 'desc',
  };

  // États
  isLoading = false;

  // Modal
  showModal = false;
  isEditMode = false;
  isSaving = false;
  currentEvent: Evenement | null = null;

  // Formulaire
  eventForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  private destroy$ = new Subject<void>();
  console: any;

  constructor(
    private evenementService: EvenementService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadEvenements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================
  // INITIALISATION FORMULAIRE
  // ============================================
  initForm(): void {
    this.eventForm = this.fb.group(
      {
        titre: ['', Validators.required],
        description: [''],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
      },
      {
        validators: this.dateValidator,
      },
    );
  }

  eventToDelete: Evenement | null = null;
  showDeleteConfirm = false;

  openDeleteConfirm(event: Evenement): void {
    this.eventToDelete = event;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.eventToDelete = null;
  }

  confirmDelete(): void {
    if (!this.eventToDelete?._id) return;

    this.evenementService
      .delete(this.eventToDelete._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.closeDeleteConfirm();
          this.loadEvenements();
        },
        error: () => alert('Erreur suppression'),
      });
  }

  // Validateur personnalisé pour les dates
  dateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const debut = group.get('dateDebut')?.value;
    const fin = group.get('dateFin')?.value;

    if (debut && fin && new Date(fin) < new Date(debut)) {
      return { dateError: true };
    }
    return null;
  }

  // ============================================
  // CHARGEMENT ÉVÉNEMENTS
  // ============================================
  loadEvenements(): void {
    this.isLoading = true;

    this.evenementService
      .getAll(this.page, this.limit, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.evenements = response.data || [];
          this.totalItems = response.pagination?.total || 0;
          this.totalPages = response.pagination?.totalPages || 1;
          this.page = response.pagination?.page || 1;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erreur chargement événements:', error);
          this.isLoading = false;
          alert('Erreur lors du chargement des événements');
        },
      });
  }

  // ============================================
  // FILTRES & PAGINATION
  // ============================================
  applyFilters(): void {
    this.page = 1;
    this.loadEvenements();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadEvenements();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSortOrder(): void {
    this.filters.order = this.filters.order === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  // ============================================
  // MODAL
  // ============================================
  openAddModal(): void {
    this.isEditMode = false;
    this.currentEvent = null;
    this.eventForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(event: Evenement): void {
    this.isEditMode = true;
    this.currentEvent = event;

    // Pré-remplir le formulaire
    this.eventForm.patchValue({
      titre: event.titre,
      description: event.description || '',
      dateDebut: this.formatDateForInput(event.dateDebut),
      dateFin: this.formatDateForInput(event.dateFin),
    });

    this.selectedFile = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.eventForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.currentEvent = null;
  }

  // ============================================
  // GESTION IMAGE
  // ============================================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Créer preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // ============================================
  // SOUMISSION FORMULAIRE
  // ============================================
  submitForm(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Créer FormData
    const formData = new FormData();
    formData.append('titre', this.eventForm.value.titre);
    formData.append('description', this.eventForm.value.description || '');
    formData.append('dateDebut', this.eventForm.value.dateDebut);
    formData.append('dateFin', this.eventForm.value.dateFin);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Appel API
    const request =
      this.isEditMode && this.currentEvent?._id
        ? this.evenementService.update(this.currentEvent._id, formData)
        : this.evenementService.create(formData);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isSaving = false;
        alert(response.message || 'Événement enregistré avec succès');
        this.closeModal();
        this.loadEvenements();
      },
      error: (error) => {
        this.isSaving = false;
        alert(error.message || "Erreur lors de l'enregistrement");
      },
    });
  }
  // ============================================
  // HELPERS
  // ============================================

  // Vérifier si événement est actif
  isEventActive(event: Evenement): boolean {
    const now = new Date();
    const debut = new Date(event.dateDebut);
    const fin = new Date(event.dateFin);
    return now >= debut && now <= fin;
  }

  // Classe CSS du statut
  getStatusClass(event: Evenement): string {
    const now = new Date();
    const debut = new Date(event.dateDebut);
    const fin = new Date(event.dateFin);

    if (now >= debut && now <= fin) return 'status-active';
    if (now < debut) return 'status-upcoming';
    return 'status-ended';
  }

  // Label du statut
  getStatusLabel(event: Evenement): string {
    const now = new Date();
    const debut = new Date(event.dateDebut);
    const fin = new Date(event.dateFin);

    if (now >= debut && now <= fin) return 'En cours';
    if (now < debut) return 'À venir';
    return 'Terminé';
  }

  // Icône du statut
  getStatusIcon(event: Evenement): string {
    const now = new Date();
    const debut = new Date(event.dateDebut);
    const fin = new Date(event.dateFin);

    if (now >= debut && now <= fin) return 'fa-play-circle';
    if (now < debut) return 'fa-clock';
    return 'fa-check-circle';
  }

  // Formater date pour input date HTML
  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
