import connectDB from "@/db/connect";
import TaxParameter from "@/models/TaxParameter";

// GET: Fetch all tax parameters
export async function GET() {
  try {
    await connectDB();
    const parameters = await TaxParameter.find(); // Get all parameters
    return new Response(JSON.stringify(parameters), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST: Add new tax parameter
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.year || !data.incomeTax || !data.nationalInsurance) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Create new parameter
    const newParameter = await TaxParameter.create(data);
    return new Response(JSON.stringify(newParameter), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
