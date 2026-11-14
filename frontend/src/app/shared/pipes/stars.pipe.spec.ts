import { StarsPipe } from './stars.pipe';

describe('StarsPipe', () => {
  const pipe = new StarsPipe();

  it('shows filled and empty stars', () => {
    expect(pipe.transform(4)).toBe('★★★★☆');
    expect(pipe.transform(0)).toBe('☆☆☆☆☆');
  });

  it('rounds averages and stays within 0..5', () => {
    expect(pipe.transform(3.6)).toBe('★★★★☆');
    expect(pipe.transform(9)).toBe('★★★★★');
    expect(pipe.transform(null)).toBe('☆☆☆☆☆');
  });
});
