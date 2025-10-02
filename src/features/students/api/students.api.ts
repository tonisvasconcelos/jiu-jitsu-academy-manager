import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "../model/student";

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

