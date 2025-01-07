export async function POST(req, { params }) {
  const { insertFieldValue } = await import('../../../utils/utils.mjs');
  const { id } = await params;
  const { field, value, vId } = await req.json();

  try {
    const user = await insertFieldValue(id, field, value, vId);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
