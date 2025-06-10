const { addJob } = require('../Helpers/jobQueue');



const fakeVideoProcess = (name, time) => () =>
  new Promise(resolve => {
    console.log(`▶️ ${name} started...`);
    setTimeout(() => {
      console.log(`⏹️ ${name} done`);
      resolve();
    }, time);
  });


addJob(() => fakeVideoProcess("Job A", 3000), 30, 0, "A");
addJob(() => fakeVideoProcess("Job B", 1000), 10, 0, "B");
addJob(() => fakeVideoProcess("Job C", 2000), 20, 0, "C");
addJob(() => fakeVideoProcess("Job D", 5000), 50, 0, "D");
addJob(() => fakeVideoProcess("Job E", 4000), 40, 0, "E");
addJob(() => fakeVideoProcess("Job F", 6000), 60, 0, "F");