/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('taxon', {
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taxon_navn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taxon_navn_dk: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taxon_artsgruppe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taxon_basisliste: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'taxon',
    freezeTableName: true
  });
};
