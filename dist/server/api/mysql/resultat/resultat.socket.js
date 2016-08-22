/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Qwerty = require('./resultat.model');

exports.register = function(socket) {
  Qwerty.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Qwerty.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('resultat:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('resultat:remove', doc);
}
