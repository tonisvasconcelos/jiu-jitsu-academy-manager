import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import StudentsList from "../features/students/pages/StudentsList";
import StudentForm from "../features/students/pages/StudentForm";
import TeachersList from "../features/teachers/pages/TeachersList";
import UsersList from "../features/users/pages/UsersList";
import UserForm from "../features/users/pages/UserForm";
import EntityManagement from "../features/entities/pages/EntityManagement";
import CompanyProfile from "../features/company/pages/CompanyProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <StudentsList /> },
      { path: "/students", element: <StudentsList /> },
      { path: "/students/new", element: <StudentForm /> },
      { path: "/students/:id", element: <StudentForm /> },
      { path: "/teachers", element: <TeachersList /> },
      { path: "/users", element: <UsersList /> },
      { path: "/users/new", element: <UserForm /> },
      { path: "/users/:id", element: <UserForm /> },
      { path: "/entity-management", element: <EntityManagement /> },
      { path: "/company-profile", element: <CompanyProfile /> },
      // Add other routes as needed
    ],
  },
]);
