# Event Management

This is a NestJS application for event management. It includes features such as scheduling, caching, email notifications, and more. The project uses Prisma as an ORM, Redis for caching, and integrates WebSockets for real-time communication.

## Prerequisites

Before you begin, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [NestJS CLI](https://docs.nestjs.com/) (optional but recommended)
- [Redis](https://redis.io/) (for caching)
- [Prisma](https://www.prisma.io/) (for ORM)
- [Yarn](https://yarnpkg.com/) (optional, if you prefer Yarn over npm)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/event-management.git
   cd event-management
   ```
2. Install dependencies: Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

3. Set up your environment variables:

Create a .env file in the root directory.
Add necessary environment variables

4. Set up Prisma migrations:

- Run Prisma migrations;

```bash
npx prisma migrate dev
```

## Running the Application

To run the application in development mode with live reload:

```bash
npm run start:dev
```

Or using yarn:

```bash
yarn start:dev
```

### you will find the api documentation at

http://localhost:(yourport)/api
