import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Spot } from '../../models/Spot';
import { SpotService } from '../../core/service/spot.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/service/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-spot',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './spot.component.html',
  styleUrl: './spot.component.scss',
  standalone: true,
})
export class SpotComponent implements AfterViewInit, OnInit {
  map!: L.Map;
  cleanIcon = L.icon({
    iconUrl: 'assets/pointeur.png', // à remplacer avec ton propre marker
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
    className: 'no-marker-border',
  });

  newSpot: Spot = { name: '', coordinates: { lat: 0, lng: 0 } };
  editingSpot: Spot | null = null;

  Spots: Spot[] = [];
  editIndex: number | null = null;
  private tempMarker: L.Marker | null = null;
  private allMarkers: L.Marker[] = [];

  @ViewChild('mapContainer', { static: false }) mapContainerRef!: ElementRef;

  constructor(
    private SpotService: SpotService,
    private notificationService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    // On vérifie que la div est bien présente
  }

  initMapSafely(): void {
    console.log('Initializing map...');

    this.initMap();
    this.loadSpots();
  }
  ngOnInit(): void {
    window.addEventListener('edit-spot', (event: any) => {
      const index = event.detail;
      this.startEditing(index);
    });
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [46.5, 2.2],
      zoom: 3,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.newSpot.coordinates.lat = lat;
      this.newSpot.coordinates.lng = lng;

      if (this.tempMarker) {
        this.map.removeLayer(this.tempMarker);
      }

      this.tempMarker = L.marker([lat, lng], { icon: this.cleanIcon }).addTo(
        this.map
      );
    });
  }
cancelEdit() {
  this.editIndex = null;
  this.editingSpot = null;
  this.notificationService.show('Modification annulée', 'info');
}


  createSpot(): void {
    if (!this.newSpot.name.trim()) return;

    this.SpotService.create(this.newSpot).subscribe((loc) => {
      this.Spots.push(loc);
      this.notificationService.show('Spot ajouté avec succès', 'success');
      this.newSpot = { name: '', coordinates: { lat: 0, lng: 0 } };

      if (this.tempMarker) {
        this.map.removeLayer(this.tempMarker);
        this.tempMarker = null;
      }

      // ✅ Ajouter le nouveau marker sur la map directement
      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng]).addTo(
        this.map
      );
      marker.bindPopup(`<strong>${loc.name}</strong>`);
    });
  }

  loadSpots(): void {
    this.allMarkers.forEach((marker) => this.map.removeLayer(marker));
    this.allMarkers = [];

    this.SpotService.getAll().subscribe((locs) => {
      this.Spots = locs;
      locs.forEach((loc, index) => {
        const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
          icon: this.cleanIcon,
        }).addTo(this.map);
        marker.bindPopup(`
        <strong>${loc.name}</strong><br/>
        <button onclick="window.dispatchEvent(new CustomEvent('edit-spot', { detail: ${index} }))">
          ✏️ Modifier
        </button>
      `);
        this.allMarkers.push(marker);
      });
    });
  }

  startEditing(i: number) {
    this.editIndex = i;
    this.editingSpot = { ...this.Spots[i] };
  }

  updateSpot(): void {
    if (this.editingSpot?._id) {
      this.SpotService.update(this.editingSpot._id, this.editingSpot).subscribe(
        (updated) => {
          this.Spots[this.editIndex!] = updated;
          this.editIndex = null;
          this.editingSpot = null;
          this.notificationService.show('Spot modifié avec succès', 'success');

          this.loadSpots(); // rechargement propre
        }
      );
    }
  }

  deleteSpot(id: string, index: number): void {
    this.SpotService.delete(id).subscribe(() => {
      this.Spots.splice(index, 1);
      if (this.map) {
        this.map.eachLayer((layer) => {
          if ((layer as any)._latlng) layer.remove();
        });
        this.notificationService.show('Spot supprimé avec succès', 'success');
        this.loadSpots(); // recharge les markers
      }
    });
  }
}
