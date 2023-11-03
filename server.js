import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: "An error occurred. Please try again.",
    data: [],
    error: err.message,
    originalError: err.toString(),
  });
});

const port = 6969;

const API_TOKEN = process.env.API_TOKEN;
console.log("API_TOKEN:", API_TOKEN);

const WEI_IN_ETHER = BigInt(1e18);

app.post("/generate-music", async (req, res, next) => {
  try {
    const address = req.body.address;
    const response = await axios.get(
      "https://api.chainbase.online/v1/account/txs",
      {
        params: {
          chain_id: "1",
          address: address,
          page: "1",
          limit: "20",
        },
        headers: {
          "x-api-key": API_TOKEN,
          accept: "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const dataWithEther = response.data.data.map((item) => {
      const bigIntValue = BigInt(item.value);
      const dividedValue = Number(bigIntValue) / Number(WEI_IN_ETHER);
      const stringValue = dividedValue.toString();
      const finalValue = Number(stringValue);

      return {
        ...item,
        value: finalValue,
      };
    });

    const formattedResponse = {
      data: {
        code: response.data.code,
        message: response.data.message,
        data: dataWithEther,
      },
    };
    res.json(formattedResponse);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: "An error occurred. Please try again.",
    data: [],
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
