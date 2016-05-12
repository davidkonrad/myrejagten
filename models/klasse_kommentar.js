/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klasse_kommentar', {
    klasse_kommentar_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    klasse_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    kommentar: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'klasse_kommentar',
    freezeTableName: true
  });
};
