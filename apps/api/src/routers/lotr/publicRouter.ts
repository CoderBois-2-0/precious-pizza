import { IEnv } from "$routers/types";
import { createRouter } from "$routers/util";
import LotrAPIClient from "$/lib/lotrAPIClient/lotrAPIClient";

interface ILotrEnv extends IEnv {
  Variables: {
    lotrAPIClient: LotrAPIClient;
  };
}

const router = createRouter<ILotrEnv>()
  .use((c, next) => {
    const lotrAPIClient = new LotrAPIClient(
      c.env.THE_ONE_API_URL,
      c.env.THE_ONE_API_TOKEN,
    );
    c.set("lotrAPIClient", lotrAPIClient);

    return next();
  })
  .get("/random", async (c) => {
    try {
      const lotrAPIClient = c.get("lotrAPIClient");
      const quote = await lotrAPIClient.getRandomQuote();

      const character = await lotrAPIClient.getCharacter(quote.characterID);

      return c.json({ quote: quote.dialog, character: character.name });
    } catch (e) {
      return c.json({ message: "Something went wrong" }, 500);
    }
  });

export default router;
