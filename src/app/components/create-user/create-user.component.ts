import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import * as L from 'leaflet';
import axios from 'axios';
import { AuthService } from 'src/app/services/auth.service';
import { Inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

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

    authService = inject(AuthService);
    registerForm = new FormGroup({
        email: new FormControl('',[Validators.required, Validators.email]),
        password: new FormControl('',[Validators.required])
    });


    onSubmit(){
        console.log(this.registerForm.value);
        
    }
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
        private MessageService: MessageService,
        @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
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

    


    

    async registerUser() {
        const userData = {
            email: this.formData.email,
            password: this.formData.password,
            name: this.formData.name,
            lastname: this.formData.lastname,
            role_id: this.formData.role_id,
            houseNumber: this.formData.houseNumber,
            address: this.selectedAddress,
            lng: this.selectedLocation.lng,
            lat: this.selectedLocation.lat,
            description: this.formData.houseDescription,
        };
    
        try {
            // 1. Registro del usuario en Supabase Auth
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
            });
                
            if (authError) {
                console.error('Error al registrar usuario:', authError.message);
                this.MessageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: authError.message,
                });
                return;
            }
    
            const authId = authData.user?.id; // Obtenemos el auth_id generado
    
            if (!authId) {
                console.error('No se pudo obtener el ID del usuario registrado.');
                this.MessageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener el ID del usuario registrado.',
                });
                return;
            }
    
            // 2. Guardar información adicional en la tabla "users"
            const { error: insertError } = await this.supabase.from('users').insert([
                {
                    auth_id: authId, // Incluimos el auth_id
                    email: userData.email,
                    name: userData.name,
                    lastname: userData.lastname,
                    role_id: userData.role_id,
                    house_number: userData.houseNumber,
                    address: userData.address,
                    lng: userData.lng,
                    lat: userData.lat,
                    description: userData.description,
                },
            ]);
    
            if (insertError) {
                console.error('Error al guardar datos adicionales:', insertError.message);
                this.MessageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: insertError.message,
                });
                return;
            }
    
            // 3. Mostrar mensaje de éxito
            this.MessageService.add({
                key: 'tst',
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario registrado correctamente',
            });
    
            // 4. Reiniciar el formulario
            this.formData = {
                name: '',
                lastname: '',
                email: '',
                password: '',
                role_id: 1,
                houseNumber: '',
                houseDescription: '',
            };
            this.selectedAddress = null;
            this.selectedLocation = { lat: 0, lng: 0 };
        } catch (err) {
            console.error('Error inesperado:', err);
            this.MessageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error inesperado',
                detail: 'Ocurrió un problema al registrar el usuario.',
            });
        }
    }
    
    
}

declare module 'leaflet' {
    namespace control {
        function locate(options?: any): any;
    }
}
