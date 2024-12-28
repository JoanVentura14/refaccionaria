import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [
        `
            .rounded-image {
                border-radius: 90%;
                width: 60px;
                height: 120px;
            }
        `,
      ],
})
export class AppTopBarComponent {

    items!: MenuItem[];
    isDarkTheme: boolean = false;
    user = {
        name: 'Juan',
        lastname: 'Pérez',
        email: 'juan.perez@example.com',
        rol: 'Administrador'
      };

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private router: Router) { }

    menuItems: MenuItem[] = [];

    ngOnInit() {
        this.updateMenuItems();
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;

        const themeClass = this.isDarkTheme ? 'md-dark-indigo' : 'lara-light-indigo';
        this.theme = themeClass;

        this.updateMenuItems();
    }

    logOut(){
        //logica del cerrado de sesion como limpiar el usuario y la tienda de datos
        this.router.navigate(['/login']);
    }

    updateMenuItems(): void {
        this.menuItems = [
            {
                label: this.isDarkTheme ? 'Light theme' : 'Dark theme',
                icon: this.isDarkTheme ? 'pi pi-sun' : 'pi pi-moon',
                command: () => this.toggleTheme(),
            },
            // {
            //     label: 'Opcion 2',
            //     icon: 'pi pi-fw pi-refresh',
            // },
            // {
            //     label: 'Opcion 3',
            //     icon: 'pi pi-fw pi-trash',
            // },
            {
                separator: true,
            },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => this.logOut(),
            },
        ];
    }


}
