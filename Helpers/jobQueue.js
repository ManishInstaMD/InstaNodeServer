const queue = [];
let isProcessing = false;
let completedJobs = 0;
let failedJobs = 0;

const addJob = (job, priority = 0, retries = 0, id = Date.now()) => {
  queue.push({ job, priority, retries, id });
  queue.sort((a, b) => a.priority - b.priority); // Shortest Job First (lower priority = shorter duration)

  console.log(`📥 New job added (ID: ${id}, Priority: ${priority}). Queue size: ${queue.length}`);
  logQueueState();
  processQueue();
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { job, priority, retries, id } = queue.shift();

  console.log(`🚀 Processing job (ID: ${id}, Priority: ${priority}, Retry: ${retries})...`);

  try {
    await job();
    completedJobs++;
    console.log(`✅ Job done (ID: ${id})`);
  } catch (err) {
    failedJobs++;
    console.error(`❌ Job failed (ID: ${id}):`, err.message);
    if (retries < 2) {
      console.log("🔁 Retrying job...");
      queue.unshift({ job, priority, retries: retries + 1, id });
    }
  }

  isProcessing = false;
  processQueue();
};

const logQueueState = () => {
  console.log("📋 Current Queue:");
  queue.forEach((item, index) => {
    console.log(`  ${index + 1}. ID: ${item.id}, Priority: ${item.priority}, Retries: ${item.retries}`);
  });
};

const getQueueSize = () => queue.length;

const getStats = () => ({
  totalInQueue: queue.length,
  completedJobs,
  failedJobs
});

module.exports = {
  addJob,
  getQueueSize,
  getStats
};
