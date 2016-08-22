/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Fag = require('./fag.model');

exports.register = function(socket) {
  Fag.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Fag.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('fag:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('fag:remove', doc);
}
