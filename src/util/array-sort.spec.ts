import { Sort } from '../enum/sort.enum';
import { arraySort } from './array-sort';

describe('arraySort utility', () => {
  it('should sort arrays alphanumerically', () => {
    const records = [{ name: 'Paul' }, { name: 'Nala' }, { name: 'Bailey' }];
    const result = arraySort(records, 'name', Sort.asc);
    expect(result).toEqual([
      { name: 'Bailey' },
      { name: 'Nala' },
      { name: 'Paul' },
    ]);
  });

  it('Should sort arrays numerically', () => {
    const records = [
      { name: 'Paul', age: 35 },
      { name: 'Nala', age: 2 },
      { name: 'Bailey', age: 5 },
    ];
    const result = arraySort(records, 'age', Sort.desc);
    expect(result).toEqual([
      { name: 'Paul', age: 35 },
      { name: 'Bailey', age: 5 },
      { name: 'Nala', age: 2 },
    ]);
  });
});
