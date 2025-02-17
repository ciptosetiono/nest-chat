import { Body, Controller, Get } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { GetZodiacDto } from './dto/get-zodiac.dto';

@Controller('horoscope')
export class HoroscopeController {
    constructor (private horoscopeService : HoroscopeService){}

    @Get('/zodiac')
    getZodiac(
        @Body() getZodiacDto: GetZodiacDto
    ): string {
        this.horoscopeService.setDate(getZodiacDto.date);
        return this.horoscopeService.getZodiacSign();
    }

    @Get('/chinese-zodiac')
    getChineseZodiac(
        @Body() getZodiacDto: GetZodiacDto
    ): string {
        this.horoscopeService.setDate(getZodiacDto.date);
        return this.horoscopeService.getChineseZodiacSign();
    }
}
