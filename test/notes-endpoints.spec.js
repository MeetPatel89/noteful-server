const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeNotesArr } = require('./notes-fixtures');
const { makeFoldersArr } = require('./folders-fixtues');

describe('Notes Endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('noteful_notes').truncate());

  afterEach('cleanup', () => db('noteful_notes').truncate());
  afterEach('cleanup', () => db('noteful_folders').delete());

  describe('GET /api/notes', () => {
    context('Given no notes', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/notes').expect(200, []);
      });
    });

    context('Given there are notes in the database', () => {
      const testNotes = makeNotesArr();
      const folders = makeFoldersArr();

      beforeEach('insert folders', () => {
        return db.into('noteful_folders').insert(folders);
      });
      beforeEach('insert notes', () => {
        return db.into('noteful_notes').insert(testNotes);
      });

      it('responds with 200 and all of the notes', () => {
        return supertest(app).get('/api/notes').expect(200, testNotes);
      });
    });
  });

  describe('POST /api/notes', () => {
    const folders = makeFoldersArr();
    beforeEach('insert folders', () => {
      return db.into('noteful_folders').insert(folders);
    });

    it('creates a note, responding with 201 and the new note', function () {
      this.retries(3);
      const newNote = {
        name: 'Random',
        folderid: 2,
        content: 'Randomness is beautiful',
      };
      return supertest(app)
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newNote.name);
          expect(res.body.folderid).to.eql(newNote.folderid);
          expect(res.body.content).to.eql(newNote.content);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.modified).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then((res) =>
          supertest(app).get(`/api/notes/${res.body.id}`).expect(res.body)
        );
    });
  });
});
