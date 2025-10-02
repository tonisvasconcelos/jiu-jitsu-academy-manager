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

  // Role-based access control
  const canAddStudents = true; // All users can add students
  const canEditStudents = true; // All users can edit students

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("students.title")}</h2>
          <p className="text-sm text-gray-600">Logged in as: Admin User (System Administrator)</p>
        </div>
        {canAddStudents && (
          <Button appearance="primary" onClick={() => window.location.href = '/students/new'}>
            {t("students.addStudent")}
          </Button>
        )}
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
              <TableHeaderCell>{t("common.actions")}</TableHeaderCell>
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
                <TableCell>{student.active ? t("common.yes") : t("common.no")}</TableCell>
                <TableCell>
                  {canEditStudents && (
                    <Button size="small" onClick={() => window.location.href = `/students/${student.studentId}`}>
                      {t("common.edit")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

