# Overview of the typescript exercise

## Infrastructure
- Backend: has been converted into NestJS app using Prisma and Supertokens Identity Provider
- Frontend: Angular app with signal-based state management solution
- Docker: containers for DB and Supertokens

## Architecture

I've chosen to follow a Domain Driven Design architecture using NX to split code into libraries for both apps.
Thus, we have the data-access library that contains DTOs, api services and mocks for the UI.
On the backend side we also keep DTOs, errors and various utils.

Core libraries contain common functionalities such as guards, providers, decorators, middleware, etc.

Then, rest of our code is in feature libraries, with two parts, one being auth and one being chat (where we group messages and conversations).

The dependency tree is as follows: data-access may depend on nothing, core only on data-access and features on either of prior.

## UI Improvements

Made the app zoneless in order to fully optimize the change detection cycles. With that, we use a combination of signals and RxJs in order to achieve seamless state management.

I did not opt to integrate any third party state management solutions because the app is still small. If I did, I would've likely chose NgRx Signal Store due to its lightweight nature and extensibility. 

The data flow within streams has been described via comments in login component. We use a combination of operators, ranging from startWith for the initial state, map for the success case and catchError for the error case.

Furthermore, I've added msw (mock service worker) in order to have some mocks while developing on the UI without backend.

## Backend

Here, I've opted for NestJs because of the many feature it brings. I've also integrated Supertokens as an IDP because it can be self hosted and allows for plenty customizability.
For instance, it can be integrated with major cloud providers and offers a way to architect your application without exposing yourself to vendor lock-in.

I've chosen Prisma because of its streamlining capabilities and powerful, type-safe codegen.
In order to validate the DTOs, I've used Zod because of its powerful type inference and customizability.

Finally, I've added a websockets implementation in order to have real time updates for when data changes.

## OpenAPI
Swagger file is automatically generated and available at localhost:3000/swagger (there's also a link in the console on booting up the server).

## How to run it

I like to use pnpm because it's faster, so I adjusted the project. You'll need to install it globally, as well as docker and dotenv-cli for the scripts.

Steps:

1. Run `pnpm install` in root.
2. Run `pnpm exec serve:docker` for the containers. 
3. Run `pnpm exec serve:backend`
4. Run `pnpm exec serve:frontend`

The solution has an automatic migration run for the database, as well as a seed mechanism on the backend on boot.
There will be 20 users generated with credentials "testuser1@gmail.com" (until "testuser20@gmail.com") and password `Password1!`.


## Recommendations

If I had more time, I would've also done a proper testing part. MSW is a specific choice for this in order to be able to run E2E's more seamlessly.

Apart from this, I would've further finessed the UX, error handling and so on. Currently, the UI isn't that reactive, as you need to refresh the conversation to see changes.
I would've liked to also make the conversations react to this, showing the last message after updating.
