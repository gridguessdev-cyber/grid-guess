import { apiGet, apiPost } from "../database";

export async function GET(req: Request, res: Response) {
  const query = `
    SELECT * from levels
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

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { map, country, squareSize, horizontalShift, verticalShift } = body;

  const query = `
    INSERT INTO levels(map, country, squareSize, horizontalShift, verticalShift)
    VALUES(?, ?, ?, ?, ?)
  `;
  const values = [map, country, squareSize, horizontalShift, verticalShift];

  let status, respBody;
  await apiPost(query, values)
    .then(() => {
      status = 200;
      respBody = { message: "Successfully created level" };
    })
    .catch((err) => {
      status = 400;
      respBody = err;
    });
  return Response.json(respBody, {
    status,
  });
}
