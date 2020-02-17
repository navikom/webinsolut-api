export function randomInt(min: number, max: number) {
  return min + Math.floor((max - min) * Math.random());
}

export function randomItem(array: any[]) {
  return array[randomInt(0, array.length - 1)];
}

export function randomItemCount(array: any[], count: number) {
  const getFreshNum = (nums: number[]): number => {
    const num = randomInt(0, array.length - 1);
    return nums.includes(num) ? getFreshNum(nums) : num;
  };

  const arr = [...Array(count)];
  const reduced = arr.reduce((a: number[]) => {
    a.push(getFreshNum(a));
    return a
  }, []);
  return reduced.map((i: number) => array[i]);
}

export function randomId() {
  return Math.random().toString(26).slice(2);
}

export function randomString(length: number) {
  return [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join("");
}

export function asyncTimeout(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function getRandomDate(from: Date = new Date(1970, 1, 1), to: Date = new Date(2005, 1, 1)): Date {
  const fromDate = from.getTime();
  const toDate = to.getTime();
  return new Date(fromDate + Math.random() * (toDate - fromDate));
}
