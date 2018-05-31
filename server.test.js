const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app }  = require('./server');
const { Todo } = require('./models/todo');
const _paths   = require('./data/paths');

const { User } = require('./models/user');

const { todos, populateTodos, users, populateUsers } = require('./test/seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post(_paths.todos)
      .set('x-auth', users[0].tokens[0].token)
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
      .post(_paths.todos)
      .set('x-auth', users[0].tokens[0].token)
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
      .get(_paths.todos)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done);
  })
})


describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`${_paths.todos}/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`${_paths.todos}/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .get(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
      .get(`${_paths.todos}/${'123'}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {

  it('should remove a todo doc', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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

  it('should not remove a todo doc created by another user', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch(e => done(e));
      });
  });


  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
      .delete(`${_paths.todos}/123asd`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text  = 'This should be the new text';

    request(app)
      .patch(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
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

  it('should not update the todo created by another user', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text  = 'This should be the new text';

    request(app)
      .patch(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)

      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).not.toBe(text);
          done();
        }).catch(e => done(e));
      });
      // .end(done);
  });


  it('should clear completedAt whe todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text  = 'This should be the new text';

    request(app)
      .patch(`${_paths.todos}/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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

});

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get(`${_paths.users}/me`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get(`${_paths.users}/me`)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /users', () => {

  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123mnb!';

    request(app)
      .post(`${_paths.users}`)
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect( res.headers['x-auth'] ).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    let email = 'just_new_email';
    let password = '1';

    request(app)
      .post(`${_paths.users}`)
      .send({email, password})
      .expect(400)
      .end(done);
  });


  it('should not create user if email in use', (done) => {
    let email = users[0].email;
    let password = '123456';

    request(app)
      .post(`${_paths.users}`)
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/v1/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {

        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((err) => {
            done(err);
          });

      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/v1/users/login')
      .send({
        email: users[1].email,
        password: 'wrong_password'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((err) => done(err));
      })
  });

});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {

    request(app)
      .delete('/v1/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {

        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => {
          done(err)
        });

      });

  });
});
