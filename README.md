<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Ikimina API

This is the backend API for the Ikimina application, which helps users organize, join, and manage money-rounds (rotating savings groups).

## Features

- User authentication and registration
- Create and join money-round groups
- Self-draw or admin-shuffle position mechanisms
- Payment tracking and management
- Group messaging
- Admin verification using admin codes

## Tech Stack

- NestJS - Backend framework
- Prisma - ORM
- PostgreSQL - Database
- JWT - Authentication
- TypeScript - Language

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ikimina-api.git
cd ikimina-api
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ikimina?schema=public"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
```

Make sure to update the DATABASE_URL with your PostgreSQL credentials.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
yarn start:dev
```

The API will be available at `http://localhost:3000/api`.

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

This will provide an interactive interface to test and explore all API endpoints.

## Main Endpoints

### Authentication

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login a user

### Groups

- POST `/groups` - Create a new group
- GET `/groups/:id` - Get a group by ID
- PUT `/groups/:id` - Update a group
- PUT `/groups/:id/lock` - Lock a group

### Memberships

- POST `/memberships/join` - Join a group
- GET `/memberships/group/:groupId` - Get all members of a group
- GET `/memberships/user` - Get all groups that the user is a member of

### Draws

- POST `/draws/position` - Draw a position for a member
- POST `/draws/admin-shuffle` - Admin shuffle all positions in a group
- GET `/draws/group/:groupId` - Get all draws for a group
- GET `/draws/membership/:membershipId` - Get the position for a member

### Payments

- POST `/payments` - Create a new payment
- PUT `/payments/:id/status` - Update payment status
- GET `/payments/group/:groupId` - Get all payments for a group
- POST `/payments/schedule/:groupId` - Generate payment schedule for a group

### Messages

- POST `/messages` - Create a new message
- GET `/messages/group/:groupId` - Get all messages for a group

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is licensed under the MIT License.
