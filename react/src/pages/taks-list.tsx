import {Component} from "react";
import {TaskView} from "../types/task.view";
import taskService from "../service/taks.service";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {TaskStatus} from "../types/task-status";
import {Checkbox, Chip, FormControlLabel, FormGroup} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import authService from "../service/auth.service";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {GridRenderCellParams} from "@mui/x-data-grid/models/params/gridCellParams";
import Box from "@mui/material/Box";

interface TaskListState {
  records: TaskView[],
  total: number,
  description: string,
  page: number,
  showForm: boolean,
  all: boolean
}

const theme = createTheme();

class TaskList extends Component<any, TaskListState> {

  private readonly onPage = 10;

  private readonly columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.status === TaskStatus.NEW) {
          return <Chip color="warning" label='In progress'/>
        }
        return <Chip color="success" label='Done'/>
      }
    },
    {
      field: 'id',
      headerName: 'Action',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.status === TaskStatus.NEW) {
          return <Button variant="contained" onClick={() => this.completeTask(params.row.id)}>Complete</Button>
        }
        return '';
      }
    }
  ]

  constructor(props: any) {
    super(props);

    this.state = {
      all: false,
      description: '',
      records: [],
      total: 0,
      page: 0,
      showForm: false,
    }
  }

  logout() {
    authService.logout();
    window.location.href = '/';
  }

  async setPage(page: number, all: boolean) {
    try {
      const [total, records] = await taskService.loadTasks(
        page * this.onPage,
        this.onPage,
        all
      );

      this.setState({
        page: page,
        all: all,
        total: total,
        records: [ ...records ]
      });
    } catch (e) {
      this.logout();
    }
  }

  async completeTask(taskId: string) {
    try {
      await taskService.completeTask(taskId);
      await this.setPage(this.state.page, this.state.all);
    } catch (e) {
      this.logout();
    }
  }

  async addTask() {
    try {
      await taskService.createTask(this.state.description);
      this.closeForm();
      await this.setPage(0, this.state.all);
    } catch (e) {
      this.logout();
    }
  }

  async setShowAll(all: boolean) {
    await this.setPage(0, all);
  }

  closeForm() {
    this.setState({
      description: '',
      showForm: false
    });
  }

  showAddForm() {
    this.setState({
      showForm: true,
    });
  }

  async componentDidMount() {
    await this.setPage(0, false);
  }

  render() {
    return <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="lg">
          <Grid container>
            <Grid item xs>
              <Button variant="contained" onClick={() => this.showAddForm()}>Add new task</Button>
            </Grid>
            <Grid item xs>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={() => this.logout()}>Logout</Button>
              </Box>
            </Grid>
          </Grid>
          <Grid
            container

            visibility={(this.state.showForm)? 'visible' : 'hidden'}
            display={(this.state.showForm)? '' : 'none'}
          >
            <Grid container>
              <TextField
                required
                fullWidth={true}
                id="outlined-required"
                label="Task description"
                value={this.state.description}
                onChange={
                  (event) => {
                    this.setState({
                      description: event.target.value
                    });
                  }
                }
              />
            </Grid>
            <Grid container>
              <Grid item xs>
                <Button variant="contained" onClick={() => this.addTask()}>Create</Button>
              </Grid>
              <Grid item xs>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={() => this.closeForm()}>Close</Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.all}
                    onChange={(_, checked) => this.setShowAll(checked)}
                  />
                }
                label={'Show all tasks'}
              />
            </FormGroup>
          </Grid>
          <Grid container>
            <DataGrid
              autoHeight={true}
              rows={this.state.records}
              columns={this.columns}
              pageSize={this.onPage}
              rowCount={this.state.total}
              rowsPerPageOptions={[this.onPage]}
              paginationMode={'server'}
              page={this.state.page}
              onPageChange={(page) => this.setPage(page, this.state.all)}
              disableColumnMenu={true}
            />
          </Grid>
        </Container>
      </ThemeProvider>
    </div>;
  }
}

export default TaskList;
