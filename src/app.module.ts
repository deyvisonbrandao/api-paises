import { Module } from '@nestjs/common';
import { CountryModule } from './modules/country/country.module';

@Module({
  imports: [CountryModule],
})
export class AppModule { }
