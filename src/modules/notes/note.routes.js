import { Router } from 'express';

import * as noteController from './note.controller.js';

export const noteRouter = Router();

noteRouter.get('/', noteController.getNotes);
noteRouter.post('/', noteController.createNote);
noteRouter.patch('/:id', noteController.updateNote);
noteRouter.delete('/:id', noteController.deleteNote);
