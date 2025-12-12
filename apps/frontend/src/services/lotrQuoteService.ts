import { useState } from 'react';
import LotrClient from '@/apiClients/lotrClient';

function useLotrQuote() {
  const [quote, setQuote] = useState({
    quote: '',
    character: '',
  });
  const lotrQuoteClient = new LotrClient();

  const getRandomQuote = async () => {
    const quote = await lotrQuoteClient.getRandomQuote();

    setQuote(quote);
  };

  return { getRandomQuote, quote };
}

export { useLotrQuote };
