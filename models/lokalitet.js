/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lokalitet', {
    lokalitet_id: {
      type: DataTypes.INTEGER(11),
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
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    showPolygon: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    showMarker: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    showPopup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    geometryWkt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    presentationString: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skrivemaade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skrivemaade_officiel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skrivemaader_uofficiel: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'lokalitet',
    freezeTableName: true
  });
};
