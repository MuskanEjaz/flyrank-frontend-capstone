export async function GET() {
  return Response.json({
    status: "ok",
    applicationName: "TaskFlow",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
}
