export interface DryerData {
  id: number;
  type: string;
  t_set: number;
  h_set: number;
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  t_ave: number;
  h_ave: number;
  bat_percentage: number;
  updated_at: string;
}

export interface DryerDataResponse {
  data: DryerData[] | null;
  error: any;
  count: number | null;
}
