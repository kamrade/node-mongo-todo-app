const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app }  = require('./server');
const { Todo } = require('./models/todo');
const _paths   = require('./data/paths');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({})
    .then( () => {
      return Todo.insertMany(todos);
    }).then(() => done());

});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post(_paths.addTodo)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post(_paths.addTodo)
      .send({})
      .expect(400)
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get(_paths.getTodos)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  })
})


describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`${_paths.getTodos}/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`${_paths.getTodos}/${(new ObjectID()).toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
      .get(`${_paths.getTodos}/${'123'}`)
      .expect(400)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {

  it('should remove a todo doc', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`${_paths.getTodos}/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`${_paths.getTodos}/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
      .delete(`${_paths.getTodos}/123asd`)
      .expect(400)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text  = 'This should be the new text';

    request(app)
      .patch(`/v1/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it('should clear completedAt whe todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text  = 'This should be the new text';

    request(app)
      .patch(`/v1/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);

  });

})
