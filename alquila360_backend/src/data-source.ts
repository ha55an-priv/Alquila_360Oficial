import { DataSource } from "typeorm"
import { User } from "./entity/user.entity";
import { Ticket } from "./entity/ticket.entity";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456789",
    database: "alquila360",
    entities: [User, Ticket],
    synchronize: true,
    logging: false,
})

export default AppDataSource;