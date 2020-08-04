process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { httpServer } = require('../src');
const knex = require('../src/db/config');
const { expect } = require('chai');

const companyTest = require('./company');
const userTest = require('./user');
const projectTest = require('./project');
const rosterTest = require('./roster');
const announcementTest = require('./announcement');
const absenTest = require('./absen');
const permitTest = require('./permit')
const deviceTest = require('./device')
const departmentTest = require('./department')

describe('Routes: ', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  companyTest(chai, httpServer, expect);
  userTest(chai, httpServer, expect);
  projectTest(chai, httpServer, expect);
  rosterTest(chai, httpServer, expect);
  announcementTest(chai, httpServer, expect);
  absenTest(chai, httpServer, expect);
  permitTest(chai, httpServer, expect)
  deviceTest(chai, httpServer, expect)
  departmentTest(chai, httpServer, expect)


});