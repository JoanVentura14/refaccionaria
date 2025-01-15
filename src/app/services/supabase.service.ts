import { Inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
 

  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  // Método para obtener categorías
  // supabase.service.ts
async getCategories(): Promise<any[]> {
    const { data, error } = await this.supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data || [];
  }
  
}
