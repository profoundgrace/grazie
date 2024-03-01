import { Label } from './Label';
import { Note } from './Note';

export type NoteLabelInput = {
  id?: number;
  noteId: number;
  labelId: number;
};

export type NoteLabel = {
  id: number;
  noteId: number;
  labelId: number;
  label: Label;
  note: Note;
};
