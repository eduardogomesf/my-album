# Project Overview
**File Management Sys** is a backend system that allow users to store and manage their files in an easy and secure way.

## Description
**File Management Sys** follows a microservice architecture where all the communication between the services works in asynchronous way through a distributed streaming platform (Apache Kafka).

The architecture is composed by three main services: Customer Management Service, File Manager Service and Notification Service.

## Services
The **Customer Management Service** is responsible for handling the management and authentication of users within the system. This service uses a MongoDB database to save all required information and communicates with other services in an asynchronous way by using Kafka Topics to send messages.

The **File Manager Service** is responsible for allowing users to manage their files. This service uses a Postgres database to save all required information and uses the Amazon S3 service to store the actual files. It also communicates with other services through Kafka topics.

The **Notification Service** is responsible for sending e-mail notifications to users on important occasions. This service is constantly reading messages from Kafka in order to send real-time notifications to the users. It has an integration with MailHog service for Email Testing.

You can find more details in the **[High-Level System Design](#high-level-system-design)** section.

## Key Technologies:
[Node](https://nodejs.org/en)  
[TypeScript](https://www.typescriptlang.org/)  
[Express](https://expressjs.com/)  
[Kong Gateway](https://docs.konghq.com/gateway/latest/)  
[MongoDB](https://www.mongodb.com/)  
[PostgreSQL](https://www.postgresql.org/)  
[Apache Kafka](https://kafka.apache.org/)  
[Amazon S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3)  
[MailHog](https://github.com/mailhog/MailHog)  
[Docker](https://www.docker.com/)  
[Docker Compose](https://docs.docker.com/compose/)  
[Jest](https://jestjs.io/pt-BR/)  

## High-level System Design

![System Design](./@docs/high-level-system-design.svg "File Management System")

---
🛠️ Created by [eduardogomesf](https://github.com/eduardogomesf)
