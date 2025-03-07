Informational responses (100 – 199)

- **100 Continue** - The server has received the request headers, and the client should proceed to send the request body.
- **101 Switching Protocols** - The requester has asked the server to switch protocols and the server has agreed to do so.

Successful responses (200 – 299)

- **200 OK** - The request has succeeded.
- **201 Created** - The request has been fulfilled, resulting in the creation of a new resource.
- **204 No Content** - The server successfully processed the request, but is not returning any content.

Redirection messages (300 – 399)

- **301 Moved Permanently** - The URL of the requested resource has been changed permanently.
- **302 Found** - The resource resides temporarily under a different URL.
- **304 Not Modified** - The resource has not been modified since the version specified by the request headers.

Client error responses (400 – 499)

- **400 Bad Request** - The server could not understand the request due to invalid syntax.
- **401 Unauthorized** - The client must authenticate itself to get the requested response.
- **403 Forbidden** - The client does not have access rights to the content.
- **404 Not Found** - The server can not find the requested resource.

Server error responses (500 – 599)

- **500 Internal Server Error** - The server has encountered a situation it doesn't know how to handle.
- **502 Bad Gateway** - The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable** - The server is not ready to handle the request.

## Middleware

- **morgan** - logging
- **helmet** - secure headers
- **cors** - cross-origin resource sharing
- **express.json()** - parses JSON payloads (application/json)
- **express.urlencoded()** - parses form data (application/x-www-form-urlencoded)
- **express.static()** - serves files
- **express.Router()** - modular routes

## Input Validation

- **Joi** - input validation
- **express-validator** - input validation

## Authentication

- **express-session** - session middleware
- **passport** - authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt** - password hashing

## API Documentation

- **swagger** - API documentation
- **swagger-ui-express** - API documentation
- **swagger-jsdoc** - API documentation

## Testing

- **Jest** or **mocha** - testing framework
- **supertest** - HTTP assertions

## Common Mongosh Commands

```javascript
// Show all databases
show dbs

// Select a database
use yourDatabaseName

// Show all collections
show collections

// Find all documents in a collection
db.workouts.find()

// Find one document
db.workouts.findOne()

// Insert a test document
db.workouts.insertOne({
  name: "Test Workout",
  exercises: [
    {
      name: "Push-ups",
      reps: 10,
      sets: 3
    }
  ]
})

// Delete a document
db.workouts.deleteOne({ name: "Test Workout" })

// Remove all documents from the workouts collection
db.workouts.deleteMany({})

// Create an index on the name field
db.workouts.createIndex({ name: 1 })

// Index on both name and createdAt fields
db.workouts.createIndex({ name: 1, createdAt: -1 })

// Create a text index for searching workout descriptions
db.workouts.createIndex({ description: "text" })

// Then search with:
db.workouts.find({ $text: { $search: "cardio strength" } })
```
