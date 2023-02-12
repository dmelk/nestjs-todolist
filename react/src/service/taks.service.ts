import authService from "./auth.service";
import apolloClient from "./apollo.client";
import {gql} from "@apollo/client";
import {TaskView} from "../types/task.view";

class TaskService {
  public async loadTasks(skip: number, take: number, all: boolean): Promise<[number, TaskView[]]> {
    if (!authService.isLoggedIn()) throw new Error('You not logged in');

    const res = await apolloClient.query({
      query : gql`
          query Tasks($skip: Int!, $take: Int!, $all: Boolean!) {
              tasks(skip: $skip, take: $take, all: $all) {
                  total,
                  records {
                      id, description, status
                  }
              }
          }
      `,
      variables: {
        skip: skip,
        take: take,
        all: all,
      },
      fetchPolicy: 'no-cache'
    });
    return [res.data.tasks.total, res.data.tasks.records];
  }

  public async createTask(description: string): Promise<TaskView> {
    if (!authService.isLoggedIn()) throw new Error('You not logged in');

    const res = await apolloClient.mutate({
      mutation : gql`
          mutation CreateTask($description: String!) {
              createTask(input: {description: $description}) {
                id, description, status
              }
          }
      `,
      variables: {
        description: description,
      }
    });
    return res.data.createTask;
  }

  public async completeTask(id: string): Promise<TaskView> {
    if (!authService.isLoggedIn()) throw new Error('You not logged in');

    const res = await apolloClient.mutate({
      mutation : gql`
          mutation CompleteTask($id: String!) {
              completeTask(input: {id: $id}) {
                  id, description, status
              }
          }
      `,
      variables: {
        id: id,
      }
    });
    return res.data.completeTask;
  }
}

const taskService = new TaskService();
export default taskService;
