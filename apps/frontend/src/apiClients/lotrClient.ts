interface IAPILotrQuote {
  quote: string;
  character: string;
}

class LotrClient {
  #url: string;

  constructor() {
    this.#url = `${import.meta.env.VITE_API_URL}/lotr`;
  }

  async getRandomQuote(): Promise<IAPILotrQuote> {
    const quoteRes = await fetch(`${this.#url}/random`);

    return quoteRes.json() as Promise<IAPILotrQuote>;
  }
}

export default LotrClient;
