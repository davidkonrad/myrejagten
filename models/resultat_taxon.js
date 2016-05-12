/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resultat_taxon', {
    resultat_taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    resultat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    analyseret: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    positiv: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    negativ: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    eDNA: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'resultat_taxon',
    freezeTableName: true
  });
};
