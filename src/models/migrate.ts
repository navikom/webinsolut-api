import fs from 'fs';
import {Request} from 'express';
import {db} from '@app/models/index';
import CONFIG from '@app/config/config';

const join = (arr: string[], delimetr: string) => {
  let string = '';
  let l = arr.length, i = 0;
  while (l--) {
    string += arr[i++];
    if(l >= 1) {
      string += delimetr;
    }
  }
  return string;
};

const insertBuilder = function(keys: string[], entry: any, table: string, pKey: string[], fileName: string) {
  const values: any[] = Object.values(entry).map((e: any) => {
    if (e === null) return null;
    if (typeof e === 'string') {
      e = `'${ e.replace(/'/g, '\\"') }'`;
    }
    if(typeof e === 'object') {
      e = `'${ JSON.stringify(e).replace(/'/g, '\\"')}'`;
    }

    return e;
  });

  const string = `\nINSERT INTO ${ table } (${keys.join(',')}) VALUES(${ join(values,',') });`;
  fs.appendFileSync(`data/${fileName}.sql`, string);
  console.log('recorded table: %s, id: %s', table, pKey.join(','));
  if(CONFIG.app === 'test') {
    console.log(string);
  }
};

const insertLinesBuilder = async function(entries: Array<any>, tableName: string, pKey: string[], fileName: string) {
  let keys;
  entries.forEach((entry) => {
    keys = Object.keys(entry.rawAttributes).map((key: string) => {

      return entry.rawAttributes[key].field;
    });
    insertBuilder(keys, entry.toJSON(), tableName, pKey, fileName);
  });
  if(keys && pKey.length === 1) {
    fs.appendFileSync(`data/${fileName}.sql`, `\nselect setval('${tableName}_${keys[0]}_seq', (select max(${keys[0]}) from ${tableName}));`);
  }
};

export class MigrateModel {

  static async exportToFile(req: Request) {
    const fileName = req.params.fileName;
    const keys = Object.keys(db.models);
    let l = keys.length;
    try {
      fs.statSync('data');
    } catch (e) {
      fs.mkdirSync('data');
    }
    fs.writeFile(`data/${fileName}.sql`, '', () => console.log('File write'));
    while (l--) {
      const key = keys[l];
      const model = db.models[key];
      let tableName = model.getTableName();
      tableName = typeof tableName === "string" ? tableName : tableName.tableName;
      await insertLinesBuilder(await model.findAll({paranoid: false}), tableName, model.primaryKeyAttributes, fileName);
    }
    return `Tables exported to data/${fileName}.sql`;
  }

  static async insert(fileName: string = 'tables') {
    const data = fs.readFileSync(`data/${fileName}.sql`,'utf8');
    const lines = data.split('\n');
    let l = lines.length, i = 0;
    while (l--) {
      const query = lines[i++];
      if(query.length === 0) continue;
      const res: any = await db.query(query);
      console.log('Inserted', res.rows && res.rows.length);
    }

    return 'Rows inserted to db';
  }
}
