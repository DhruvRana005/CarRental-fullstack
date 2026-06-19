import express from "express";
import {
  adminLogin,
  getDashboardData,
  adminAddCar,
  adminEditCar,
  adminDeleteCar,
  adminDeleteUser,
  adminChangeBookingStatus,
  adminDeleteBooking
} from "../controllers/adminController.js";
import { isAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", isAdmin, getDashboardData);
adminRouter.post("/car", isAdmin, adminAddCar);
adminRouter.put("/car/:id", isAdmin, adminEditCar);
adminRouter.delete("/car/:id", isAdmin, adminDeleteCar);

// Extra admin capabilities (Full Access)
adminRouter.delete("/user/:id", isAdmin, adminDeleteUser);
adminRouter.put("/booking/:id/status", isAdmin, adminChangeBookingStatus);
adminRouter.delete("/booking/:id", isAdmin, adminDeleteBooking);

export default adminRouter;
