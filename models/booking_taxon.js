/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking_taxon', {
    booking_taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    is_included: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'booking_taxon',
    freezeTableName: true
  });
};
