import { useState } from 'react';
import { ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { FormData } from '../App';
import InputField from './InputField';
import ToggleSwitch from './ToggleSwitch';

interface PredictionFormProps {
  onSubmit: (data: FormData) => void;
}

function PredictionForm({ onSubmit }: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    hemoglobin: '',
    bun: '',
    creatinineLevel: '',
    gfr: '',
    diabetes: false,
    hypertension: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || parseFloat(formData.age) <= 0 || parseFloat(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    if (!formData.hemoglobin || parseFloat(formData.hemoglobin) <= 0) {
      newErrors.hemoglobin = 'Please enter a valid hemoglobin level';
    }
    if (!formData.bun || parseFloat(formData.bun) <= 0) {
      newErrors.bun = 'Please enter a valid BUN level';
    }
    if (!formData.creatinineLevel || parseFloat(formData.creatinineLevel) <= 0) {
      newErrors.creatinineLevel = 'Please enter a valid creatinine level';
    }
    if (!formData.gfr || parseFloat(formData.gfr) <= 0) {
      newErrors.gfr = 'Please enter a valid GFR';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Enter Blood Report Values</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Age"
            value={formData.age}
            onChange={(value) => handleInputChange('age', value)}
            unit="years"
            placeholder="e.g., 45"
            error={errors.age}
            type="number"
          />

          <InputField
            label="Hemoglobin"
            value={formData.hemoglobin}
            onChange={(value) => handleInputChange('hemoglobin', value)}
            unit="g/dL"
            placeholder="e.g., 13.5"
            error={errors.hemoglobin}
            type="number"
            step="0.1"
            info="Normal range: 12-17 g/dL"
          />

          <InputField
            label="Blood Urea Nitrogen (BUN)"
            value={formData.bun}
            onChange={(value) => handleInputChange('bun', value)}
            unit="mg/dL"
            placeholder="e.g., 20"
            error={errors.bun}
            type="number"
            step="0.1"
            info="Normal range: 7-20 mg/dL"
          />

          <InputField
            label="Creatinine Level"
            value={formData.creatinineLevel}
            onChange={(value) => handleInputChange('creatinineLevel', value)}
            unit="mg/dL"
            placeholder="e.g., 1.2"
            error={errors.creatinineLevel}
            type="number"
            step="0.01"
            info="Normal range: 0.6-1.2 mg/dL"
          />

          <InputField
            label="Glomerular Filtration Rate (GFR)"
            value={formData.gfr}
            onChange={(value) => handleInputChange('gfr', value)}
            unit="mL/min"
            placeholder="e.g., 90"
            error={errors.gfr}
            type="number"
            step="0.1"
            info="Normal: >90 mL/min"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pre-existing Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              label="Diabetes"
              checked={formData.diabetes}
              onChange={(checked) => handleInputChange('diabetes', checked)}
            />
            <ToggleSwitch
              label="Hypertension"
              checked={formData.hypertension}
              onChange={(checked) => handleInputChange('hypertension', checked)}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Please ensure all values are from recent blood test reports for accurate assessment.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          Analyze Health Data
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default PredictionForm;
