import { Injectable } from '@angular/core';
import SimpleUndo from 'simple-undo';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {
  constructor() {}

  myObjectSerializer = (done) => {
    done(JSON.stringify(this.theData));
  };

  myObjectUnserializer = (serialized) => {
    this.theData = JSON.parse(serialized);
  };

  theData = null;

  history = null;

  initTheData(_obj) {
    if (this.history) {
      this.history.clear();
    } else {
      this.history = new SimpleUndo({
        maxLength: 20,
        provider: this.myObjectSerializer,
      });
    }

    this.theData = _obj;
    this.history.save();
  }

  undoTheData() {
    if (this.history.position != 1) if (this.history.canUndo()) this.history.undo(this.myObjectUnserializer);
    return this.theData;
  }

  redoTheData() {
    if (this.history.canRedo()) this.history.redo(this.myObjectUnserializer);
    return this.theData;
  }

  saveTheData(_data = null) {
    if (_data) this.theData = _data;

    this.history.save();
  }

  isUndoRedo: boolean = false;
}
