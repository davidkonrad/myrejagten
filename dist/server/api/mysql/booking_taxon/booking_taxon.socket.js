/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Booking_taxon = require('./booking_taxon.model');

exports.register = function(socket) {
  Booking_taxon.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Booking_taxon.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('booking_taxon:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('booking_taxon:remove', doc);
}
