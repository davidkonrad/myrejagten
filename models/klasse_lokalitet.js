/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klasse_lokalitet', {
    klasse_lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    klasse_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    navn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    X_GPS: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Y_GPS: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'klasse_lokalitet',
    freezeTableName: true
  });
};
