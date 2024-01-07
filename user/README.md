# User Management Microservice
## Overview
This microservice is designed to handle user management functionalities within our application architecture. Built using Node.js, TypeScript, and Express, it adheres to the principles of clean architecture, ensuring separation of concerns and modular design. The service interacts with a MongoDB database for persistent data storage and utilizes RabbitMQ for efficient messaging and event-driven communication.

## Features
**Create User**: Allows for the registration of new users into the system. This endpoint accepts user details and stores them securely in the MongoDB database. <br/>
**Login**: Handles user authentication, enabling existing users to log in to the system. This process ensures secure access and session management.

## Technologies
**Node.js** <br/>
**TypeScript** <br/>
**Express** <br/>
**MongoDB** <br/>
**RabbitMQ**

## Architecture
The service follows clean architecture principles, promoting independence from frameworks, databases, and interfaces. This approach leads to a system that is testable, maintainable, and adaptable to changing business requirements.

## API Documentation with Swagger
We have included a swagger.yaml file in the root folder of this microservice, providing comprehensive documentation for our RESTful API endpoints. This Swagger documentation offers an interactive and detailed guide for understanding and testing the API functionalities, including the create user and login endpoints.

You can copy the content and paste in a [online swagger editor](https://editor.swagger.io/)
