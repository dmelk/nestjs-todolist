export class TaskStatus {
  public static readonly NEW = 'new';

  public static readonly DONE = 'done';
}

export type TaskStatusType = typeof TaskStatus.NEW | typeof TaskStatus.DONE;
