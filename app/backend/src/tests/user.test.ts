import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import { Model } from 'sequelize';

import { app } from '../app';
import User from '../database/models/UserModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa endpoint /login', () => {

  beforeEach(sinon.restore);

  const userList = [
    new User({
      id: 7,
      username: 'Username',
      role: 'admin',
      email: 'email@email.com',
      password: 'password'
    })
  ]

  it('Verifica se user login é válido', async () => {
    const body = { email: 'email@email.com', password: 'password'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(200);
    expect(result.body).to.haveOwnProperty('token')

  });

  it('Verifica se user login sem password retorna erro', async () => {
    const body = { email: 'email@email.com', password: ''}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Verifica se user login sem email retorna erro', async () => {
    const body = { email: '', password: 'password'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Verifica se user login com email invalido retorna erro', async () => {
    const body = { email: 'email', password: 'password'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });


  it('Verifica se user login com password invalida retorna erro', async () => {
    const body = { email: 'email@email.com', password: '123'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

  it('Verifica se user login com email e password invalidas retorna erro', async () => {
    const body = { email: 'email', password: '123'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

  it('Verifica se user login se o token não é encontrado', async () => {
    const body = { email: 'email', password: '123'}
    sinon.stub(Model, 'findAll').resolves([userList[0]]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const result = await chai.request(app).get('/login/role');

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Token not found'})   
  });
});