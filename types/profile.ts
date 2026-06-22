export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  experience: Experience[];
  skills: string[];
  target_role: string;
  salary_min: number;
  salary_max: number;
  location: string;
  linkedin_url: string;
  resume_file_url: string;
  resume_file_key: string;
  created_at: string;
  updated_at: string;
}

export type ProfileInput = Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">;
