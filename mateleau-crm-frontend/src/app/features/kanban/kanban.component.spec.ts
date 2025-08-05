import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { KanbanComponent } from './kanban.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/Task';

const mockTasks: Task[] = [
  new Task('1', 'Tâche A', 'todo', new Date()),
  new Task('2', 'Tâche B', 'inProgress', new Date()),
  new Task('3', 'Tâche C', 'done', new Date())
];

describe('KanbanComponent', () => {
  let component: KanbanComponent;
  let fixture: ComponentFixture<KanbanComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'getTasks', 'updateTask', 'createTask', 'deleteTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [KanbanComponent, DragDropModule, CommonModule, NoopAnimationsModule],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks and distribute them into columns', () => {
    dashboardServiceSpy.getTasks.and.returnValue(of(mockTasks));
    component.ngOnInit();
    expect(component.columns[0].tasks.length).toBe(1);
    expect(component.columns[1].tasks.length).toBe(1);
    expect(component.columns[2].tasks.length).toBe(1);
  });

  it('should call updateTask when task is dropped to a new column', () => {
    const task = new Task('1', 'Tâche A', 'todo', new Date());
component.columns[0].tasks = [{ ...task, editing: false }];
    component.columns[1].tasks = [];
    dashboardServiceSpy.updateTask.and.returnValue(of(task));

    const event: any = {
      previousContainer: { data: [task] },
      container: { data: [], id: 'list-1' },
      previousIndex: 0,
      currentIndex: 0
    };

    component.drop(event, 1);
    expect(dashboardServiceSpy.updateTask).toHaveBeenCalledWith('1', { status: 'inProgress' });
  });

  it('should add a new task', () => {
    spyOn(window, 'prompt').and.returnValue('Nouvelle tâche');
    const newTask = new Task('4', 'Nouvelle tâche', 'todo', new Date());
    dashboardServiceSpy.createTask.and.returnValue(of(newTask));

    component.addTask(0);
    expect(component.columns[0].tasks.length).toBe(1);
    expect(component.columns[0].tasks[0].title).toBe('Nouvelle tâche');
  });

  it('should delete a task after confirmation', fakeAsync(() => {
  spyOn(window, 'confirm').and.returnValue(true);

  const task: Task & { editing: boolean } = {
  _id: '1',
  title: 'Test',
  status: 'todo',
  editing: false,
  createdAt: new Date()
};

dashboardServiceSpy.deleteTask.and.returnValue(of(void 0));
  component.columns[0].tasks = [task];

  component.deleteTask(0, '1', 0);
  tick(); 

  expect(component.columns[0].tasks.length).toBe(0);
}));

  it('should not delete a task if confirmation is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const task = new Task('1', 'Test', 'todo', new Date()) as Task & { editing: boolean };
    task.editing = false;
    component.columns[0].tasks = [task];

    component.deleteTask(0, '1', 0);
    expect(component.columns[0].tasks.length).toBe(1);
  });

  it('should set task to editing mode', () => {
    const task = new Task('1', 'Tâche A', 'todo', new Date()) as Task & { editing: boolean };
    task.editing = false;
    component.startEditingTask(task);
    expect(task.editing).toBeTrue();
  });

  it('should update task title if changed on finish editing', () => {
    const task = new Task('1', 'Old Title', 'todo', new Date()) as Task & { editing: boolean };
    task.editing = true;
    const event = { target: { value: 'New Title' } };
    dashboardServiceSpy.updateTask.and.returnValue(of(task));

    component.finishEditingTask(task, event);
    expect(dashboardServiceSpy.updateTask).toHaveBeenCalledWith('1', { title: 'New Title' });
    expect(task.title).toBe('New Title');
  });

  it('should not update task title if unchanged', () => {
    const task = new Task('1', 'Same Title', 'todo', new Date()) as Task & { editing: boolean };
    task.editing = true;
    const event = { target: { value: 'Same Title' } };
    component.finishEditingTask(task, event);

    expect(dashboardServiceSpy.updateTask).not.toHaveBeenCalled();
  });
});
