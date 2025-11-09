import sequelize from ".."

const partition= async()=>{
    const oldTable = 'Task'
    const newTable = 'new'
   try{
    await sequelize.query(`DROP TABLE IF EXISTS ${newTable};`);
    await sequelize.query(`DROP TABLE IF EXISTS ${oldTable}_old;`);
     await sequelize.query(`
    CREATE TABLE ${newTable}(
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    taskName VARCHAR(255) NOT NULL,
    files VARCHAR(255) NULL,
    dependencies VARCHAR(255) NULL,
    description VARCHAR(255) NULL,
    folderId CHAR(36) NOT NULL,
    markAsComplete TINYINT(1) NOT NULL DEFAULT 0,
    dueDate DATETIME NULL,
    notifications VARCHAR(255) NULL,
    comments VARCHAR(255) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id, createdAt),
    INDEX idx_taskName(taskName)
    )PARTITION BY RANGE (YEAR(createdAt)*100+MONTH(createdAt)) (
     PARTITION p202506 VALUES LESS THAN (202507),
     PARTITION p202507 VALUES LESS THAN (202508),
     PARTITION p202508 VALUES LESS THAN (202509),
     PARTITION p202509 VALUES LESS THAN (202510),
     PARTITION p202510 VALUES LESS THAN (202511),
     PARTITION P_future VALUES LESS THAN (MAXVALUE)
     );
  `);

    await sequelize.query(`
      INSERT INTO ${newTable}(id,taskName,folderId,notifications,comments,files,dependencies,description,markAsComplete,dueDate,createdAt,updatedAt)
      SELECT id,taskName,folderId,notifications,comments,files,dependencies,description,markAsComplete,dueDate,createdAt,updatedAt FROM ${oldTable}   
            `)
    await sequelize.query(`
      RENAME TABLE ${oldTable} TO ${oldTable}_old, ${newTable} TO ${oldTable};
    `);
   }
   catch(error){
    console.log(error)
    throw new Error('partitioning failed')
   }
}
export default partition;
