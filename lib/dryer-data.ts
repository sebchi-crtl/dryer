import { createClient } from '@/utils/supabase/client';
import { DryerData, DryerDataResponse } from '@/types/dryer';

export async function fetchDryerData(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<DryerDataResponse> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('dryer_data')
      .select('*', { count: 'exact' });
    
    // Add search filter if provided
    if (search) {
      query = query.ilike('type', `%${search}%`);
    }
    
    // Add sorting
    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('updated_at', { ascending: false });
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    return {
      data: data as DryerData[],
      error,
      count
    };
  } catch (error) {
    console.error('Error fetching dryer data:', error);
    return {
      data: null,
      error,
      count: null
    };
  }
}

export async function fetchDryerDataStats(): Promise<{
  totalItems: number;
  recentItems: DryerData[];
  error: any;
}> {
  try {
    const supabase = createClient();
    
    // Get total count
    const { count: totalItems, error: countError } = await supabase
      .from('dryer_data')
      .select('*', { count: 'exact', head: true });
    
    // Get recent items (last 5)
    const { data: recentItems, error: recentError } = await supabase
      .from('dryer_data')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5);
    
    return {
      totalItems: totalItems || 0,
      recentItems: recentItems as DryerData[] || [],
      error: countError || recentError
    };
  } catch (error) {
    console.error('Error fetching dryer stats:', error);
    return {
      totalItems: 0,
      recentItems: [],
      error
    };
  }
}
