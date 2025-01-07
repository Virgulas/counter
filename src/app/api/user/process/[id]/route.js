export async function GET(req, { params }) {
  const { getUser } = await import('../../utils/utils.mjs');
  const { id } = await params;

  try {
    const user = await getUser(id);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function POST(req, { params }) {
  const { createUser } = await import('../../utils/utils.mjs');
  const { id } = await params;
  const { name, picture } = await req.json();

  try {
    const user = await createUser(id, name, picture);
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { updateUser } = await import('../../utils/utils.mjs');
  const { id } = await params;
  const { newValues } = await req.json();

  try {
    const user = await updateUser(id, newValues);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { deleteUser } = await import('../../utils/utils.mjs');
  const { id } = await params;

  try {
    const user = await deleteUser(id);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
