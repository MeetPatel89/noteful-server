const express = require('express');
const NotesService = require('./notes-service');
const path = require('path');
const notesRouter = express.Router();
const bodyParser = express.json();

notesRouter
  .route('/notes')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then((notes) => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name, content } = req.body;
    const folderid = req.body.folderid;
    const newNote = {
      name,
      content,
      folderid,
    };

    NotesService.insertNote(req.app.get('db'), newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${note.id}`))
          .json(note);
      })
      .catch(next);
  });

notesRouter
  .route('/notes/:note_id')
  .all((req, res, next) => {
    NotesService.getById(req.app.get('db'), req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: "Note doesn't exists" },
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.note.id,
      name: res.note.name,
      modified: res.note.modified,
      folderid: res.note.folderid,
      content: res.note.content,
    });
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get('db'), req.params.note_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
