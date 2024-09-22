# Faculty Evaluation System API Documentation

This documentation covers both the server and client sides of the Faculty Evaluation System. The server is built with Node.js, using Express.js as the web framework and Sequelize ORM for database operations with a MySQL database. JWT is used for authentication and authorization. The client side is built using React.

## Setup and Installation

1. Clone the repository:

```bash
git clone https://github.com/sayjin93/faculty-evaluation-systen.git
```

2. Navigate into the server directory:

```bash
cd server
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Edit`.env` file in the server directory and provide values for the following variables:

```
GOOGLE_TRANSLATE_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key

DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=fc
```

5. Run the server:

```bash
npm run dev
```

6. Open new terminal and navigate into the client directory:

```bash
cd client
```

7. Install dependencies:

```bash
npm install
```

8. Run the client:

```bash
npm start
```

## PM2 (https://pm2.keymetrics.io/)

#### Start all applications

```bash
pm2 start ecosystem.config.js
```

#### Stop all

```bash
pm2 stop ecosystem.config.js
```

#### Restart all

```bash
pm2 restart ecosystem.config.js
```

#### Reload all

```bash
pm2 reload ecosystem.config.js
```

#### Delete all

```bash
pm2 delete ecosystem.config.js
```

#### Generating a Startup Script

```bash
pm2 startup
```

[PM2] You have to run this command as root. Execute the following command:

```bash
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u jkruja --hp /home/jkruja
```

## License

This project is licensed under the ISC License.
