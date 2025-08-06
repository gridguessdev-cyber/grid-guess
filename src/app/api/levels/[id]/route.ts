import { apiGet } from "../../database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const query = `
    SELECT * from levels WHERE id=${id}
  `;

  let status, body;
  try {
    await apiGet(query)
      .then((res) => {
        status = 200;
        body = res;
      })
      .catch((err: Error) => {
        status = 400;
        body = { error: err };
      });
    return Response.json(body, {
      status,
    });
  } catch (error: any) {
    console.error(error.message);
    return Response.json(
      { error: error },
      {
        status: 400,
      }
    );
  }
}
