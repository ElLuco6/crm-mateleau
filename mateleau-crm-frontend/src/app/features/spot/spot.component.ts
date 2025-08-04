import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Spot } from '../../models/Spot';
import { SpotService } from '../../core/service/spot.service';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-spot',
  imports: [CommonModule, FormsModule],
  templateUrl: './spot.component.html',
  styleUrl: './spot.component.scss',
  standalone: true
})
export class SpotComponent implements AfterViewInit  {
map!: L.Map ;
  newSpot: Spot = { name: '', latitude: 0, longitude: 0 };
  Spots: Spot[] = [];
editIndex: number | null = null;
  @ViewChild('mapContainer', { static: false }) mapContainerRef!: ElementRef;

  constructor(private SpotService: SpotService) {}

   ngAfterViewInit(): void {
    // On vérifie que la div est bien présente
    if (this.mapContainerRef?.nativeElement) {
      this.initMap();
      this.loadSpots();
    } else {
      console.error("❌ La div #map n'est pas encore disponible dans le DOM");
    }
  }

  initMap(): void {
    this.map = L.map(this.mapContainerRef.nativeElement).setView([43.6, 1.44], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.newSpot.latitude = lat;
      this.newSpot.longitude = lng;

      L.marker([lat, lng]).addTo(this.map);
    });
  }

  createSpot(): void {
    if (!this.newSpot.name) return;

    this.SpotService.create(this.newSpot).subscribe((loc) => {
      this.Spots.push(loc);
      this.newSpot = { name: '', latitude: 0, longitude: 0 };
    });
  }

  loadSpots(): void {
    this.SpotService.getAll().subscribe((locs) => {
      this.Spots = locs;
      locs.forEach((loc) =>
        L.marker([loc.latitude, loc.longitude])
          .addTo(this.map!)
          .bindPopup(loc.name)
      );
    });
  }
  startEditing(i: number) {
  this.editIndex = i;
  this.newSpot = { ...this.Spots[i] };
}

updateSpot(): void {
  if (this.editIndex === null || !this.newSpot._id) return;

  this.SpotService
    .update(this.newSpot._id, this.newSpot)
    .subscribe((updated) => {
      this.Spots[this.editIndex!] = updated;
      this.editIndex = null;
      this.newSpot = { name: '', latitude: 0, longitude: 0 };
    });
}

deleteSpot(id: string, index: number): void {
  this.SpotService.delete(id).subscribe(() => {
    this.Spots.splice(index, 1);
    if (this.map) {
      this.map.eachLayer((layer) => {
        if ((layer as any)._latlng) layer.remove();
      });
      this.loadSpots(); // recharge les markers
    }
  });
}
}
