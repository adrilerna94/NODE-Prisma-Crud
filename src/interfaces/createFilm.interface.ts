import { Prisma } from "@prisma/client";

export interface ICreateFilm {
  title: string;
  released_date: Date;
  director: string;
  genre: string;
  duration?: number | null;
  rating?: number | Prisma.Decimal | null;
  language?: string | null;
  country?: string | null;
  synopsis?: string | null;
  budget?: bigint | null;
  box_office?: bigint | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}
