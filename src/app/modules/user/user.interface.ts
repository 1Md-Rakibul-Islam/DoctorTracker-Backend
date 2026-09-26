export type TUser = {
  id: string;
  role: "admin" | "student" | "faculty";
  status: "in-progress" | "blocked";
  password: string;
  needsPasswordChange: boolean;
  isDeleted: boolean;
};

export type NewUser = {
  id: string;
  role: string;
  password: string;
};
