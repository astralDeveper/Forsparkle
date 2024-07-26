let a = '2024-07-22T22:22:47.649Z';

const now = new Date();
const timeDifference = Math.floor((now - new Date(a)) / (1000 * 60));

console.log(timeDifference)