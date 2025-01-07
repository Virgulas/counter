export async function GET() {
  const { getAllUsers } = await import('../../utils/utils.mjs');
  try {
    const users = await getAllUsers();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
