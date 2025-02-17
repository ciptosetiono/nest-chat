import { Test, TestingModule } from '@nestjs/testing';
import { HoroscopeController } from './horoscope.controller';
import { HoroscopeService } from './horoscope.service';
import { GetZodiacDto } from './dto/get-zodiac.dto';

describe('HoroscopeController', () => {
  let controller: HoroscopeController;
  let horoscopeService: HoroscopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoroscopeController],
      providers: [
        {
          provide: HoroscopeService,
          useValue: {
            setDate: jest.fn(),
            getZodiacSign: jest.fn().mockReturnValue('Aquarius'),
            getChineseZodiacSign: jest.fn().mockReturnValue('Dragon'),
          },
        },
      ],
    }).compile();

    controller = module.get<HoroscopeController>(HoroscopeController);
    horoscopeService = module.get<HoroscopeService>(HoroscopeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getZodiac', () => {
    it('should return a zodiac sign', () => {
      const getZodiacDto: GetZodiacDto = { date: '1995-02-15' };

      const result = controller.getZodiac(getZodiacDto);

      expect(horoscopeService.setDate).toHaveBeenCalledWith(getZodiacDto.date);
      expect(horoscopeService.getZodiacSign).toHaveBeenCalled();
      expect(result).toBe('Aquarius');
    });
  });

  describe('getChineseZodiac', () => {
    it('should return a Chinese zodiac sign', () => {
      const getZodiacDto: GetZodiacDto = { date: '1995-02-15' };

      const result = controller.getChineseZodiac(getZodiacDto);

      expect(horoscopeService.setDate).toHaveBeenCalledWith(getZodiacDto.date);
      expect(horoscopeService.getChineseZodiacSign).toHaveBeenCalled();
      expect(result).toBe('Dragon');
    });
  });
});
