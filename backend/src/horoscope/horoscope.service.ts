import { Injectable } from '@nestjs/common';
import { GetZodiacDto } from './dto/get-zodiac.dto';


@Injectable()
export class HoroscopeService {

    private stringDate: string;
    private date: Date;
    private day: number;
    private month: number;
    private year:number;

    // Array pf Object zodiac sign
    private zodiacSigns = [
        { sign: "Capricorn", start: [12, 22], end: [1, 19] },
        { sign: "Aquarius", start: [1, 20], end: [2, 18] },
        { sign: "Pisces", start: [2, 19], end: [3, 20] },
        { sign: "Aries", start: [3, 21], end: [4, 19] },
        { sign: "Taurus", start: [4, 20], end: [5, 20] },
        { sign: "Gemini", start: [5, 21], end: [6, 20] },
        { sign: "Cancer", start: [6, 21], end: [7, 22] },
        { sign: "Leo", start: [7, 23], end: [8, 22] },
        { sign: "Virgo", start: [8, 23], end: [9, 22] },
        { sign: "Libra", start: [9, 23], end: [10, 22] },
        { sign: "Scorpio", start: [10, 23], end: [11, 21] },
        { sign: "Sagittarius", start: [11, 22], end: [12, 21] }
    ];

    public chineseStartYear = 1924;

     // Array of Chinese zodiac signs
     public chineseZodiacSigns = [
        "Rat",
        "Ox",
        "Tiger",
        "Rabbit",
        "Dragon",
        "Snake",
        "Horse",
        "Goat",
        "Monkey",
        "Rooster",
        "Dog",
        "Pig"
    ];


    setDate(stringDate: string){
        this.stringDate = stringDate;
        this.date = new Date(stringDate);
        this.day =  this.date.getDate();
        this.month = this.date.getMonth() + 1;
        this.year = this.date.getFullYear();
    };

    getZodiacSign():  string{
      
        for (const zodiac of this.zodiacSigns) {
          if (
            (this.month === zodiac.start[0] && this.day >= zodiac.start[1]) ||
            (this.month === zodiac.end[0] && this.day <= zodiac.end[1])
          ) {
            return zodiac.sign;
          }
        }
        return "Invalid date";
    }
  
    getChineseZodiacSign(): string {
        
        // Calculate the index for the zodiac sign
        const zodiacIndex = (this.year - this.chineseStartYear ) % 12;
    
        // Return the corresponding zodiac sign
        return this.chineseZodiacSigns[zodiacIndex];
    }
    
}
