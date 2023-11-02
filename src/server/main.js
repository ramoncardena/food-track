const express = require("express");
// const https = require("https");

const { Client } = require("@notionhq/client");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const port = process.env.PORT || 8001;
require("dotenv").config();

const ViteExpress = require("vite-express");

// const fs = require("fs");
// const key = fs.readFileSync("src/server/key.pem");
// const cert = fs.readFileSync("src/server/cert.pem");

const app = express();

// const server = https
//   .createServer({ key: key, cert: cert }, app)
//   .listen({ port: 3000 }, () =>
//     console.log("Server is listening on port 3000...")
//   );

app.use(cors());

const authToken = process.env.NOTION_INTEGRATION_TOKEN;
const notionDbID = process.env.NOTION_DATABASE_ID;
const notion = new Client({ auth: authToken });

app.patch("/ingredients/:pageId/stock", jsonParser, async (req, res) => {
  const { Stock } = req.body;
  const pageId = req.params.pageId;

  console.log(pageId);
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Stock: {
          number: Stock,
        },
        Estado: {
          select: {
            name: Stock > 0 ? "En Stock" : "Sin Stock",
          },
        },
      },
    });

    res.send(response);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/ingredients", jsonParser, async (req, res) => {
  const { Name, Brand, EAN } = req.body;

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: notionDbID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: Name,
              },
            },
          ],
        },
        Estado: {
          select: {
            name: "En Stock",
          },
        },
        Stock: {
          number: 1,
        },
        Fabricante: {
          rich_text: [
            {
              text: {
                content: Brand,
              },
            },
          ],
        },
        EAN: {
          rich_text: [
            {
              text: {
                content: EAN,
              },
            },
          ],
        },
      },
    });

    res.send(response);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
});

app.get("/ingredients", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: notionDbID,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    res.send(response);
    const { results } = response;
    const ingredients = results.map((result) => {
      return {
        name: result.properties.Name.title[0]?.plain_text,
        grupo: result.properties.Grupo.multi_select.map((item) => item?.name),
        estado: result.properties.Estado.select?.name,
        stock: result.properties.Stock?.number,
        proveedor: result.properties.Proveedor.multi_select.map(
          (item) => item?.name
        ),
        formato: result.properties.Formato.select?.name,
        tipo: result.properties.Tipo.select?.name,
        EAN: result.properties.EAN.rich_text[0]?.plain_text,
      };
    });
    console.log("success", ingredients);
  } catch (error) {
    console.log(error);
  }
});

app.get("/ingredients/ean/:ean", async (req, res) => {
  try {
    var ean = req.params.ean;
    const response = await notion.databases.query({
      database_id: notionDbID,
      filter: {
        property: "EAN",
        rich_text: {
          contains: ean,
        },
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    res.send(response);
    const { results } = response;
    const ingredients = results.map((result) => {
      return {
        name: result.properties.Name.title[0]?.plain_text,
        grupo: result.properties.Grupo.select?.name,
        estado: result.properties.Estado.select?.name,
        stock: result.properties.Stock?.number,
        proveedor: result.properties.Proveedor.multi_select.map(
          (item) => item?.name
        ),
        formato: result.properties.Formato.select?.name,
        tipo: result.properties.Tipo.select?.name,
        EAN: result.properties.EAN.rich_text[0]?.plain_text,
      };
    });
    console.log("success", ingredients);
  } catch (error) {
    console.log(error);
  }
});

app.get("/ingredients/name/:name", async (req, res) => {
  try {
    var name = req.params.name;
    const response = await notion.databases.query({
      database_id: notionDbID,
      filter: {
        property: "Name",
        rich_text: {
          contains: name,
        },
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    res.send(response);
    const { results } = response;
    const ingredients = results.map((result) => {
      return {
        name: result.properties.Name.title[0]?.plain_text,
        grupo: result.properties.Grupo.multi_select.map((item) => item?.name),
        estado: result.properties.Estado.select?.name,
        stock: result.properties.Stock?.number,
        proveedor: result.properties.Proveedor.multi_select.map(
          (item) => item?.name
        ),
        formato: result.properties.Formato.select?.name,
        tipo: result.properties.Tipo.select?.name,
        EAN: result.properties.EAN.rich_text[0]?.plain_text,
      };
    });
    console.log("success", ingredients);
  } catch (error) {
    console.log(error);
  }
});


ViteExpress.listen(app, 443, () =>
  console.log("Server is listening on port 3000...")
);
