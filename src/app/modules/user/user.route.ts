import { studentValidations } from "./../student/student.validation";
import express from "express";
import { UserControlers } from "./user.controler";
import validateRequest from "../../middlwares/validateRequest";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControlers.createStudent,
);

export const UserRoutes = router;
