/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking', {
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sagsNo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    DatoForBesoeg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DatoForBooking: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    timestamp_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    periode: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    aar_periode: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'booking',
    freezeTableName: true
  });
};
