interface IAPILotrQuote {
  quote: string;
  character: string;
}

class LotrClient {
  #url: string;

  constructor() {
    this.#url = import.meta.env.VITE_API_URL;
  }

  async getRandomQuote(): Promise<IAPILotrQuote> {
    return {
      quote: 'Fly youo fools',
      character: 'Gandalf',
    };
  }
}

export default LotrClient;
