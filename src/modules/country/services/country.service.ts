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
        const flag = await this.getSvgFlag(country);
        return { ...country, flag: flag };
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

    const svg = await this.getSvgFlag(country);
    return { ...country, flag: svg };
  }

  async findByShortName(shortName: string) {
    if (!shortName) {
      throw new NotFoundException('Informe o shortName do país');
    }

    const country = this.countries.find((c) => c.shortName.toLowerCase() === shortName.toLowerCase());

    if (!country) {
      throw new NotFoundException('País não encontrado');
    }

    const svg = await this.getSvgFlag(country);
    return { ...country, flag: svg };
  }

  private async loadCountries() {
    const dataPath = path.join(process.cwd(), this.getBasePath(), 'countries.json');

    const jsonData = await fs.readFile(dataPath, 'utf8');
    this.countries = JSON.parse(jsonData);
  }

  private getSvgPath(shortName: string): string {
    return path.join(process.cwd(), `${this.getBasePath()}/svg`, `${shortName.toLowerCase()}.svg`);
  }

  private getBasePath() {
    return process.env.NODE_ENV === 'production' ? 'dist/assets' : 'src/assets';
  }

  private async getSvgFlag(country: Country): Promise<string | null> {
    const svgPath = this.getSvgPath(country.shortName);

    try {
      let svg = await fs.readFile(svgPath, 'utf8')
      return this.formatSvg(svg);
    } catch (error) {
      return null;
    }
  }

  private formatSvg(svg: string): string {
    return svg.split('"').join("'");
  }
}
