/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Klasse = require('./klasse.model');

exports.register = function(socket) {
  Klasse.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Klasse.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('klasse:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('klasse:remove', doc);
}
