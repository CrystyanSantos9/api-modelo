import Sequelize, { Model } from "sequelize";

class Customer extends Model {
    static initi(sequelize){
        super.init(
            {
                name:Sequelize.STRING, 
                email:Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                sequelize
            }
            
        );
    }
}

export default Customer; 