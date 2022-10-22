
export const Tracker = {
  scheduledJobs: new Map(),
  jobsTimeoutId: null,
  scheduleJob: (scope) => {
    if (!Tracker.jobsTimeoutId) {
      Tracker.jobsTimeoutId = setTimeout(Tracker.executeScheduledJobs);
    }
    const scheduledJob = Tracker.scheduledJobs.get(scope);
    if (scheduledJob) {
      return scheduledJob;
    }

    let resolveJob;
    const job = new Promise((resolve, reject) => {
      resolveJob = resolve;
    });
    job.execute = async () => {
      await scope.execute();
      resolveJob();
    }

    Tracker.scheduledJobs.set(scope, job);
    return job;
  },
  executeScheduledJobs: () => {
    const jobs = Tracker.scheduledJobs;

    Tracker.jobsTimeoutId = null;

    // NOTE: not waiting for any jobs to finish; we care only to trigger them;
    //       if something changes in the future; this is the place to modify it
    //       Promise.all(scheduledJobs.map(job => job()))
    [...jobs.entries()].forEach(async ([scope, job]) => {
      await job.execute();
      jobs.delete(scope);
    });
  }
};

export class Scope {
  constructor(callback) {
    this.callback = callback;

    this.stoped = false;
    this.timesRun = 0;
    this.deps = new Set();
    this.triggeredBy = new Set();

    // NOTE: I think there might a need to store some data on the scope
    //       though it might not be the nicest code.
    this.space = {};
  }

  get firstRun() {
    return this.timesRun < 2;
  }

  depend(reactiveVar) {
    this.deps.add(reactiveVar);
    reactiveVar.deps.add(this);
  }

  stop() {
    this.stopped = true;
    this.deps.forEach(dep => dep.deps.delete(this));
  }

  resume() {
    this.stopped = false;
    this.deps.forEach(dep => dep.deps.add(this));
  }

  execute() {
    if (this.stopped) {
      return;
    }
    this.timesRun ++;

    const ret = this.callback(this);
    if (ret instanceof Promise) {
      return new Promise(async resolve => {
        await ret;
        this.triggeredBy.clear();
        resolve();
      });
    }
    this.triggeredBy.clear();
  }

  die() {
    this.stoped = true;
    // TODO: implement
    //       remove
    //       should get rid of all of the dependencies and remove itself from all of the deps
    //       Look at FinalizationRegistry (
    //          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
    //       )
  }

  trigger(reactiveVar) {
    if (this.stopped) {
      return;
    }
    this.triggeredBy.add(reactiveVar);
    return Tracker.scheduleJob(this);
  }
}

export class ReactiveVar {
  constructor(value) {
    this.value = value;
    this.deps = new Set();
  }

  get() {
    if (Tracker.currentScope) {
      Tracker.currentScope.depend(this);
    }
    return this.value;
  }
  // NOTE: #set can be optionaly awaited for all dependencies to execute.
  set(value) {
    this.value = value;
    const deps = [...this.deps].map(dep => dep.trigger(this));
    return Promise.all(deps);
  }
}

export default {
  Tracker,
  Scope,
  ReactiveVar,
};
