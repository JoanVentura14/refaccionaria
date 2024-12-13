import { Inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private s_client: SupabaseClient;

  constructor(@Inject('SUPABASE_CLIENT') private supabaseClient: SupabaseClient) { 
    
  }

  //register
  singUp(email: string, password: string){
    return this.supabaseClient.auth.signUp({email, password})
  }

   //singin
   singIn(email: string, password: string){
    return this.supabaseClient.auth.signInWithPassword({email, password})
  }
}
