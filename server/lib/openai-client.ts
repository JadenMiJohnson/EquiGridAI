import OpenAI from "openai";

// Uses the OpenAI API client for generating responses and energy insights
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function generateRecommendation(
  persona: "operator" | "cloud",
  companyName: string,
  roi: {
    costSavedUSD: number;
    savingsPct: number;
    emissionsAvoidedTons: number;
    ciiDelta: number;
  },
  controls: any
): Promise<{ text: string; source: "openai" | "rule-based" }> {
  // Check if OpenAI is configured
  const hasOpenAI = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL && process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

  if (!hasOpenAI) {
    return {
      text: generateRuleBasedRecommendation(persona, roi, controls),
      source: "rule-based",
    };
  }

  try {
    const prompt = buildPrompt(persona, companyName, roi, controls);
    
    // The newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an energy & ESG advisor. Be precise, concise, and businesslike. Provide actionable recommendations based on the data provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 500,
    });

    const text = response.choices[0]?.message?.content || generateRuleBasedRecommendation(persona, roi, controls);
    
    return {
      text,
      source: "openai",
    };
  } catch (error) {
    console.error("OpenAI error, falling back to rule-based:", error);
    return {
      text: generateRuleBasedRecommendation(persona, roi, controls),
      source: "rule-based",
    };
  }
}

function buildPrompt(
  persona: "operator" | "cloud",
  companyName: string,
  roi: any,
  controls: any
): string {
  const personaDesc = persona === "operator" ? "Data Center Operator" : "Cloud/Data-Using Company";
  
  return `Company: ${companyName} | Persona: ${personaDesc}

Financial Impact:
- Cost savings: $${roi.costSavedUSD.toLocaleString()} (${roi.savingsPct.toFixed(1)}% reduction)
- Emissions avoided: ${roi.emissionsAvoidedTons.toFixed(2)} tons CO₂
- Community Impact Index improvement: +${roi.ciiDelta.toFixed(1)} points

${persona === "operator" ? 
`Optimization Strategy:
- Cooling setpoint increase: +${controls.cooling_setpoint_delta_f}°F
- Hot/cold containment: ${controls.containment_pct}%
- Batch job deferral: ${controls.batch_deferral_pct}% (peak → off-peak)` :
`Optimization Strategy:
- Workload shift: ${controls.shift_pct}% of training jobs
- Target region: ${controls.target_region}
- Target hours: ${controls.target_hours}`}

Task: Draft a short, executive-level recommendation (3-5 bullets) explaining:
1. Key opportunities for optimization
2. Expected benefits (cost, carbon, community impact)
3. Implementation considerations
4. Next steps

Avoid speculative claims. Only use the provided numbers. Be concise and actionable.`;
}

function generateRuleBasedRecommendation(
  persona: "operator" | "cloud",
  roi: any,
  controls: any
): string {
  if (persona === "operator") {
    return `Based on your facility optimization parameters, we recommend the following strategy:

• Cooling System Optimization: Increasing the cooling setpoint by ${controls.cooling_setpoint_delta_f}°F can reduce cooling energy consumption by approximately ${(controls.cooling_setpoint_delta_f * 6.5).toFixed(0)}%, saving approximately $${(roi.costSavedUSD * 0.4).toLocaleString()} annually while maintaining equipment safety margins.

• Containment Enhancement: Implementing ${controls.containment_pct}% hot/cold aisle containment will improve your PUE from baseline to ~1.3-1.4 range, reducing total facility energy waste and lowering carbon emissions by ${(roi.emissionsAvoidedTons * 0.3).toFixed(1)} tons CO₂ per year.

• Batch Workload Scheduling: Deferring ${controls.batch_deferral_pct}% of non-critical batch jobs from peak hours (3-7pm) to cleaner off-peak windows (9pm-1am) will reduce both cost ($${(roi.costSavedUSD * 0.3).toLocaleString()}) and carbon intensity during high-demand periods.

• Community Impact: These combined optimizations will improve your Community Impact Index by ${roi.ciiDelta.toFixed(1)} points through reduced air pollution and lower energy burden on vulnerable ZIP codes in your service area.

Total Projected Annual Savings: $${roi.costSavedUSD.toLocaleString()} (${roi.savingsPct.toFixed(1)}% reduction)
Carbon Reduction: ${roi.emissionsAvoidedTons.toFixed(1)} tons CO₂/year

Next Steps: Begin with cooling setpoint adjustments (lowest risk, immediate ROI), then implement containment improvements, and finally optimize batch scheduling through workload orchestration tools.`;
  } else {
    return `Based on your cloud workload optimization parameters, we recommend the following strategy:

• Regional Workload Shifting: Moving ${controls.shift_pct}% of AI training and batch compute jobs from ${controls.target_region === "us-west" ? "us-east to us-west" : controls.target_region} can reduce carbon intensity by leveraging regions with cleaner energy grids (higher renewable penetration), avoiding ${(roi.emissionsAvoidedTons * 0.5).toFixed(1)} tons CO₂ annually.

• Off-Peak Scheduling: Targeting ${controls.target_hours} for flexible workloads takes advantage of cleaner grid mix and lower electricity prices during low-demand periods, saving approximately $${(roi.costSavedUSD * 0.6).toLocaleString()} while reducing peak-time grid strain.

• Cost Optimization: Combined regional and temporal shifting delivers ${roi.savingsPct.toFixed(1)}% cost reduction ($${roi.costSavedUSD.toLocaleString()}) without compromising training completion SLAs or model quality.

• Community Impact: Running compute in cleaner regions and hours reduces your operational carbon footprint and improves Community Impact Index by ${roi.ciiDelta.toFixed(1)} points by lowering air pollution and energy burden in high-carbon-intensity zones.

Total Projected Annual Savings: $${roi.costSavedUSD.toLocaleString()} (${roi.savingsPct.toFixed(1)}% reduction)
Carbon Reduction: ${roi.emissionsAvoidedTons.toFixed(1)} tons CO₂/year

Next Steps: Start with time-shifting non-critical batch jobs (immediate savings, minimal risk), then gradually increase regional shifting percentage while monitoring latency and completion times. Consider implementing automated scheduling based on real-time carbon intensity forecasts.`;
  }
}
