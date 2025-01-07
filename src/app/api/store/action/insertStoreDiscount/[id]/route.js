export async function POST(req, { params }) {
  const { insertStoreDiscount } = await import('../../../utils/utils.mjs');
  const { id } = await params;
  const { discount } = await req.json();

  try {
    const store = await insertStoreDiscount(id, discount);
    return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
