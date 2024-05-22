export function generateDatePairs(startingDate: Date, monthsApart: number, weeksApart: number, pairs: number): [Date, Date][] {
    const datePairs: [Date, Date][] = [];
    const minStartDate = new Date('2025-01-01');
  
    let currentDate = new Date(startingDate);
  
    for (let i = 0; i < pairs; i++) {
      // Ensure the current date is at least the minimum start date
      if (i > 0 && currentDate < minStartDate) {
        currentDate = new Date(minStartDate);
      }
  
      const firstDate = new Date(currentDate);
      const secondDate = new Date(firstDate);
      secondDate.setMonth(secondDate.getMonth() + monthsApart);
  
      datePairs.push([firstDate, secondDate]);
  
      // Move to the next pair's starting date
      currentDate.setDate(currentDate.getDate() + weeksApart * 7);
    }
  
    return datePairs;
  }
  
  // Start from September 9th
  const startingDate = new Date('2024-09-09');
  
  // Generate 3 pairs of dates
//   const datePairs = generateDatePairs(startingDate, 3, 3, 3);
  
//   // Print the generated date pairs
//   datePairs.forEach(([first, second], index) => {
//     console.log(`Pair ${index + 1}:`);
//     console.log(`  First Date: ${first.toISOString().split('T')[0]}`);
//     console.log(`  Second Date: ${second.toISOString().split('T')[0]}`);
//   });
  