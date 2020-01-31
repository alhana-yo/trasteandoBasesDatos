# API REST BLOG

## Functionality
Implement a service for the management of a blog with persistence and REST API. Blog entries may have comments and to avoid publishing those that may be offensive, the service may internally include a validator.

The blog should manage the following:

- **Post**: Each entry contains the following fields: Author's name, Author's nickname, Title, Text, List of comments.
- **Comment**: Each comment contains the following fields: Nickname of the author of the comment, Content, Date of the comment.
- **OffensiveWord**: Each word will have an associated "level" field indicating the severity of the word from 1 to 5.

## Endpoints

Entries and comments:

- GET: Recover of all entries (no comments) `/blogEntries`
- GET: Recover an entry (with comments) `/blogEntries/:id`
- POST: Create of a new entry (no comments) `/blogEntries`
- DELETE: Delete an existing entry (with all your comments) `/blogEntries/:id`
- PUT: Modify of an existing entry `/blogEntries/:id`

- POST: Add a new comment to an entry `/blogEntries/:id/comments`
- PUT: Modify an existing comment `/blogEntries/:id/comments/:commentId`
- DELETE: Delete an existing comment in an entry `/blogEntries/:id/comments/:commentId`

Offensive words:

- POST: Save a new offensive word `/badwords`
- GET: List all offensive words `/badwords`
- GET: List one offensive word `/badwords/:id`
- DELETE: Delete an offensive word `/badwords/:id`
- PUT: Modify an existing offensive word `/badwords/:id`

Register new users:

- POST: save a new user on DB `/register`

## User control

The application allow several roles for users:

- _Authenticated_:
  - **Admin**: Admin users can perform any operation of the API REST.
  - **Publisher**: Publisher users can:
    - Create blog entries.
    - Delete and modify entries.
    - Delete and add comments.
- _No-Authenticated_: They just can consult information, but cannot add comments or posts.

Any user can register in the application and will be assigned the role of “publisher”.

The app implement a Node.js script called load_admins.js that will connect to MongoDB and create admin users when it runs the first time.

## User Authentication

The user authentication mechanism is **Basic Auth + JWT Tokens**.

## Install Dependencies

You can install all dependencies in `package.json` file on one step using:

`npm install`

Thank you in advance for your feedback :)
