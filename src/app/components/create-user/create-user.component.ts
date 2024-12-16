import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import * as L from 'leaflet';
import axios from 'axios';

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        AvatarModule,
    ],
    providers: [LayoutService, MessageService],
    templateUrl: './create-user.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            .rounded-image {
                border-radius: 90%;
                width: 130px;
                height: 130px;
                object-fit: cover;
                //border: 1px solid black; /* Contorno negro, tamaño pequeño */
            }
            #map {
                border: 2px solid #ccc;
                border-radius: 8px;
                cursor: crosshair;
            }
            .info-section {
                text-align: center;
                margin-top: 15px;
            }
            .print-btn {
                margin-top: 10px;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .print-btn:hover {
                background-color: #0056b3;
            }
            .leaflet-control-locate a {
                background-color: #007ad9;
                border-radius: 50%;
                color: white;
            }
        `,
    ],
})
export class CreateUserComponent implements OnInit {
    valCheck: string[] = ['remember'];
    password!: string;
    msgs: Message[] = [];
    map!: L.Map;
    selectedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
    selectedAddress: string | null = null;
    marker!: L.Marker;

    formData = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        role_id: 1, //dejar el id del rol en usuario normal
        houseNumber: '',
        houseDescription: '',
    };

    constructor(
        public layoutService: LayoutService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {
        this.initializeMap();
        this.locateUser();
    }

    createCustomIcon(): L.Icon {
        return L.icon({
            iconUrl: 'assets/location-pin.png',
            iconSize: [30, 40],
            iconAnchor: [15, 40],
        });
    }

    initializeMap(): void {
        this.map = L.map('map').setView([20.3398, -102.037], 13);

        //OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        this.map.on('click', async (event: L.LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            if (this.marker) {
                this.marker.setLatLng([lat, lng]); // Reposicionar marcador
            } else {
                this.marker = L.marker([lat, lng], {
                    icon: this.createCustomIcon(),
                }).addTo(this.map);
            }

            this.selectedLocation = {
                lat: event.latlng.lat,
                lng: event.latlng.lng,
            };
            await this.getAddressFromCoordinates(
                event.latlng.lat,
                event.latlng.lng
            );
        });
    }

    //ubicar al usuario via gps
    locateUser(): void {
        if (!this.map) return;

        // Usar la API de geolocalización del navegador con opciones de alta precisión
        this.map.locate({
          setView: true,
          maxZoom: 16,
          enableHighAccuracy: true, // Habilitar alta precisión
          timeout: 10000, // Tiempo de espera antes de cancelar
          maximumAge: 0 // Evitar usar una ubicación en caché
        });

        this.map.on('locationfound', (e: L.LocationEvent) => {
          if (e.latlng) {
            const userCoords: L.LatLngTuple = [e.latlng.lat, e.latlng.lng];

            // Guardar las coordenadas de latitud y longitud
            this.selectedLocation.lat = e.latlng.lat;
            this.selectedLocation.lng = e.latlng.lng;

            // Crear un icono personalizado
            const customIcon = L.icon({
              iconUrl: 'assets/location-pin.png', // Cambia el path por el de tu icono
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });

            // Agregar el marcador con el icono
            if (this.marker) {
              this.marker.setLatLng(userCoords);
            } else {
              this.marker = L.marker(userCoords, { icon: customIcon })
                .addTo(this.map)
                .bindPopup('¿Estás aquí? Si no presiona en la dirección deseada');
            }

            this.marker.openPopup();

            this.getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
          }
        });

        this.map.on('locationerror', () => {
          alert('No se pudo acceder a tu ubicación. Asegúrate de habilitar el GPS y verificar tu conexión.');
        });
      }

    //nominatim
    async getAddressFromCoordinates(lat: number, lng: number): Promise<void> {
        const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

        try {
            const response = await axios.get(NOMINATIM_API, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                    addressdetails: 1, // Activa los detalles de la dirección
                },
            });

            if (response.data) {
                const address = response.data.address || {};
                const houseNumber = address.house_number
                    ? `#${address.house_number}`
                    : 'No disponible';
                const displayName =
                    response.data.display_name || 'Dirección no encontrada';

                // Combinar dirección y número de casa
                this.selectedAddress = `${displayName} (Número: ${houseNumber})`;
            } else {
                this.selectedAddress = 'No se encontró una dirección.';
            }
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
            this.selectedAddress = 'Error al obtener la dirección.';
        }
    }

    printLocation(): void {
        if (this.selectedLocation) {
            console.log('Datos del lugar seleccionado:', {
                lat: this.selectedLocation.lat,
                lng: this.selectedLocation.lng,
                address: this.selectedAddress,
            });
        }
    }

    registerUser() {
        const userData = {
            name: this.formData.name,
            lastname: this.formData.lastname,
            email: this.formData.email,
            password: this.formData.password,
            role_id: this.formData.role_id,
            houseNumber: this.formData.houseNumber,
            address: this.selectedAddress,
            lng: this.selectedLocation.lng,
            lat: this.selectedLocation.lat,
            description: this.formData.houseDescription,
        };
        console.log('Datos del usuario:', userData);
        // this.http.post('URL_API', userData).subscribe(...); borrar el console log y poner la logica del api
        this.MessageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Mensaje de éxito',
            detail: 'Usuario creado',
        });
        this.MessageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Mensaje de advertencia',
            detail: 'Revise sus datos',
        });
        this.MessageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Mensaje de error',
            detail: 'Algo falló',
        });
    }
}

declare module 'leaflet' {
    namespace control {
        function locate(options?: any): any;
    }
}
