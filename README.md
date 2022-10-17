# provigevanoapp

## Project setup
```
copy and setup ./config.json
npm install
```

### Compiles and hot-reloads for development && api start
```
npm run serve
node ./api/start.js
```

#### Add DB Migrations && Seeders
```
npx sequelize-cli db:migrate --migrations-path ./api/database/migrations --url 'mysql://root:password@mysql_host.com/database_name'
npx sequelize-cli db:seed:all --seeders-path ./api/database/seeders --url 'mysql://root:password@mysql_host.com/database_name'
```

##### Compiles and minifies for production
```
npm run build
```
