# Project Overview

**My album** is an application that allow users to store and manage their albums, photos and videos in an easy and secure way.

## Description

**My album** is a web application designed to offer users a secure and efficient way to store and manage their digital albums, photos, and videos. This system leverages a microservice event-driven architecture, ensuring that all service-to-service communications occur asynchronously via a distributed streaming platform, specifically Apache Kafka. This architectural choice enhances the responsiveness and scalability of the platform, facilitating seamless interactions across various services.

The architecture is composed by three main services: User Management Service, File Manager Service and a Web Application.

## System Design

![System Design](./@docs/system-design.svg "File Management System")

## Interested in running the project?

[Go to how to run section](#running-the-project-on-docker)

## Services

The **User Management Service** is responsible for handling the management and authentication of users within the system. This service uses a MongoDB database to save all required information and communicates with other services in an asynchronous way by using Kafka Topics to send messages.

The **File Manager Service** is responsible for allowing users to manage their files. This service uses a Postgres database to save all required information and uses the Amazon S3 service to store the actual files. It also communicates with other services through Kafka topics.

The **Web app** is the frontend web application that allow users to interact with the system.

## Key Technologies:

[Node](https://nodejs.org/en)  
[TypeScript](https://www.typescriptlang.org/)  
[Express](https://expressjs.com/)  
[NextJS](https://nextjs.org/)
[ReactJS](https://react.dev/)
[Tailwindcss](https://tailwindcss.com/)
[Kong Gateway](https://docs.konghq.com/gateway/latest/)  
[MongoDB](https://www.mongodb.com/)  
[PostgreSQL](https://www.postgresql.org/)  
[Apache Kafka](https://kafka.apache.org/)  
[Amazon S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3)  
[Docker](https://www.docker.com/)  
[Docker Compose](https://docs.docker.com/compose/)  
[Jest](https://jestjs.io/pt-BR/)

## Patterns and Design Principles

[Microservices](https://martinfowler.com/articles/microservices.html)  
[Observer](https://refactoring.guru/design-patterns/observer)  
[Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)  
[Repository](https://medium.com/@pererikbergman/repository-design-pattern-e28c0f3e4a30)  
[Factory](https://refactoring.guru/design-patterns/factory-method)  
[SOLID](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)  
[Decorator](https://refactoring.guru/design-patterns/decorator)

## Running the project on Docker

**_You must have Docker and Docker Compose installed._**

Run the following command in the project's root folder

```
docker compose up -d --build
```

## Documentation

You can find a swagger file in the @docs folder.

I recommend using a swagger editor like [this](https://editor.swagger.io/) to visualize all available routes.

## Available features

- User creation
- User login
- Refresh token
- Album creation
- Album deletion
- List user's active albums
- List user's deleted albums
- List user's album and its files (infinite scroll)
- Upload files to an album
- Delete fiels of an album
- Move files from one album to another
- Download files

## Possible improvements

- Create a recover password feature
- Create a file recovery feature
- Create a MFA feature
- Create a see all files feature
- Update user information feature
- Update password feature
- Add monitoring services
---

🛠️ Created by [eduardogomesf](https://eduardogomesf.dev)
