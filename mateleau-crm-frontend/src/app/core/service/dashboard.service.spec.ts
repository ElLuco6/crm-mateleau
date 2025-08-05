import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Task } from '../../models/Task';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch today\'s dashboard data', () => {
    const mockData = { dives: 5, divers: 10 };

    service.getDashboardToday().subscribe(res => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiDashboard}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockData);
  });

  it('should fetch week\'s dashboard data', () => {
    const mockData = { weekStats: [1, 2, 3] };

    service.getDashboardWeek().subscribe(res => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiDashboard}/week`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockData);
  });

  it('should fetch tasks', () => {
    const mockTasks: Task[] = [
      new Task('t1', 'Fix bug', 'todo', new Date())
    ];

    service.getTasks().subscribe(res => {
      expect(res).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${environment.apiTasks}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a task', () => {
    const newTask: Partial<Task> = {_id:'1', title: 'New task', status: 'todo' , createdAt: new Date()};

    const createdTask = new Task('t2', 'New task', 'todo', new Date());

    service.createTask(newTask).subscribe(res => {
      expect(res).toEqual(createdTask);
    });

    const req = httpMock.expectOne(`${environment.apiTasks}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(createdTask);
  });

  it('should update a task', () => {
    const updatedTask: Partial<Task> = { title: 'Updated', status: 'inProgress' };
    const updatedTaskFull = new Task('t3', 'Updated', 'inProgress', new Date());

    service.updateTask('t3', updatedTask).subscribe(res => {
      expect(res).toEqual(updatedTaskFull);
    });

    const req = httpMock.expectOne(`${environment.apiTasks}/t3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTaskFull);
  });

  it('should delete a task', () => {
    const id = 't2';

    service.deleteTask(id).subscribe(res => {
    expect(res).toBeTruthy();
  });

    const req = httpMock.expectOne(`${environment.apiTasks}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
    
  });
});
