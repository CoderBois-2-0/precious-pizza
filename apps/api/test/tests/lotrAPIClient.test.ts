import { env } from "cloudflare:workers";
import { afterEach, beforeEach, vi, describe, it, expect } from "vitest";
import LotrAPIClient from "$/lib/lotrAPIClient/lotrAPIClient";

let lotrAPIClient: LotrAPIClient;

beforeEach(() => {
  lotrAPIClient = new LotrAPIClient(env.DB_DIRECT_URL, env.THE_ONE_API_TOKEN);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("positive", () => {
  it("Should return random quote from fetch", async () => {
    const jsonFn = vi.fn().mockResolvedValue({
      dialog: "Fly you fools!",
      character: "gandalf:uuid",
    });
    const fetchFn = vi.fn().mockResolvedValue({
      json: jsonFn,
    });
    vi.stubGlobal("fetch", fetchFn);

    const lotrQuote = await lotrAPIClient.getRandomQuote();

    expect(lotrQuote.dialog).toBe("Fly you fools!");
    expect(lotrQuote.characterID).toBe("gandalf:uuid");
  });

  it("Should return character from fetch", async () => {
    const jsonFn = vi.fn().mockResolvedValue({
      docs: [{ name: "Gandalf" }],
    });
    const fetchFn = vi.fn().mockResolvedValue({
      json: jsonFn,
    });
    vi.stubGlobal("fetch", fetchFn);

    const character = await lotrAPIClient.getCharacter("gandalf:uuid");

    expect(character.name).toBe("Gandalf");
  });
});

describe("Negative", () => {
  it("Should return character from fetch", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      status: 500,
    });
    vi.stubGlobal("fetch", fetchFn);

    expect(lotrAPIClient.getCharacter("gandalf:uuid")).rejects.toThrowError();
  });
});
