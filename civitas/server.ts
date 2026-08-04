import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
let ai: GoogleGenAI | null = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully with GEMINI_API_KEY.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found in process.env. Using high-fidelity local persona-engine fallback.");
}

// Highly realistic simulation fallback generator for different advisors when the API key is not present or fails
const localAdvisorEngine = (advisorName: string, category: string, question: string): string => {
  const normalizedQuestion = question.toLowerCase();
  
  if (category === "🏗 Engineering Legends") {
    if (advisorName.includes("Brunel")) {
      return `Isambard Kingdom Brunel: "Ah, looking at this problem, I immediately think of SCALE and structural honesty! To build durable systems, you must not fear the great span or the deep load. Whether it is a grand railway or a iron-hulled steamer, we must build with uncompromising materials and bold dimensions. For '${question}', my advice is to over-engineer the foundation. Do not compromise on the load-bearing parameters, use the highest grade reinforcing steel (Grade 500), and supervise the concrete curing strictly. In Great Britain we conquered rivers by daring to span further; do not shrink your vision."`;
    }
    if (advisorName.includes("Smeaton")) {
      return `John Smeaton: "As the first self-proclaimed civil engineer, I advise systematic observation and mechanical precision. To address '${question}', you must perform rigorous tests. Just as I formulated hydraulic lime to conquer Eddystone Lighthouse, you must optimize your material mixes. Check your soil bearing capacity (CBR) and water-cement ratios. Let your decisions be governed by structural physics, not guess-work. Keep a clear journal of your physical experiments."`;
    }
    if (advisorName.includes("Khan")) {
      return `Fazlur Rahman Khan: "We must think of the entire structure as a unified system, just as I conceived the tube-structure for skyscrapers! For '${question}', look at how forces flow through the network. Do not treat components in isolation; optimize the core and the perimeter. If you are scaling this solution, design modularly to distribute the structural and organizational loads efficiently. High-density design is about efficiency and human spaces."`;
    }
    return `${advisorName}: "An engineering project must be founded on absolute physical truth, strict material specification, and rigorous site supervision. Regarding '${question}', ensure you comply with standard Nigerian design codes (such as BS 8110 or the National Building Code). Keep structural integrity first, minimize cost through optimized cross-sections, and never skip structural safety checks."`;
  }

  if (category === "🇳🇬 Nigerian Engineering & Industry") {
    if (advisorName.includes("Dangote")) {
      return `Aliko Dangote: "In Nigeria and across Africa, the secret to success is deep integration, backward integration, and massive local capacity. For '${question}', you must secure your supply chain. Do not rely on volatile imported items; leverage Nigerian raw materials. Optimize your logistics, build strong local distributor relationships, and maintain highly competitive pricing. Success in Africa is about scale and mastering the local distribution channels."`;
    }
    if (advisorName.includes("Julius Berger")) {
      return `Julius Berger Nigeria Advisor: "Our philosophy is uncompromising German precision adapted to West African conditions. For '${question}', execution is everything. You must deploy heavy equipment, establish self-sufficient batching plants on-site, provide complete PPE/HSE protocols, and enforce strict timelines. Do not cut corners with sand-mixes or cheap steel; invest in long-term infrastructure. That is how we maintain Nigeria's highways and bridges."`;
    }
    if (advisorName.includes("COREN")) {
      return `COREN Professional Practice Guide: "As per the Council for the Regulation of Engineering in Nigeria (COREN) guidelines, any design or construction work relating to '${question}' must be certified by a registered COREN practitioner. Enforce the ERM (Engineering Regulation Monitoring) framework, maintain the professional code of ethics, prevent building collapse by rejecting unlicensed builders, and always sign off design calculations with your official COREN seal."`;
    }
    return `${advisorName}: "Under Nigerian building regulations, we must combat construction fraud and building collapse by implementing proper soil testing, employing certified professionals, securing state planning approvals, and adhering strictly to the Nigerian National Building Code. Ensure local site workers are certified."`;
  }

  if (category === "💼 Business & Investment") {
    if (advisorName.includes("Buffett") || advisorName.includes("Munger")) {
      return `Warren Buffett & Charlie Munger: "Look for businesses with wide economic moats and outstanding management. For '${question}', ask yourself: What is the competitive advantage? Is there pricing power? Do not chase fads. Focus on the compound return of capital, understand your circle of competence, and allocate resources with extreme patience. If the economic moat is shallow, stay away."`;
    }
    if (advisorName.includes("Tony Elumelu")) {
      return `Tony Elumelu: "This is about Africapitalism! Private sector development must drive Africa's social and economic transformation. For '${question}', design a business model that creates both economic dividend and social value for the community. Build strong networks, support local entrepreneurs, and focus on long-term value creation. Do not just look for quick wins; build an institution."`;
    }
    if (advisorName.includes("Awosika")) {
      return `Ibukun Awosika: "In business and life, character and integrity are your greatest assets. Regarding '${question}', align your actions with your ethical core. Build a diverse, capable team, and lead with empathy and resilience. Nigeria's business terrain requires immense grit—do not let short-term gains cloud your long-term reputation."`;
    }
    if (advisorName.includes("Masiyiwa")) {
      return `Strive Masiyiwa: "Look for a problem and solve it! The bigger the problem, the bigger the business opportunity. For '${question}', leverage mobile technology and cloud-based infrastructure to scale your operations. Navigate regulatory challenges through complete compliance and persistence. Keep fighting, remain agile, and empower the youth of Africa."`;
    }
    return `${advisorName}: "A sustainable business requires healthy cash flows, clear customer acquisition strategies, and a strong value proposition. To solve '${question}', test your product in small iterations, listen to active customer feedback, and manage your overhead costs strictly."`;
  }

  if (category === "🚀 Innovation & Technology") {
    if (advisorName.includes("Musk")) {
      return `Elon Musk: "We must analyze this from first principles, not by analogy. Boil things down to their fundamental truths and reason up from there. For '${question}', break it into its absolute physical and logical constraints. Optimize your processes, delete unnecessary steps, automate what remains, and iterate at extreme speed. If you are not blowing up things or failing occasionally, you are not innovating fast enough."`;
    }
    if (advisorName.includes("Jobs")) {
      return `Steve Jobs: "Design is not just what it looks like and feels like. Design is how it works! For '${question}', strip away all the complexity. Make the user experience incredibly intuitive and beautiful. Do not settle for average; build something that leaves a dent in the universe. People don't know what they want until you show it to them."`;
    }
    if (advisorName.includes("Gates")) {
      return `Bill Gates: "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten. For '${question}', think about software scaling. How can we write code or design platforms that run at near-zero marginal cost? Use rigorous data, look for global humanitarian impacts, and build deep developer ecosystems."`;
    }
    return `${advisorName}: "Innovation requires a relentless pursuit of product-market fit, disruptive technological execution, and software-driven scale. For '${question}', leverage modern cloud APIs, state-of-the-art AI systems, and automated pipelines to achieve a 10x improvement over legacy solutions."`;
  }

  if (category === "🎨 Creativity & Brand Building") {
    if (advisorName.includes("West")) {
      return `Kanye West: "We are fighting for absolute creative liberation! The brand must represent the highest form of artistic and physical design. For '${question}', don't let industry standards restrict you. Change the paradigm. Create products that feel like monumental architecture. The branding should be bold, minimal, and uncompromisingly high-concept."`;
    }
    if (advisorName.includes("Ive")) {
      return `Jony Ive: "We must strive for a sense of inevitability in our design. It should feel so simple, clean, and honest that there is no other way it could have been made. Regarding '${question}', remove all decorative clutter. Let the materials speak for themselves. The focus should be on fit, finish, and the quiet dignity of functional beauty."`;
    }
    if (advisorName.includes("Abloh")) {
      return `Virgil Abloh: "Use the '3% rule'—take an existing classic design and modify it by 3% to make it completely fresh and contemporary. For '${question}', fuse high-art theory with streetwear energy. Keep your design language democratic, document your process openly, and design for the youth."`;
    }
    return `${advisorName}: "A great brand is an emotional connection. For '${question}', tell a powerful story. Frame your service around a compelling narrative, maintain consistent high-quality visuals, and build a dedicated community that shares your design values."`;
  }

  if (category === "🏛 Architecture & Urban Design") {
    if (advisorName.includes("Hadid")) {
      return `Zaha Hadid: "The world is not a rectangle! We should dare to play with fluid, organic forms, dynamic structural geometry, and seamless transitions. For '${question}', let the space flow naturally. Don't restrict your layout with standard box grids; experiment with sweeping visual lines, modern lightweight shell concrete, and spectacular perspective views."`;
    }
    if (advisorName.includes("Ingels")) {
      return `Bjarke Ingels: "We practice 'Hedonistic Sustainability'—designing buildings that are both highly sustainable and incredibly fun to live in! For '${question}', look for the hidden win-win. How can we turn a structural constraint into a spectacular public amenity, a rooftop garden, or a social hub? Let your design be a physical diagram of human needs."`;
    }
    return `${advisorName}: "Architecture must respond to its environment, climate, and community history. For '${question}', incorporate sustainable materials, passive solar shading, cross-ventilation, and rainwater harvesting. Create spaces that inspire the human spirit while preserving local ecology."`;
  }

  return `${advisorName}: "Regarding '${question}', we must unite clear planning, rigorous professional standards, and persistent personal growth. Focus on execution, build a supportive team culture, and ensure your long-term roadmap aligns with absolute quality."`;
};

// API Endpoint for AI Council Advice
app.post("/api/ai-council", async (req, res) => {
  const { question, selectedAdvisors, activeBoardName } = req.body;

  if (!question || !selectedAdvisors || !Array.isArray(selectedAdvisors)) {
    return res.status(400).json({ error: "Missing required parameters: question, selectedAdvisors" });
  }

  try {
    const responses: Array<{ advisorName: string; category: string; text: string }> = [];

    // If Gemini is available, query it for a highly custom, rich advice set
    if (ai) {
      console.log(`Querying Gemini model for: "${question}" with ${selectedAdvisors.length} advisors...`);
      
      const prompts = selectedAdvisors.map(adv => {
        return `As an AI advisor inspired by the professional philosophies, known ideas, and public works of ${adv.name} in the category "${adv.category}", provide an expert perspective answering the user's question: "${question}". Make sure to stay within their professional domain and context, and do NOT impersonate them as a living person, but rather speak as an expert guided by their legacy. Limit your response to 4-5 sentences. Start with "${adv.name}'s Perspective: "`;
      });

      const combinedPrompt = `The user is seeking engineering, business, and leadership advice inside "My Engineering App" (Nigeria's leading construction ecosystem).
User Question: "${question}"

Please provide separate perspectives for each of the following advisors, followed by an overall "Combined Strategic Summary". Keep each advisor's response highly distinct and characteristic of their known public styles and ideas.

Advisors to generate:
${selectedAdvisors.map(a => `- ${a.name} (Category: ${a.category})`).join("\n")}

Format your response as a strict JSON array of objects with the exact keys: "advisorName", "category", "text". 
Also, append one final object in the array with "advisorName": "Integrated Council Recommendation", "category": "Summary", and the combined synthesis in "text". Do not include markdown code block syntax inside the JSON string itself, output raw parseable JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: combinedPrompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are the premium 'AI Council of Legends' backend engine for My Engineering App. You generate insights inspired by the publicly available writings, interviews, research, and styles of influential historical and professional figures. Do not claim to be these people. You must output a valid JSON array of advisor responses.",
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text.trim());
          if (Array.isArray(parsed)) {
            return res.json({ responses: parsed, isSimulated: false });
          }
        } catch (jsonErr) {
          console.warn("Failed to parse Gemini JSON response, falling back to local engine:", jsonErr);
        }
      }
    }

    // High-quality local/simulated fallback
    console.log("Using high-fidelity local persona fallback generator.");
    selectedAdvisors.forEach(adv => {
      const text = localAdvisorEngine(adv.name, adv.category, question);
      responses.push({
        advisorName: adv.name,
        category: adv.category,
        text: text
      });
    });

    // Create a grand integrated summary
    const categoriesRepresented = Array.from(new Set(selectedAdvisors.map(a => a.category)));
    const summaryText = `The AI Council of Legends has synthesized your inquiry: "${question}".
Based on the diverse perspectives of your selected Board (${selectedAdvisors.map(a => a.name).join(", ")}):

1. **Strategic Core**: You must balance physical structural compliance (as emphasized by the Engineering and Construction legends) with aggressive local supply chain control (such as Dangote's backward integration model).
2. **Execution & Scale**: Apply first-principles analysis (Elon Musk style) to strip away systemic construction inefficiencies, ensuring your designs are modular and beautiful (Steve Jobs style).
3. **Professional Trust**: Ensure complete alignment with the COREN regulatory standards and Nigerian Building Codes to eliminate any security, compliance, or structural risks. 
4. **Financial Viability**: Allocate resources with high-moat patience (Warren Buffett style) and seek opportunities that create double-bottom-line value (Africapitalism by Tony Elumelu).

*Disclaimer: This is an AI-generated analysis based on public philosophies. It does not constitute professional certified engineering or financial advice. Always consult a licensed COREN-registered engineer on-site before executing physical work.*`;

    responses.push({
      advisorName: "Integrated Council Recommendation",
      category: "Summary",
      text: summaryText
    });

    return res.json({ responses, isSimulated: true });

  } catch (err: any) {
    console.error("AI Council API error:", err);
    return res.status(500).json({ error: "Failed to generate council advice", details: err.message });
  }
});

// API Endpoint for Ask Us Anything AI-powered Assistant
app.post("/api/ask-us-anything", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing required parameter: question" });
  }

  try {
    let answerText = "";
    let shouldConnectExpert = false;

    const lowerQ = question.toLowerCase();
    if (
      lowerQ.includes("structural") || 
      lowerQ.includes("collapse") || 
      lowerQ.includes("soil") || 
      lowerQ.includes("foundation") || 
      lowerQ.includes("high-rise") || 
      lowerQ.includes("calculation") || 
      lowerQ.includes("concrete loading") || 
      lowerQ.includes("design") || 
      lowerQ.includes("beam") || 
      lowerQ.includes("column") || 
      lowerQ.includes("approval") ||
      lowerQ.includes("engineering")
    ) {
      shouldConnectExpert = true;
    }

    if (ai) {
      const prompt = `The user is asking a question about construction, architecture, building materials, or structural engineering inside My Engineering App (Africa's premier engineering ecosystem).
User Question: "${question}"

Provide a detailed, helpful, and technically accurate answer (2-3 paragraphs max) that highlights safety standards and compliance with the National Building Code of Nigeria.
If the question is about structural sizing, load-bearing capacities, soil tests, or structural design, include a notice that they should work with a COREN-registered structural engineer. Do not use markdown code block syntax inside the answer itself.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the premium 'Ask Us Anything' AI Assistant for My Engineering App. You provide expert, safety-first engineering, construction, and planning support to builders and developers in Nigeria and across Africa.",
          temperature: 0.7,
        }
      });

      answerText = response.text || "";
    }

    // High-quality local fallback if Gemini is not initialized or fails
    if (!answerText) {
      if (lowerQ.includes("soil") || lowerQ.includes("sand")) {
        answerText = "For sandy or muddy soils in coastal regions like Lekki or Victoria Island, a raft foundation or deep piling is almost always mandatory. Standard strip foundations will settle rapidly and lead to structural cracking. Conducting a comprehensive geotechnical soil test is the first non-negotiable step before designing any foundation. This test measures the bearing capacity and soil profile down to 10-30 meters.";
      } else if (lowerQ.includes("cement") || lowerQ.includes("concrete") || lowerQ.includes("ratio")) {
        answerText = "Standard structural concrete for slabs, beams, and columns typically requires a Class 20/25 mix (1:2:4 ratio — 1 part cement, 2 parts sharp sand, 4 parts granite gravel/aggregates) with Grade 42.5R Portland cement (like Dangote or BUA). For non-structural masonry like block-laying or plastering, a 1:4 to 1:6 mix ratio is standard. Never add excess water on-site to increase workability, as this severely compromises the final compressive strength.";
      } else if (lowerQ.includes("steel") || lowerQ.includes("bar") || lowerQ.includes("rebar")) {
        answerText = "Reinforced concrete beams and columns must use high-yield hot-rolled deformed bars (Grade 500 or Grade 410, conforming to BS 4449). Always double-check steel tensile test certifications on My Engineering App's vetted marketplace to ensure you do not procure rusted, brittle, or sub-grade imported iron rods that could fail under bending stress.";
      } else if (lowerQ.includes("collapse") || lowerQ.includes("safety") || lowerQ.includes("fail")) {
        answerText = "Building collapses are almost always caused by five fatal errors: skipping geotechnical soil tests, mixing concrete with substandard ratios, using rusted or thin steel rebars (e.g., using 10mm instead of 16mm for structural columns), loading the structure beyond design limits without approval, and using uncertified site workers. Following the National Building Code (NBC) and securing COREN stamps eliminates these risks.";
      } else {
        answerText = "Welcome to My Engineering App's virtual desk! For safe and regulatory-compliant builds, always verify your material specs (using certified Grade 42.5 cement and High-Tensile steel rebars) and secure formal COREN-stamped drawing sheets. Our unified ecosystem connects you with vetted, licensed experts and standard bulk quarry supplies with integrated escrow guarantees.";
      }
    }

    return res.json({
      answer: answerText,
      shouldConnectExpert,
      suggestedExperts: shouldConnectExpert ? [
        { name: "Engr. Josephine Sintei", role: "COREN Structural Designer", loc: "Ikoyi, Lagos", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
        { name: "Engr. Amadi Alabi", role: "COREN Structural Engineer", loc: "Lekki, Lagos", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }
      ] : []
    });

  } catch (err: any) {
    console.error("Ask Us Anything API error:", err);
    return res.status(500).json({ error: "Failed to process query", details: err.message });
  }
});

// Serve Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production build from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
