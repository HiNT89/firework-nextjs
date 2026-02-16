type ApiUrlService = {
  getUrl: () => Promise<string>;
};

export const apiUrlService: ApiUrlService = {
  getUrl: async () => {
    const response = await fetch(
      "https://6989ef54c04d974bc6a0dfe6.mockapi.io/api/v1/url",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch URL");
    }

    const data = await response.json();
    return data;
  },
};
