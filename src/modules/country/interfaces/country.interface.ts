export interface Country {
  id: number;
  name: string;
  shortName: string;
  isoCode: number;
  ddi: string;
  continent: string;
  flag?: string | null;
}
