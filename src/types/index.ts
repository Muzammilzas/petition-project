export interface User {
  id: string;
  email: string;
}

export interface Petition {
  id: string;
  user_id: string;
  title: string;
  story: string;
  assessed_value: number;
  created_at: string;
  signature_count: number;
}

export interface Signature {
  id: string;
  petition_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}