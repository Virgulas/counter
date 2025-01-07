export async function GET() {
  const { getAllStores } = await import('../../utils/utils.mjs');
  try {
    const stores = await getAllStores();
    return new Response(JSON.stringify(stores), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
