const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PredictionRequest {
  age: number;
  hemoglobin: number;
  bun: number;
  creatinineLevel: number;
  gfr: number;
  diabetes: number;
  hypertension: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const input: PredictionRequest = await req.json();

    const riskScore = calculateRiskScore(input);
    const riskLevel = getRiskLevel(riskScore);
    const ckdProbability = calculateCKDProbability(input);

    const response = {
      riskScore,
      riskLevel,
      ckdProbability,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function calculateCKDProbability(input: PredictionRequest): number {
  let baseRisk = 0;

  if (input.gfr < 60) {
    baseRisk += 40;
  } else if (input.gfr < 90) {
    baseRisk += 20;
  }

  if (input.creatinineLevel > 1.5) {
    baseRisk += 25;
  } else if (input.creatinineLevel > 1.2) {
    baseRisk += 12;
  }

  if (input.bun > 40) {
    baseRisk += 20;
  } else if (input.bun > 20) {
    baseRisk += 10;
  }

  if (input.hemoglobin < 10) {
    baseRisk += 15;
  } else if (input.hemoglobin < 12) {
    baseRisk += 8;
  }

  if (input.diabetes === 1) {
    baseRisk += 15;
  }

  if (input.hypertension === 1) {
    baseRisk += 15;
  }

  if (input.age > 65) {
    baseRisk += 10;
  } else if (input.age > 55) {
    baseRisk += 5;
  }

  return Math.min(Math.round(baseRisk * 100) / 100, 100);
}

function calculateRiskScore(input: PredictionRequest): number {
  let score = 0;

  if (input.gfr < 60) score += 3;
  else if (input.gfr < 90) score += 1;

  if (input.creatinineLevel > 1.5) score += 2;
  else if (input.creatinineLevel > 1.2) score += 1;

  if (input.hemoglobin < 10) score += 2;
  else if (input.hemoglobin < 12) score += 1;

  if (input.bun > 40) score += 2;
  else if (input.bun > 20) score += 1;

  if (input.diabetes === 1) score += 2;
  if (input.hypertension === 1) score += 2;

  if (input.age > 65) score += 1;

  return score;
}

function getRiskLevel(score: number): "low" | "moderate" | "high" {
  if (score >= 7) return "high";
  if (score >= 4) return "moderate";
  return "low";
}