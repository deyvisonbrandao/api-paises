import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Country } from '../interfaces/country.interface';

@Injectable()
export class CountryService implements OnModuleInit {
  private countries: Country[] = [];

  async onModuleInit() {
    await this.loadCountries();
  }

  async findAll() {
    return await Promise.all(
      this.countries.map(async (country) => {
        return country;
      }),
    );
  }

  async findById(id: number) {
    if (!id) {
      throw new NotFoundException('Informe o id do país');
    }

    const country = this.countries.find((c) => c.id === id);

    if (!country) {
      throw new NotFoundException('País não encontrado');
    }

    return country;
  }

  async findByShortName(shortName: string) {
    if (!shortName) {
      throw new NotFoundException('Informe o shortName do país');
    }

    const country = this.countries.find((c) => c.shortName.toLowerCase() === shortName.toLowerCase());

    if (!country) {
      throw new NotFoundException('País não encontrado');
    }

    return country;
  }

  async findBySearch(search: string) {
    if (!search) {
      throw new NotFoundException('Informe o termo de busca');
    }

    const countries = this.countries.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    return countries;
  }

  private async loadCountries() {
    const dataPath = path.join(process.cwd(), this.getBasePath(), 'countries.json');

    const jsonData = await fs.readFile(dataPath, 'utf8');
    this.countries = JSON.parse(jsonData);
  }

  private getBasePath() {
    return process.env.NODE_ENV === 'production' ? 'dist/assets' : 'src/assets';
  }
}
