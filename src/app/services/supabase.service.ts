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
  async getVehicles(): Promise<any[]> {
    const { data, error } = await this.supabase.from('vehicles').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    console.log('Raw data from Supabase:', data);
    return data || [];
  }
  async getBrandsByYear(year: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('brand')
      .eq('year', year);
  
    if (error) {
      console.error('Error fetching brands by year:', error);
      return [];
    }
    console.log('Datos obtenidos:', data);
  
    // Filtrar marcas únicas
    const uniqueBrands = Array.from(new Set(data?.map((vehicle: any) => vehicle.brand))) || [];
    return Array.from(new Set(data?.map((vehicle: any) => vehicle.brand))) || [];
  }  
  async getModelsByYearAndBrand(year: string, brand: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('model')
      .eq('year', year)
      .eq('brand', brand);
  
    if (error) {
      console.error('Error fetching models by year and brand:', error);
      return [];
    }
  
    console.log('Datos obtenidos:', data);
  
    // Filtrar modelos únicos
    const uniqueModels = Array.from(new Set(data?.map((vehicle: any) => vehicle.model))) || [];
    console.log('Modelos únicos:', uniqueModels); // Verificar los modelos únicos
    return uniqueModels;
  }
  async getMotorByYearAndBrand(year: string, brand: string,model: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('motor')
      .eq('year', year)
      .eq('brand', brand)
      .eq('model', model);
  
    if (error) {
      console.error('Error fetching models by year and brand:', error);
      return [];
    }
  
    console.log('Datos obtenidos:', data);
  
    // Filtrar modelos únicos
    return Array.from(new Set(data?.map((vehicle: any) => vehicle.motor))) || [];
  }
  async getProductsByCompatibility(
    year: string,
    brand: string,
    model: string,
    motor: string
  ): Promise<any[]> {
    // Obtener los vehicle_id que cumplen con los filtros
    const { data: vehiclesData, error: vehiclesError } = await this.supabase
      .from('vehicles')
      .select('id')
      .eq('year', year)
      .eq('brand', brand)
      .eq('model', model)
      .eq('motor', motor);
  
    if (vehiclesError) {
      console.error('Error fetching vehicles by compatibility:', vehiclesError);
      return [];
    }
  
    // Extraer los ids de vehículos únicos
    const vehicleIds = vehiclesData?.map((vehicle: any) => vehicle.id) || [];
  
    if (!vehicleIds.length) {
      console.warn('No matching vehicles found.');
      return [];
    }
  
    // Obtener los product_id asociados a los vehicle_id
    const { data: compatibilityData, error: compatibilityError } = await this.supabase
      .from('product_vehicle_compatibility')
      .select('product_id')
      .in('vehicle_id', vehicleIds);
      console.log('Datos obtenidos:', compatibilityData);
    if (compatibilityError) {
      console.error('Error fetching product compatibility:', compatibilityError);
      return [];
      
      
    }
  
    // Extraer los product_id únicos
    const productIds = compatibilityData?.map((compatibility: any) => compatibility.product_id) || [];
    console.log('Datos obtenidos:', productIds);
    if (!productIds.length) {
      console.warn('No matching products found.');
      return [];
    }
  
    // Obtener los productos finales
    const { data: productsData, error: productsError } = await this.supabase
      .from('products')
      .select('*')
      .in('id', productIds);
      console.log('Datos obtenidos:', productsData);
  
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return [];
    }
  
    return productsData || [];
  }

  
  async searchProducts(query: string) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`) // Busca en el nombre de los productos
        .or(`description.ilike.%${query}%`); // Busca también en la descripción

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return { data: [], error };
    }
  }
  
  
}
