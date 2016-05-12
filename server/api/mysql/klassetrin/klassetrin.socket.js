/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Klassetrin = require('./klassetrin.model');

exports.register = function(socket) {
  Klassetrin.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Klassetrin.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('klassetrin:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('klassetrin:remove', doc);
}
