class TaskEventSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!observer || typeof observer.update !== "function") {
      throw new Error("Observer must expose an update(event) method.");
    }

    this.observers.push(observer);
  }

  async notify(event) {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        console.error("Observer update failed:", error.message);
      }
    }
  }
}

module.exports = new TaskEventSubject();
