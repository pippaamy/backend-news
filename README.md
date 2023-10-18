# NEWS API

Hosted Version :https://my-news-2d2d.onrender.com

## SETUP

```
$ git clone https://github.com/pippaamy/backend-news.git
```

```
$ npm install
```

```
$ npm run setup-dbs
```

### Create .ENV files

To connect to either the test database or the development database please create .env.development & .env.test files and include the line PGDATABASE=nc_news or PGDATABASE=nc_news_test respectively in each file.

```
$ npm run seed
```

```
$ npm run test
```

## Version requirments

Node.js : 20.5.1

Postgres: 14.9
