import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
<<<<<<< HEAD
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HomeComponent } from './components/home/home.component';



=======
>>>>>>> 1b21131c73641a08d2765dbf5a8dfa0f22127124
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot_password/forgot_password.component';
//import { RegisterComponent } from './components/register/register.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
<<<<<<< HEAD

=======
>>>>>>> 1b21131c73641a08d2765dbf5a8dfa0f22127124

@NgModule({
    imports: [
        RouterModule.forRoot([
            {

              
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
           
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            {path: 'login', component: LoginComponent},
            {path: 'forgot_password', component: ForgotPasswordComponent},
            { path: 'notfound', component: NotfoundComponent },
<<<<<<< HEAD

            {path: 'home', component: HomeComponent},

           // { path: 'register', component: RegisterComponent },

            { path: 'create_user', component: CreateUserComponent },

=======
           // { path: 'register', component: RegisterComponent },

            { path: 'create_user', component: CreateUserComponent },
>>>>>>> 1b21131c73641a08d2765dbf5a8dfa0f22127124
            { path: '**', redirectTo: '/notfound' },
            
           
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
