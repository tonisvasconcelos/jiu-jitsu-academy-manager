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

