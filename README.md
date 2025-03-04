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
