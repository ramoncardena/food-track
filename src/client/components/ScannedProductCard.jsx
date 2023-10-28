import { useEffect, useState } from "react";

import ClipLoader from "react-spinners/ClipLoader";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// API
import { addStock, getIngredientByEAN, postIngredient } from "../apis/Notion";
import { CloseRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function ScannedProductCard({ product, ean }) {
  const [ingredient, setIngredient] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const fetchIngredient = (ean) => {
    setIsFetching(true);
    getIngredientByEAN(ean)
      .then((res) => {
        console.log("NOTION INGREDIENT: ", res[0]);
        if (res) {
          setIngredient({
            name: res[0].properties.Name.title[0]?.plain_text,
            grupo: res[0].properties.Grupo.select?.name,
            estado: res[0].properties.Estado.select?.name,
            stock: res[0].properties.Stock?.number,
            proveedor: res[0].properties.Proveedor?.multi_select.map(
              (item) => item?.name
            ),
            formato: res[0].properties.Formato.select?.name,
            tipo: res[0].properties.Tipo.select?.name,
            EAN: res[0].properties.EAN.rich_text[0]?.plain_text,
            pageId: res[0].id,
          });
          setIsFetching(false);
        }
      })
      .catch((err) => {
        setIsFetching(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchIngredient(ean);
  }, []);

  const handleAddProduct = () => {
    if (ingredient?.stock >= 0) {
      setIsFetching(true);
      addStock(ingredient.pageId, ingredient.stock + 1)
        .then((res) => {
          let tmpIngredient = Object.assign({}, ingredient);
          tmpIngredient.stock = tmpIngredient.stock + 1;
          setIngredient(tmpIngredient);
          console.log("STOCK RESULT: ", res);
          setIsFetching(false);
        })
        .catch((err) => {
          setIsFetching(false);
          console.log(err);
        });
    } else {
      setIsFetching(true);
      postIngredient(product.product_name, product.brands, ean)
        .then((res) => {
          setIsFetching(false);
          fetchIngredient(ean);
          console.log("POST RESULT: ", res);
        })
        .catch((err) => {
          setIsFetching(false);
          console.log(err);
        });
    }
  };

  const handleRemoveProduct = () => {
    if (ingredient?.stock) {
      setIsFetching(true);
      addStock(ingredient.pageId, ingredient.stock - 1)
        .then((res) => {
          let tmpIngredient = Object.assign({}, ingredient);
          tmpIngredient.stock = tmpIngredient.stock - 1;
          setIngredient(tmpIngredient);
          console.log("STOCK RESULT: ", res);
          setIsFetching(false);
        })
        .catch((err) => {
          setIsFetching(false);
          console.log(err);
        });
    } else {
      setIsFetching(true);
      postIngredient(product.product_name, product.brands, ean).then((res) =>
        console.log("POST RESULT: ", res).catch((err) => {
          setIsFetching(false);
          console.log(err);
        })
      );
    }
  };

  return (
    <>
      <Paper sx={{ padding: "4px", width: "350px" }} elevation={24}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="rounded"
            alt={product?.image_front_small_url}
            src={product?.image_front_small_url}
            sx={{ width: 74, height: 74, margin: "5px" }}
          />
          <Stack sx={{ maxWidth: "240px" }}>
            <Typography
              sx={{
                fontSize: "22px",
                lineHeight: "22px",
                padding: 0,
                margin: 0,
              }}
            >
              {product?.product_name}
            </Typography>
            <Typography sx={{ fontSize: "16px", padding: 0, margin: 0 }}>
              <i>{product?.brands}</i>
            </Typography>
          </Stack>
        </Box>
      </Paper>

      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          color="error"
          disabled={!ingredient || ingredient?.stock <= 0 || isFetching}
          size="large"
          onClick={() => handleRemoveProduct()}
        >
          <RemoveCircleOutlineIcon fontSize="34px" />
        </IconButton>

        {isFetching ? (
          <ClipLoader size={20} color="#6daa6b" />
        ) : (
          <Typography sx={{ fontSize: "20px", padding: "4px", margin: 0 }}>
            {ingredient?.stock >= 0 ? ingredient.stock : "-"}
          </Typography>
        )}

        <IconButton
          color="success"
          disabled={isFetching}
          size="large"
          onClick={() => handleAddProduct()}
        >
          <AddCircleOutlineIcon fontSize="34px" />
        </IconButton>
      </Stack>
    </>
  );
}
