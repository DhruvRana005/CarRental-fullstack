import dns from "dns";
const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
dns.resolveSrv = resolver.resolveSrv.bind(resolver);
dns.resolveTxt = resolver.resolveTxt.bind(resolver);

// Patch dns.promises as well (which the mongodb driver uses)
const promisesResolver = new dns.promises.Resolver();
promisesResolver.setServers(["8.8.8.8", "1.1.1.1"]);
dns.promises.resolveSrv = promisesResolver.resolveSrv.bind(promisesResolver);
dns.promises.resolveTxt = promisesResolver.resolveTxt.bind(promisesResolver);

const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  resolver.resolve4(hostname, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      // Fallback to native lookup
      return originalLookup(hostname, options, callback);
    }
    const address = addresses[0];
    const family = 4;
    callback(null, address, family);
  });
};

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// Initialize Express app
const app = express()

// connect database
await connectDB()

// Middleware
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.port || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))