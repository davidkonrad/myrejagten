/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lokalitet = require('./lokalitet.model');

exports.register = function(socket) {
  Lokalitet.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Lokalitet.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('lokalitet:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lokalitet:remove', doc);
}
