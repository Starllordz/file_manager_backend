import {
    Generated,
  } from 'kysely'

export interface File {
  id?: Generated<string>;
  title: string;
  description: string;
  category: string;
  language: string;
  provider: string;
  roles: object;
  path: string;
  uploaded_at?: Generated<Date>;
}

export interface Database {
  files: File;
} 