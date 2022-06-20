const express = require('express');
const { request } = require('express');
const { response } = require('express');

const { v4: uuidv4 } = require("uuid")
const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

app.use(express.json());



const users = [];

console.log({users});

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);
  
  if (!user){
    return response.status(404).json({error: 'Usuário nnão encontrado!'});
  }

  request.user = user;
  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { username, name } = request.body;
  const userExists = users.find((user) => user.username === username)

   if(userExists){
     return response.status(400).json({error: "Username já está em uso!"})
   }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
   const { user } = request;

   return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todo.push(todo);
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.query;
  const { title, deadline } = request.params; // rota é paramns - header é query

  const todo = user.todos.find((todo => todo.id === id));

  if(!todo) {
    return response.status(404).json({error: "Todo não encontrado"});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.query;

  const todo = user.todos.find((todo => todo.id === id));

  if(!todo) {
    return response.status(404).json({error: "Todo não encontrado"});
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.query;

  const todoIndex = user.todos.findIndex((todo => todo.id === id));

  if(todoIndex === -1) {
    return response.status(404).json({error: "Todo não encontrado"});
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
  
});

module.exports = app;
