# Food Fests Backend

Node.js, Express, and MySQL2 backend following strict MVC architecture.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Run the development server: `npm run dev`

## Architecture

* `src/config/`: Configuration files
* `src/controllers/`: Route controllers (HTTP logic)
* `src/services/`: Business logic
* `src/models/`: Database interactions
* `src/routes/`: Express routes
* `src/middleware/`: Custom middleware
* `src/validators/`: Request validation schemas
* `src/utils/`: Reusable utilities
