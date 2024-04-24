import type {
  BehaviorStack,
  behaviorRecordOptions,
} from "../types/userAction";

export default class BehaviorStore {
  private state: BehaviorStack[];
  private readonly maxBehaviorRecords: number;

  constructor(options: behaviorRecordOptions) {
    const { maxBehaviorRecords } = options;
    this.maxBehaviorRecords = maxBehaviorRecords;
    this.state = [];
  }

  push(value: BehaviorStack) {
    if (this.length() === this.maxBehaviorRecords) this.shift();
  }

  shift() {
    return this.state.shift();
  }

  length() {
    return this.state.length;
  }

  get() {
    return this.state;
  }

  clear() {
    this.state = [];
  }
}
