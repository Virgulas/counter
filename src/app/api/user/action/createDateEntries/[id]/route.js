export async function POST(req, { params }) {
  const { createDateEntries } = await import('../../../utils/utils.mjs');
  const { id } = await params;

  try {
    const user = await createDateEntries(id);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
