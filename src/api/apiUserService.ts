type ApiUserService = {
  createUser: (name: string, gender: "male" | "female") => Promise<string>;
};

export const apiUserService: ApiUserService = {
  createUser: async (name, gender) => {
    const response = await fetch(
      "https://6989ef54c04d974bc6a0dfe6.mockapi.io/api/v1/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          gender,
          createdAt: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const data = await response.json();
    return data;
  },
};
