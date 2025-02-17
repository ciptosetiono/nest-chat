export default class ZodiacCalculator {
    private day: number;
    private month: number;
    private year:number;

    // Array pf Object zodiac sign
    public zodiacSigns = [
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
  

    // Array of Chinese zodiac signs
    public chineseZodiacSigns = [
        "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
    ];
     

    constructor(day: number, month: number, year:number) {
      this.day = day;
      this.month = month;
      this.year = year;
    }
  
    getZodiacSign() {
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

    getChineseZodiacSign() {
     
        // The Chinese zodiac cycle starts with the year of the Rat (1924)
        const startYear = 1924;
        
        // Calculate the index for the zodiac sign
        const zodiacIndex = (this.year - startYear) % 12;
    
        // Return the corresponding zodiac sign
        return this.chineseZodiacSigns[zodiacIndex];
    }
    
  }

  