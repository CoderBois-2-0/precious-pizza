interface ILotrAPIQuote {
  _id: string;
  id: string;
  dialog: string;
  movie: string;
  character: string;
}

interface ILotrQuote {
  dialog: string;
  characterID: string;
}

interface ILotrAPICharacter {
  docs: {
    _id: string;
    name: string;
    wikiUrl: string;
    race: string;
    birth: string;
    gender: string;
    death: string;
    hair: string;
    height: string;
    realm: string;
    spouse: string;
  }[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

interface ILotrCharacter {
  name: string;
}

export { ILotrAPIQuote, ILotrQuote, ILotrAPICharacter, ILotrCharacter };
