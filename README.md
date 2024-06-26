# Buff Ticket System
This repository contains the source code for the Buff Ticket system, a platform for event management and ticket purchasing using NFC technology. The system utilizes a monorepo structure with several interconnected packages for efficient development and management.

## Technology Stack
- **Backend Framework**: NestJS
- **Database**: MongoDB
- **Payment Gateway**: Stripe
- **SMS Service**: Twilio

[//]: # (## Packages)

[//]: # (The monorepo consists of the following packages:)

[//]: # (- **customer**: Customer-facing functionalities, including event browsing, ticket purchasing, and NFC bracelet management.)

[//]: # (- **partner**: Partner-facing functionalities, including event management, staff management, and ticket verification.)

[//]: # (- **admin**: Admin functionalities for system management, resource allocation, and user management.)
## Getting Started
### Install dependencies:
```shell
npm install
```
### Setup environment variables:
Create a `.env` file in the root directory and add your environment variables for database connections, API keys for Stripe and Twilio, and other necessary configurations.
This will start the development server for all packages. You can access the API endpoints at the specified port (usually http://localhost:3000).
### Start the development server:
You can run individual packages in development mode using the following commands:
- Customer app:
```shell
npm run start:dev:customer
```
### Testing
To run unit tests for all packages, use the following command:
```shell
npm run test
```
## Development Workflow
- Developers are expected to follow established coding standards and best practices.
- Branching strategies and code reviews will be implemented to ensure code quality and maintainability.
- Regular testing and continuous integration/continuous deployment (CI/CD) pipelines will be utilized to ensure system stability and rapid deployment.
## Building and Deployment
For instructions on building and deploying the application to production environments, refer to the specific documentation for each package.
## Additional Notes
- This README provides a basic overview of the monorepo structure and setup.
- Each package may have additional documentation and instructions within its directory.
- Make sure to configure your environment variables and dependencies correctly before running the application.
- We hope this project provides a solid foundation for building a robust and efficient event management and ticketing system.
#   t i c k e t - b a c k e n d  
 