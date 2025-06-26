| Tech                    | Description                    |
| ----------------------- | ------------------------------ |
| Node.js + Express       | Backend framework              |
| MongoDB + Mongoose      | NoSQL database                 |
| Passport.js             | Authentication (local & OAuth) |
| Nodemailer              | Email OTP Verification         |
| Arcjet                  | Rate limiting and security     |
| Stripe (or Flutterwave) | Payment gateway integration    |
| JWT                     | Token-based session management |
| CORS                    | Cross-origin access handling   |

### project folders and files structure
/controllers     - Route logic (auth, vehicles, bookings)
/models          - Mongoose schemas
/routes          - API route definitions
/services        - Utility services (email, payments)
/middleware      - Auth & validation middleware
/config          - Environment configs (DB, mail,)
/utils           - Helper functions
server.js        - Main app entry
.env             - Environment variables


- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kentswindells45/carset-backend.git
   cd carset-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carset
JWT_SECRET=mysecretkey
EMAIL_USER=oppongkevin1@gmail.com
EMAIL_PASS=aijwvdzmkshsgrkm
STRIPE_KEY=sk_test_1a2b3c4d5e6f7g8h9i0j
   ```

### Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. The server will run on `http://localhost:5000` (or the port specified in your `.env`).

### postman collection 
| Endpoint                | Method | Description                  |
| ----------------------- | ------ | ---------------------------- |
| `/api/users/register`   | POST   | Register with role & email   |
| `/api/users/verify-otp` | POST   | Confirm registration via OTP |
| `/api/users/login`      | POST   | Login and receive token      |
| `/api/vehicles`         | POST   | Owner adds vehicle           |
| `/api/bookings`         | POST   | Client books a car           |
| `/api/payments/pay`     | POST   | Client makes payment         |
| `/api/reviews`          | POST   | Client submits a review      |
| `/api/admin/stats`      | GET    | Admin dashboard stats        |

