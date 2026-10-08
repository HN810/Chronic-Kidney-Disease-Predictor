import { CheckCircle2, AlertTriangle, XCircle, RotateCcw, TrendingDown, Droplet, Activity, Loader, Zap } from 'lucide-react';
import { FormData } from '../App';
import { useEffect, useState } from 'react';

interface PredictionResult {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  ckdProbability: number;
  timestamp: string;
}

interface ResultsDisplayProps {
  data: FormData;
  onReset: () => void;
}

function ResultsDisplay({ data, onReset }: ResultsDisplayProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const response = await fetch(`${supabaseUrl}/functions/v1/predict-ckd`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: parseFloat(data.age),
            hemoglobin: parseFloat(data.hemoglobin),
            bun: parseFloat(data.bun),
            creatinineLevel: parseFloat(data.creatinineLevel),
            gfr: parseFloat(data.gfr),
            diabetes: data.diabetes ? 1 : 0,
            hypertension: data.hypertension ? 1 : 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get prediction');
        }

        const result: PredictionResult = await response.json();
        setPrediction(result);
      } catch (err) {
        console.error('Prediction error:', err);
        setError('Unable to calculate prediction. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Analyzing your health data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
          <h2 className="text-xl font-bold text-red-800">Error</h2>
        </div>
        <p className="text-red-700 mb-6">{error}</p>
        <button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!prediction) return null;

  const getRiskConfig = () => {
    switch (prediction.riskLevel) {
      case 'high':
        return {
          icon: XCircle,
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          title: 'High Risk Detected',
          message: 'Your test results indicate a high risk for chronic kidney disease. Immediate medical consultation is strongly recommended.',
          gradient: 'from-red-500 to-orange-500',
        };
      case 'moderate':
        return {
          icon: AlertTriangle,
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Moderate Risk Detected',
          message: 'Your test results show some concerning values. Schedule an appointment with your healthcare provider for further evaluation.',
          gradient: 'from-yellow-500 to-orange-500',
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: 'Low Risk',
          message: 'Your test results appear to be within healthier ranges. Continue maintaining a healthy lifestyle and regular check-ups.',
          gradient: 'from-green-500 to-teal-500',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const getGFRStage = (gfr: number): { stage: string; description: string } => {
    if (gfr >= 90) return { stage: 'Stage 1', description: 'Normal kidney function' };
    if (gfr >= 60) return { stage: 'Stage 2', description: 'Mild kidney damage' };
    if (gfr >= 45) return { stage: 'Stage 3a', description: 'Mild to moderate loss' };
    if (gfr >= 30) return { stage: 'Stage 3b', description: 'Moderate to severe loss' };
    if (gfr >= 15) return { stage: 'Stage 4', description: 'Severe loss' };
    return { stage: 'Stage 5', description: 'Kidney failure' };
  };

  const gfrStage = getGFRStage(parseFloat(data.gfr));

  return (
    <div className="space-y-6">
      <div className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-8 shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`bg-gradient-to-br ${config.gradient} p-3 rounded-xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${config.textColor}`}>{config.title}</h2>
            <p className="text-sm text-gray-600">Risk Score: {prediction.riskScore}/14</p>
          </div>
        </div>
        <p className={`${config.textColor} leading-relaxed`}>{config.message}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-800">CKD Prediction</h3>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-semibold">Estimated CKD Probability</span>
            <span className="text-3xl font-bold text-blue-600">{prediction.ckdProbability.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                prediction.ckdProbability > 70
                  ? 'bg-red-500'
                  : prediction.ckdProbability > 40
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${prediction.ckdProbability}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Based on machine learning analysis of your blood biomarkers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-600">GFR Assessment</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.gfr} mL/min</p>
            <p className="text-sm text-gray-600 mt-1">
              {gfrStage.stage}: {gfrStage.description}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Creatinine Level</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.creatinineLevel} mg/dL</p>
            <p className="text-sm text-gray-600 mt-1">
              {parseFloat(data.creatinineLevel) > 1.2 ? 'Above normal' : 'Normal range'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Age</span>
            <span className="font-semibold text-gray-800">{data.age} years</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Hemoglobin</span>
            <span className="font-semibold text-gray-800">{data.hemoglobin} g/dL</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Blood Urea Nitrogen (BUN)</span>
            <span className="font-semibold text-gray-800">{data.bun} mg/dL</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Diabetes</span>
            <span className={`font-semibold ${data.diabetes ? 'text-red-600' : 'text-green-600'}`}>
              {data.diabetes ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Hypertension</span>
            <span className={`font-semibold ${data.hypertension ? 'text-red-600' : 'text-green-600'}`}>
              {data.hypertension ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Recommended Next Steps:</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
            <span>Schedule a consultation with a nephrologist or your primary care physician</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
            <span>Bring your complete blood report to your appointment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
            <span>Maintain a healthy diet, stay hydrated, and monitor blood pressure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
            <span>Follow up with regular kidney function tests as advised by your doctor</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300"
      >
        <RotateCcw className="w-5 h-5" />
        Test Again
      </button>
    </div>
  );
}

export default ResultsDisplay;
