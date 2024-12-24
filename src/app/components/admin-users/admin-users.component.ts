import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';

import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        MessagesModule,
        MessageModule,
    ],
    providers: [MessageService],
    templateUrl: './admin-users.component.html',
    styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
    cards = {
        one: null,
        two: null,
        three: null,
        four: null,
    };

    productDialog: boolean = false; //edit producto dialog

    newProductDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: any[] = [];

    product: any = {};

    selectedProducts: any[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    roles: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    isSaveDisabled: boolean = true;


    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
        private MessageService: MessageService
    ) {}

    async ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);

        await this.obtenerUsuarios();

        await this.obtenerRoles();

        await this.obtenerInfoCards();

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];
    }

    async obtenerUsuarios() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select(
                    `
              id,
              name,
              email,
              lastname,
              created_at,
              updated_at,
              roles (name)
            `
                )
                .eq('active', true);

            if (error) {
                console.error('Error al obtener datos:', error);
            }

            this.products = data || [];
            //   console.log('Usuarios:', this.products); //imprime en consola los usuarios
        } catch (err) {
            console.error('Error inesperado:', err);
        }
    }

    async obtenerRoles() {
        try {
            const { data, error } = await this.supabase
                .from('roles')
                .select('id, name');

            if (error) {
                console.error('Error al consultar roles:', error.message);
                return;
            }

            this.roles = (data || []).map((role: any) => ({
                value: role.id,
                label: role.name,
            }));

            // console.log('Roles:', this.roles); // Imprime los roles en formato { value, label }
        } catch (err) {
            console.error('Error inesperado al consultar roles:', err);
        }
    }

    async obtenerInfoCards() {
        try {
            const { count, error } = await this.supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('active', true);

            if (error) {
                console.error(
                    'Error al obtener la cantidad de usuarios activos:',
                    error
                );
            } else {
                //   console.log('Cantidad de usuarios activos:', count);
                this.cards.one = count;
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }

        try {
            const { count, error } = await this.supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('active', false);

            if (error) {
                console.error(
                    'Error al obtener la cantidad de usuarios eliminados:',
                    error
                );
            } else {
                const deletedUsersCount = count || 0;
                //   console.log('Cantidad de usuarios eliminados:', deletedUsersCount);
                this.cards.two = deletedUsersCount;
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }

        try {
            const { count, error } = await this.supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role_id', 2)
                .eq('active', true);

            if (error) {
                console.error(
                    'Error al obtener la cantidad de administradores:',
                    error
                );
            } else {
                const adminUsersCount = count || 0;
                //   console.log('Cantidad de usuarios administradores:', adminUsersCount);
                this.cards.three = adminUsersCount;
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('name')
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) {
                console.error(
                    'Error al obtener el último usuario creado:',
                    error
                );
            } else if (data && data.length > 0) {
                const lastUserName = data[0].name;
                this.cards.four = lastUserName;
                //   console.log('Nombre del último usuario creado:', lastUserName);
            } else {
                console.log('No se encontraron usuarios.');
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }
    }

    openEdit() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.newProductDialog = true;
    }

    async createNewUser(product: any) {
        this.product = { ...product };
        console.log(product);

        try {
            const { data: authData, error: authError } =
                await this.supabase.auth.signUp({
                    email: product.email,
                    password: product.password,
                });
            if (authError) {
                console.error('Error al registrar usuario:', authError.message);
            }

            const authId = authData.user?.id;

            if (!authId) {
                console.error(
                    'No se pudo obtener el ID del usuario registrado.'
                );
            }

            const { error: insertError } = await this.supabase
                .from('users')
                .insert([
                    {
                        auth_id: authId,
                        email: product.email,
                        name: product.name,
                        lastname: product.lastname,
                        role_id: product.rol,
                    },
                ]);
            if (insertError) {
                console.error(
                    'Error al guardar datos adicionales:',
                    insertError.message
                );
            }

            this.MessageService.add({
                key: 'tst',
                severity: 'success',
                summary: 'Éxito',
                detail: 'Revise su correo y confirme el mensaje para terminar el proceso de creación de usuario',
                life: 5000,
            });

            this.product = {
                name: '',
                lastname: '',
                email: '',
                password: '',
                rol: '',
            };

        } catch (err) {
            console.error('Error inesperado:', err);
            this.MessageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error inesperado',
                detail: 'Ocurrió un problema al registrar el usuario.',
            });
        }

        this.newProductDialog = false;
        this.obtenerInfoCards();
    }

    validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.isSaveDisabled = !(
            this.product.name &&
            this.product.lastname &&
            this.product.rol &&
            this.product.email &&
            emailRegex.test(this.product.email) &&
            this.product.password
        );
    }

    deleteProduct(product: any) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    async confirmDelete(id: number) {
        try {
          const { data, error } = await this.supabase
            .from('users')
            .update({ active: false })
            .eq('id', id);

          if (error) {
            console.error('Error al actualizar el estado del usuario:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar al usuario.',
              life: 3000,
            });
            return;
          }

          this.products = this.products.filter((val) => val.id !== id);
          console.log('Usuario desactivado con éxito:', data);

          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: 'Usuario eliminado',
            life: 3000,
          });

          this.product = {};
          this.deleteProductDialog = false;
        } catch (err) {
          console.error('Error inesperado:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error inesperado',
            detail: 'Ocurrió un problema al eliminar al usuario.',
            life: 3000,
          });
        }

        this.obtenerInfoCards();
      }

      hideDialog() {
        this.productDialog = false;
        this.newProductDialog = false;
        this.submitted = false;
    }

    editProduct(product: any) {
        this.product = { ...product };
        this.productDialog = true;
    }

    get isEditButtonDisabled(): boolean {
        return (
          !this.product.name ||
          !this.product.lastname ||
          !this.product.email ||
          !this.product.rol
        );
      }

      async saveProductEdit(product) {
        this.submitted = true;
        try {
            const { data, error } = await this.supabase
              .from('users')
              .update({
                name: product.name,
                lastname: product.lastname,
                role_id: product.rol,
                email: product.email,
                updated_at: new Date().toISOString(),
              })
              .eq('id', product.id);

            if (error) {
              console.error('Error al actualizar el usuario:', error.message);
            } else {
              this.messageService.add({
                severity: 'success',
                summary: 'Modificación exitosa',
                detail: 'Usuario editado correctamente',
                life: 3000,
              });

              this.obtenerUsuarios();

              this.productDialog = false;
            }
          } catch (err) {
            console.error('Error inesperado:', err);
          }
    }

    //--------

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
