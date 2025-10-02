# Jiu-Jitsu International Team Power App - Development Instructions

## Project Overview
Create a Power Apps Code App (React + TypeScript) for a Jiu-Jitsu International Team management system. The app must be fully bilingual (Portuguese/English) with a header language toggle. No Business Central integration - Power Apps only with Dataverse.

## 0) Project Setup (Power Apps Code Apps)

### Initialize Code App Project
```bash
# Initialize Power Apps Code App
pac code init --displayName "Jiu-Jitsu International Team"

# Install core dependencies
npm install react react-dom react-router-dom
npm install i18next react-i18next
npm install @tanstack/react-query
npm install zod dayjs
npm install @types/react @types/react-dom typescript

# Install UI dependencies
npm install @fluentui/react-components @fluentui/react-icons
npm install tailwindcss postcss autoprefixer

# Install dev dependencies
npm install -D @vitejs/plugin-react vite
npm install -D @types/node
```

### Project Structure
Create this folder structure:
```
src/
├── app/
│   ├── router.tsx
│   ├── queryClient.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── pt.json
│   └── layout/
│       ├── AppLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   └── common/
├── features/
│   ├── students/
│   ├── enrollments/
│   ├── championships/
│   ├── teachers/
│   ├── classes/
│   ├── plans/
│   ├── quality/
│   ├── branches/
│   └── checkin/
├── lib/
│   └── utils.ts
└── styles/
```

## 1) Internationalization Setup (PT/EN)

### Configure i18next
Create `src/app/i18n/index.ts`:
```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pt from "./locales/pt.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: { 
    pt: { translation: pt }, 
    en: { translation: en } 
  },
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
});

export default i18n;
```

### Portuguese Translations (`src/app/i18n/locales/pt.json`):
```json
{
  "app": {
    "title": "Equipe Internacional de Jiu-Jitsu",
    "subtitle": "Sistema de Gestão"
  },
  "nav": {
    "students": "Alunos",
    "enrollments": "Inscrição de Modalidades",
    "championships": "Campeonatos",
    "results": "Resultados por Aluno",
    "teachers": "Professores",
    "classes": "Turmas",
    "plans": "Plano de Luta",
    "quality": "Qualidade & Avaliação",
    "branches": "Filiais",
    "schedule": "Agendamento & Check-in"
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "edit": "Editar",
    "delete": "Excluir",
    "search": "Pesquisar",
    "filter": "Filtrar",
    "add": "Adicionar",
    "loading": "Carregando...",
    "noData": "Nenhum dado encontrado"
  },
  "students": {
    "title": "Alunos",
    "addStudent": "Adicionar Aluno",
    "firstName": "Nome",
    "lastName": "Sobrenome",
    "email": "E-mail",
    "phone": "Telefone",
    "beltLevel": "Faixa",
    "birthDate": "Data de Nascimento",
    "gender": "Gênero",
    "branch": "Filial",
    "active": "Ativo"
  },
  "belts": {
    "white": "Branca",
    "blue": "Azul",
    "purple": "Roxa",
    "brown": "Marrom",
    "black": "Preta"
  },
  "genders": {
    "male": "Masculino",
    "female": "Feminino",
    "other": "Outro"
  }
}
```

### English Translations (`src/app/i18n/locales/en.json`):
```json
{
  "app": {
    "title": "Jiu-Jitsu International Team",
    "subtitle": "Management System"
  },
  "nav": {
    "students": "Students",
    "enrollments": "Student Fight Plans",
    "championships": "Championships",
    "results": "Championship Results (by Student)",
    "teachers": "Teachers",
    "classes": "Classes",
    "plans": "Fight Plans",
    "quality": "Quality & Evaluation",
    "branches": "Branches",
    "schedule": "Classes Schedule & Check-in"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "search": "Search",
    "filter": "Filter",
    "add": "Add",
    "loading": "Loading...",
    "noData": "No data found"
  },
  "students": {
    "title": "Students",
    "addStudent": "Add Student",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "phone": "Phone",
    "beltLevel": "Belt Level",
    "birthDate": "Birth Date",
    "gender": "Gender",
    "branch": "Branch",
    "active": "Active"
  },
  "belts": {
    "white": "White",
    "blue": "Blue",
    "purple": "Purple",
    "brown": "Brown",
    "black": "Black"
  },
  "genders": {
    "male": "Male",
    "female": "Female",
    "other": "Other"
  }
}
```

## 2) Header with Language Toggle

Create `src/app/layout/Header.tsx`:
```typescript
import React from 'react';
import { useTranslation } from "react-i18next";
import { Button } from '@fluentui/react-components';

export default function Header() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="w-full flex items-center justify-between p-4 border-b bg-blue-600 text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">{t("app.title")}</h1>
        <span className="text-sm opacity-90">{t("app.subtitle")}</span>
      </div>
      
      <Button
        appearance="secondary"
        onClick={toggleLanguage}
        className="bg-white text-blue-600 hover:bg-gray-100"
      >
        {i18n.language === "pt" ? "English" : "Português"}
      </Button>
    </header>
  );
}
```

## 3) Main App Layout

Create `src/app/layout/AppLayout.tsx`:
```typescript
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Create `src/app/layout/Sidebar.tsx`:
```typescript
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navigation = [
  { key: 'students', path: '/students' },
  { key: 'enrollments', path: '/enrollments' },
  { key: 'championships', path: '/championships' },
  { key: 'results', path: '/results' },
  { key: 'teachers', path: '/teachers' },
  { key: 'classes', path: '/classes' },
  { key: 'plans', path: '/plans' },
  { key: 'quality', path: '/quality' },
  { key: 'branches', path: '/branches' },
  { key: 'schedule', path: '/schedule' },
];

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

## 4) Routing Setup

Create `src/app/router.tsx`:
```typescript
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import StudentsList from "../features/students/pages/StudentsList";
import StudentForm from "../features/students/pages/StudentForm";
import TeachersList from "../features/teachers/pages/TeachersList";
import ClassesList from "../features/classes/pages/ClassesList";
import ChampionshipsList from "../features/championships/pages/ChampionshipsList";
import BranchesList from "../features/branches/pages/BranchesList";

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
      { path: "/classes", element: <ClassesList /> },
      { path: "/championships", element: <ChampionshipsList /> },
      { path: "/branches", element: <BranchesList /> },
      // Add other routes as needed
    ],
  },
]);
```

## 5) Data Models & Validation

Create `src/features/students/model/student.ts`:
```typescript
import { z } from "zod";

export const StudentSchema = z.object({
  studentId: z.string().uuid().optional(),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  beltLevel: z.enum(["White", "Blue", "Purple", "Brown", "Black"]).default("White"),
  branchId: z.string().uuid().optional(),
  active: z.boolean().default(true),
  documentId: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type Student = z.infer<typeof StudentSchema>;

export const BeltLevels = [
  { value: "White", label: "Branca" },
  { value: "Blue", label: "Azul" },
  { value: "Purple", label: "Roxa" },
  { value: "Brown", label: "Marrom" },
  { value: "Black", label: "Preta" },
] as const;

export const Genders = [
  { value: "Male", label: "Masculino" },
  { value: "Female", label: "Feminino" },
  { value: "Other", label: "Outro" },
] as const;
```

## 6) Students Feature Implementation

Create `src/features/students/pages/StudentsList.tsx`:
```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '@fluentui/react-components';
import { useStudentsList } from '../api/students.api';
import { Student } from '../model/student';

export default function StudentsList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: students, isLoading } = useStudentsList({ search: searchTerm });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t("students.title")}</h2>
        <Button appearance="primary" onClick={() => window.location.href = '/students/new'}>
          {t("students.addStudent")}
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("students.firstName")}</TableHeaderCell>
              <TableHeaderCell>{t("students.lastName")}</TableHeaderCell>
              <TableHeaderCell>{t("students.email")}</TableHeaderCell>
              <TableHeaderCell>{t("students.beltLevel")}</TableHeaderCell>
              <TableHeaderCell>{t("students.branch")}</TableHeaderCell>
              <TableHeaderCell>{t("students.active")}</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student: Student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{t(`belts.${student.beltLevel.toLowerCase()}`)}</TableCell>
                <TableCell>{student.branchId}</TableCell>
                <TableCell>{student.active ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => window.location.href = `/students/${student.studentId}`}>
                    {t("common.edit")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

Create `src/features/students/pages/StudentForm.tsx`:
```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Option, Checkbox } from '@fluentui/react-components';
import { StudentSchema, Student, BeltLevels, Genders } from '../model/student';
import { useUpsertStudent } from '../api/students.api';

export default function StudentForm() {
  const { t } = useTranslation();
  const { mutate: upsertStudent, isPending } = useUpsertStudent();
  
  const { register, handleSubmit, formState: { errors } } = useForm<Student>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      active: true,
      beltLevel: "White"
    }
  });

  const onSubmit = (data: Student) => {
    upsertStudent(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("students.addStudent")}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("students.firstName")}</label>
            <Input {...register("firstName")} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t("students.lastName")}</label>
            <Input {...register("lastName")} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("students.email")}</label>
          <Input {...register("email")} type="email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("students.phone")}</label>
          <Input {...register("phone")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("students.beltLevel")}</label>
            <Select {...register("beltLevel")}>
              {BeltLevels.map((belt) => (
                <Option key={belt.value} value={belt.value}>
                  {belt.label}
                </Option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t("students.gender")}</label>
            <Select {...register("gender")}>
              {Genders.map((gender) => (
                <Option key={gender.value} value={gender.value}>
                  {gender.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("students.birthDate")}</label>
          <Input {...register("birthDate")} type="date" />
        </div>

        <div className="flex items-center">
          <Checkbox {...register("active")} />
          <label className="ml-2">{t("students.active")}</label>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" appearance="primary" disabled={isPending}>
            {isPending ? t("common.loading") : t("common.save")}
          </Button>
          <Button type="button" onClick={() => window.history.back()}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

## 7) API Layer

Create `src/features/students/api/students.api.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Mock data for development - replace with actual Dataverse calls
const mockStudents: Student[] = [
  {
    studentId: "1",
    firstName: "João",
    lastName: "Silva",
    email: "joao@email.com",
    phone: "+55 11 99999-9999",
    beltLevel: "Blue",
    gender: "Male",
    active: true,
    birthDate: "1990-01-01"
  },
  {
    studentId: "2",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria@email.com",
    phone: "+55 11 88888-8888",
    beltLevel: "Purple",
    gender: "Female",
    active: true,
    birthDate: "1992-05-15"
  }
];

export function useStudentsList(params?: { search?: string; branchId?: string }) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredStudents = mockStudents;
      
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredStudents = mockStudents.filter(student => 
          student.firstName.toLowerCase().includes(search) ||
          student.lastName.toLowerCase().includes(search) ||
          student.email?.toLowerCase().includes(search)
        );
      }
      
      return filteredStudents;
    },
  });
}

export function useUpsertStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: Student) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (student.studentId) {
        // Update existing student
        const index = mockStudents.findIndex(s => s.studentId === student.studentId);
        if (index !== -1) {
          mockStudents[index] = student;
        }
      } else {
        // Create new student
        student.studentId = Date.now().toString();
        mockStudents.push(student);
      }
      
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      // Navigate back to list
      window.location.href = '/students';
    },
  });
}
```

## 8) Main App Entry Point

Create `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './app/router'
import { RouterProvider } from 'react-router-dom'
import './app/i18n'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

## 9) Package.json Configuration

Update `package.json`:
```json
{
  "name": "jiu-jitsu-team-app",
  "version": "1.0.0",
  "description": "Jiu-Jitsu International Team Management System",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0",
    "@tanstack/react-query": "^4.24.0",
    "zod": "^3.20.0",
    "dayjs": "^1.11.0",
    "@fluentui/react-components": "^9.45.0",
    "@fluentui/react-icons": "^2.0.220",
    "react-hook-form": "^7.43.0",
    "@hookform/resolvers": "^2.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 10) Vite Configuration

Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 11) Development Steps

1. **Initialize the project** with the commands above
2. **Create the folder structure** as specified
3. **Implement internationalization** with PT/EN support
4. **Build the main layout** with header and sidebar
5. **Implement Students feature** first (list, form, validation)
6. **Add other features** one by one following the same pattern
7. **Test language switching** works throughout the app
8. **Deploy to Power Apps** using `npm run build` and `pac code push`

## 12) Key Features to Implement

### Phase 1 (MVP):
- ✅ Students management (CRUD)
- ✅ Language toggle (PT/EN)
- ✅ Basic navigation
- ✅ Form validation with Zod

### Phase 2:
- Teachers management
- Branches management
- Classes management
- Fight Plans

### Phase 3:
- Student enrollments
- Championships and results
- Quality evaluations
- Schedule and check-in

## 13) Testing Checklist

- [ ] Language toggle switches all visible text
- [ ] Students list loads and displays data
- [ ] Student form validation works
- [ ] Navigation between pages works
- [ ] Responsive design on mobile
- [ ] All forms save data correctly
- [ ] Search functionality works
- [ ] App deploys to Power Apps without timeout

## 14) Deployment

```bash
# Build the app
npm run build

# Deploy to Power Apps
pac code push
```

This instruction set provides a complete foundation for building a professional Jiu-Jitsu team management system with full bilingual support and modern React patterns.






