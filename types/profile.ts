export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  start_date: string;
  end_date: string;
}

export interface JobPreferences {
  work_type: string;
  remote_preference: string;
  preferred_locations: string[];
  industries: string[];
}

export interface MissingProfileField {
  key: string;
  label: string;
  section: string;
}

export interface ProfileCompletion {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: MissingProfileField[];
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  target_role: string;
  salary_min: number;
  salary_max: number;
  location: string;
  linkedin_url: string;
  job_preferences: JobPreferences;
  resume_file_url: string;
  resume_file_key: string;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: MissingProfileField[];
  created_at: string;
  updated_at: string;
}

export type ProfileInput = Omit<
  Profile,
  | "id"
  | "user_id"
  | "is_complete"
  | "completion_percentage"
  | "missing_fields"
  | "created_at"
  | "updated_at"
>;

export interface ResumeProfileExtract {
  full_name?: string;
  phone?: string;
  bio?: string;
  target_role?: string;
  location?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
}
