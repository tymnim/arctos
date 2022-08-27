
export const Tracker = {
  scheduledJobs: new Set(),
  jobsTimeoutId: null,
  scheduleJob: (scope) => {
    if (!Tracker.jobsTimeoutId) {
      Tracker.jobsTimeoutId = setTimeout(Tracker.executeScheduledJobs);
    }

    Tracker.scheduledJobs.add(scope);
  },
  executeScheduledJobs: () => {
    // TODO: think if replacing the Set is the right decision.
    //       The following scenario possible. Scopes to execute modify variable that triggers one of the queued scopes.
    //       This way that scope will execute twice where the second exec will be useless because it will be the same data.
    const scheduledJobs = Tracker.scheduledJobs;

    Tracker.jobsTimeoutId = null;
    // NOTE: replacing it with a new set, in case any job will schedule more jobs
    Tracker.scheduledJobs = new Set();

    scheduledJobs.forEach(job => {
      job.execute();
    });

    scheduledJobs.clear();
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

    this.callback(this);
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
    Tracker.scheduleJob(this);
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
  set(value) {
    this.value = value;
    this.deps.forEach(dep => dep.trigger(this));
  }
}

export default {
  Tracker,
  Scope,
  ReactiveVar,
};
