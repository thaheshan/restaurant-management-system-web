import React from "react";
import RolesPage from "../Roles/RolesPage";
// Staff page reuses the Roles page — users land on the Staff tab automatically
const StaffPage: React.FC = () => <RolesPage />;
export default StaffPage;
