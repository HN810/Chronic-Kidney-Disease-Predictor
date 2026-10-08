import { useState } from 'react';
import { Activity, Droplet, Heart, TrendingDown } from 'lucide-react';
import PredictionForm from './components/PredictionForm';
import ResultsDisplay from './components/ResultsDisplay';

export interface FormData {
  age: string;
  hemoglobin: string;
  bun: string;
  creatinineLevel: string;
  gfr: string;
  diabetes: boolean;
  hypertension: boolean;
}

function App() {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-4 rounded-2xl shadow-lg">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Chronic Kidney Disease Predictor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter your blood report values to assess your kidney health status.
            This tool uses key biomarkers to provide insights into potential chronic kidney disease risk.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Droplet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Blood Markers</h3>
            </div>
            <p className="text-sm text-gray-600">
              Hemoglobin, BUN, and Creatinine levels
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-800">Health Conditions</h3>
            </div>
            <p className="text-sm text-gray-600">
              Diabetes and Hypertension status
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-gray-800">Kidney Function</h3>
            </div>
            <p className="text-sm text-gray-600">
              Glomerular Filtration Rate (GFR)
            </p>
          </div>
        </div>

        {!showResults ? (
          <PredictionForm onSubmit={handleSubmit} />
        ) : (
          <ResultsDisplay data={formData!} onReset={handleReset} />
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">
            ⚕️ This tool is for educational purposes only and should not replace professional medical advice.
          </p>
          <p>
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
