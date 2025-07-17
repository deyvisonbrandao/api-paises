import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCountries } from '@test/mocks/country.mock';
import { CountryService } from '../services/country.service';
import { CountryController } from './country.controller';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountry = mockCountries[0];

  const mockCountryService: Partial<Record<keyof CountryService, jest.Mock>> = {
    findAll: jest.fn().mockResolvedValue([mockCountry]),
    findById: jest.fn().mockImplementation((id: number) =>
      id === 1 ? Promise.resolve(mockCountry) : Promise.reject(new NotFoundException()),
    ),
    findByShortName: jest.fn().mockImplementation((shortName: string) =>
      shortName === 'BR' ? Promise.resolve(mockCountry) : Promise.reject(new NotFoundException()),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
  });

  it('Deve retornar todos países', async () => {
    const result = await controller.findAll();

    expect(result).toEqual([mockCountry]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('Deve retornar um país pelo id', async () => {
    const result = await controller.findById(1);
    expect(result).toEqual(mockCountry);
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('Deve lançar (NotFoundException) quando id do país não existir', async () => {
    await expect(controller.findById(999)).rejects.toThrow(NotFoundException);
  });

  it('Deve retornar um país pelo shortName', async () => {
    const result = await controller.findByShortName('BR');
    expect(result).toEqual(mockCountry);
    expect(service.findByShortName).toHaveBeenCalledWith('BR');
  });

  it('Deve lançar (NotFoundException) quando shortName do país não existir', async () => {
    await expect(controller.findByShortName('XX')).rejects.toThrow(NotFoundException);
  });
});
