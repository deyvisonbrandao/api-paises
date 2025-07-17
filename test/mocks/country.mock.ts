import { Country } from "src/modules/country/interfaces/country.interface";


export const countries: Country[] = [{
    id: 1,
    name: 'Brasil',
    shortName: 'BR',
    isoCode: 76,
    ddi: '+55',
    continent: 'América do Sul',
    flag: '<svg>...</svg>',
},
{
    id: 2,
    name: 'Argentina',
    shortName: 'AR',
    isoCode: 32,
    ddi: '+54',
    continent: 'América do Sul',
    flag: '<svg>...</svg>',
}
];

export const mockCountries: Country[] = countries;
