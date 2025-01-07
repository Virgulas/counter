export async function DELETE() {
  const { cleanStores } = await import('../../utils/utils.mjs');
  try {
    await cleanStores();
    return new Response({ status: 200 });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
