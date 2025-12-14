import {
  ILotrAPIQuote,
  ILotrQuote,
  ILotrAPICharacter,
  ILotrCharacter,
} from "./types";

class LotrAPIClient {
  #url: string;
  #apiToken: string;

  constructor(apiUrl: string, apiToken: string) {
    this.#url = apiUrl;
    this.#apiToken = apiToken;
  }

  async getRandomQuote(): Promise<ILotrQuote> {
    const quoteRes = await fetch(`${this.#url}/quotes/random`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#apiToken}`,
      },
    });

    const quoteData: ILotrAPIQuote = await quoteRes.json();

    return {
      dialog: quoteData.dialog,
      characterID: quoteData.character,
    };
  }

  async getCharacter(characterID: string): Promise<ILotrCharacter> {
    const characterRes = await fetch(`${this.#url}/character/${characterID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#apiToken}`,
      },
    });

    // a status of 500 is returned upon an invalid ID
    if (characterRes.status === 500) {
      throw new Error("Invalid character ID");
    }

    const characterData: ILotrAPICharacter = await characterRes.json();
    const character = characterData.docs[0];

    return { name: character.name };
  }
}

export default LotrAPIClient;
