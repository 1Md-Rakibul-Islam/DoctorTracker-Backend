export type TUser = {
  id: string;
  role: "doctor" | "patient";
  status: "in-progress" | "blocked";
  password: string;
  needsPasswordChange: boolean;
  isDeleted: boolean;
};

export type NewUser = {
  id: string;
  role: "doctor" | "patient";
  password: string;
};
