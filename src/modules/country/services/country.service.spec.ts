
import { NotFoundException } from '@nestjs/common';
import { mockCountries } from '@test/mocks/country.mock';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CountryService } from './country.service';

jest.mock('fs/promises');

describe('CountryService', () => {
  let service: CountryService;
  const svgFlag = '<svg>...</svg>';

  const mockReadFile = (filePath: string): string => {
    const filename = path.basename(filePath).toLowerCase();
    if (filename === 'countries.json') return JSON.stringify(mockCountries);
    return svgFlag;
  };

  beforeEach(async () => {
    service = new CountryService();
    (fs.readFile as jest.Mock).mockImplementation((filePath: string) => Promise.resolve(mockReadFile(filePath)));

    await service['loadCountries']();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve carregar países a partir do arquivo JSON', async () => {
    await service.onModuleInit();
    expect(service['countries']).toEqual(mockCountries);
  });

  it('Deve retornar todos países com bandeiras SVG', async () => {
    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('flag', svgFlag);
  });

  it('Deve retornar um país com bandeira pelo id', async () => {
    const country = await service.findById(1);
    expect(country).toMatchObject(mockCountries[0]);
  });

  it('Deve lançar (NotFoundException) quando id não for fornecido', async () => {
    await expect(service.findById(undefined as any)).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar (NotFoundException) quando país não for encontrado pelo id', async () => {
    await expect(service.findById(999)).rejects.toThrow(NotFoundException);
  });

  it('Deve retornar um país com bandeira pelo shortName', async () => {
    const country = await service.findByShortName('br');
    expect(country).toMatchObject(mockCountries[0]);
  });

  it('Deve ser case-insensitive', async () => {
    const country = await service.findByShortName('Ar');
    expect(country.shortName).toBe('AR');
  });

  it('Deve lançar (NotFoundException) quando shortName não for fornecido', async () => {
    await expect(service.findByShortName(undefined as any)).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar (NotFoundException) quando país não for encontrado pelo shortName', async () => {
    await expect(service.findByShortName('XX')).rejects.toThrow(NotFoundException);
  });

  it('Deve buscar países por parte do nome', async () => {
    const countries = await service.findBySearch('ARG');
    expect(countries).toHaveLength(1);
    expect(countries[0].name).toBe('Argentina');
  });

  it('Deve lançar (NotFoundException) quando termo de busca não for fornecido', async () => {
    await expect(service.findBySearch(undefined as any)).rejects.toThrow(NotFoundException);
  });

  it('Deve trazer array vazio quando nenhum país for encontrado na busca', async () => {
    await expect(service.findBySearch('xyz')).resolves.toEqual([]);
  });

});
