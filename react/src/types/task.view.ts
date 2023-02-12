import {TaskStatusType} from "./task-status";

export interface TaskView {
  id: string;
  description: string;
  status: TaskStatusType;
}
