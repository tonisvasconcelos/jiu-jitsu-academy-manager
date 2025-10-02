import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { 
  Button, 
  Input, 
  Select, 
  Option,
  Field,
  Spinner
} from '@fluentui/react-components';
import { SaveRegular } from '@fluentui/react-icons';

interface CompanyFormData {
  companyName: string;
  companyResponsible: string;
  companyAddress: string;
  phoneNumber: string;
  emailAddress: string;
  website: string;
  taxId: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
}

export default function CompanyProfile() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CompanyFormData>({
    defaultValues: {
      companyName: 'GFTeam',
      companyResponsible: 'Julio Cesar',
      companyAddress: 'Rua Teste9999',
      phoneNumber: '21998010725',
      emailAddress: 'tonisvasconcelos@hotmail.com',
      website: '',
      taxId: '',
      language: 'pt',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24',
      currency: 'BRL',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Company data saved:', data);
      alert('Company information saved successfully!');
    } catch (error) {
      console.error('Error saving company data:', error);
      alert('Failed to save company information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure the preferences of your academy management system</p>
        <p className="text-sm text-gray-500 mt-2">Logged in as: Admin User (System Administrator)</p>
      </div>

      <div className="space-y-8">
        {/* Language Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Language Settings</h2>
          
          <Field
            label="Language Configuration"
            required
          >
            <Select
              value={watch('language')}
              onChange={(_, data) => setValue('language', data.value || 'pt')}
            >
              <Option value="pt">Portuguese (PTB)</Option>
              <Option value="en">English (ENU)</Option>
            </Select>
          </Field>
          
          <p className="text-sm text-gray-500 mt-2">
            Choose the default language for the application interface.
          </p>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Company Name"
                required
                error={errors.companyName?.message}
              >
                <Input
                  {...register('companyName', { required: 'Company name is required' })}
                  placeholder="Enter company name"
                  className="w-full"
                />
              </Field>

              <Field
                label="Company Responsible"
                required
                error={errors.companyResponsible?.message}
              >
                <Input
                  {...register('companyResponsible', { required: 'Company responsible is required' })}
                  placeholder="Enter responsible person"
                  className="w-full"
                />
              </Field>
            </div>

            <Field
              label="Company Address"
              required
              error={errors.companyAddress?.message}
            >
              <Input
                {...register('companyAddress', { required: 'Company address is required' })}
                placeholder="Enter company address"
                className="w-full"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Phone Number"
                error={errors.phoneNumber?.message}
              >
                <Input
                  {...register('phoneNumber')}
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </Field>

              <Field
                label="Email Address"
                error={errors.emailAddress?.message}
              >
                <Input
                  {...register('emailAddress')}
                  type="email"
                  placeholder="Enter email address"
                  className="w-full"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Website"
                error={errors.website?.message}
              >
                <Input
                  {...register('website')}
                  placeholder="Enter website URL"
                  className="w-full"
                />
              </Field>

              <Field
                label="Tax ID"
                error={errors.taxId?.message}
              >
                <Input
                  {...register('taxId')}
                  placeholder="Enter tax identification number"
                  className="w-full"
                />
              </Field>
            </div>

            <Button
              type="submit"
              appearance="primary"
              icon={<SaveRegular />}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="tiny" />
                  Saving...
                </>
              ) : (
                'Save Company Information'
              )}
            </Button>
          </form>
        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field
              label="Date Format"
            >
              <Select
                value={watch('dateFormat')}
                onChange={(_, data) => setValue('dateFormat', data.value || 'DD/MM/YYYY')}
              >
                <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
              </Select>
            </Field>

            <Field
              label="Time Format"
            >
              <Select
                value={watch('timeFormat')}
                onChange={(_, data) => setValue('timeFormat', data.value || '24')}
              >
                <Option value="24">24 Hour</Option>
                <Option value="12">12 Hour (AM/PM)</Option>
              </Select>
            </Field>

            <Field
              label="Currency"
            >
              <Select
                value={watch('currency')}
                onChange={(_, data) => setValue('currency', data.value || 'BRL')}
              >
                <Option value="BRL">Brazilian Real (BRL)</Option>
                <Option value="USD">US Dollar (USD)</Option>
                <Option value="EUR">Euro (EUR)</Option>
                <Option value="GBP">British Pound (GBP)</Option>
              </Select>
            </Field>
          </div>

          <Button
            appearance="primary"
            icon={<SaveRegular />}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 mt-4"
          >
            {isSubmitting ? (
              <>
                <Spinner size="tiny" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>

        {/* Company Logo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Logo</h2>
          
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">No logo uploaded</span>
            </div>
            <div>
              <Button appearance="secondary" className="mb-2">
                Choose Logo
              </Button>
              <Button appearance="subtle" className="ml-2">
                Remove Logo
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Upload your company logo. Recommended size: 200x200px. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
