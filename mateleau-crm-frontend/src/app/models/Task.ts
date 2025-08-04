export class Task  {
    _id: string;
    title: string;
    status: 'todo' | 'inProgress' | 'done';
    createdAt: Date;
    constructor(_id:string,title: string, status: 'todo' | 'inProgress' | 'done', createdAt: Date) {
      this._id = _id;
      this.title = title;
      this.status = status;
      this.createdAt = createdAt;
    }

  }
  