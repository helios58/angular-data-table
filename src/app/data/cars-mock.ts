export const CARS_MOCK = Array.from({ length: 1000 }).map((_, i) => {
  const brands = ['Toyota','Ford','Tesla','Honda','BMW','Audi','Mercedes','Nissan','Kia','Hyundai'];
  const colors = ['White','Black','Red','Blue','Silver','Gray'];

  const brand = brands[i % brands.length];
  const color = colors[i % colors.length];

  return {
    id: i + 1,
    name: `${brand} Model ${i + 1}`,
    color,
    brand,
    model: `Model ${i + 1}`,
    year: 2018 + (i % 7),
    price: 20000 + (i * 173) % 60000,
    mileage: (i + 1) * 850,
    available: i % 3 !== 0
  };
});