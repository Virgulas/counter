export async function GET(req, { params }) {
  const { getStore } = await import('../../utils/utils.mjs');
  const { id } = await params;

  try {
    const store = await getStore(id);
    return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function POST(req, { params }) {
  const { createStore } = await import('../../utils/utils.mjs');
  const { id } = await params;

  try {
    const store = await createStore(id);
    return new Response(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { updateStore } = await import('../../utils/utils.mjs');
  const { id } = await params;
  const { newValues } = await req.json();

  try {
    const store = await updateStore(id, newValues);
    return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { deleteStore } = await import('../../utils/utils.mjs');
  const { id } = await params;

  try {
    const store = await deleteStore(id);
    return new Response(
      JSON.stringify({
        message: `Store data ${JSON.stringify(store)} was deleted successfully.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
